import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { Button } from "../../components/common/Button";
import { apiClient } from "../../services/apiClient";
import { adminList } from "../../services/contentService";

const roles = ["admin", "editor", "reviewer", "viewer"];

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "users"], queryFn: () => adminList<any>("users") });
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
  const create = useMutation({
    mutationFn: () => apiClient.post("/admin/users", form),
    onSuccess: () => {
      setForm({ name: "", email: "", password: "", role: "editor" });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    }
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) => apiClient.put(`/admin/users/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  });
  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => apiClient.patch(`/admin/users/${id}/status`, { status: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  });
  const reset = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => apiClient.patch(`/admin/users/${id}/password`, { password }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate();
  }

  return (
    <>
      <div className="admin-heading"><h1>Usuarios y roles</h1></div>
      <form className="editor-form" onSubmit={submit} data-tour="users-create">
        <label>Nombre<input data-tour="user-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input data-tour="user-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password temporal<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Rol<select data-tour="user-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
        <Button type="submit" disabled={create.isPending}>Crear usuario</Button>
      </form>
      <section className="admin-panel">
        <h2>Equipo</h2>
        <div className="table-wrap" data-tour="users-table">
          <table>
            <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Ultimo login</th><th>Acciones</th></tr></thead>
            <tbody>
              {data?.map((user) => (
                <tr key={user._id}>
                  <td><strong>{user.name}</strong><br /><span>{user.email}</span></td>
                  <td><select value={user.role} onChange={(e) => update.mutate({ id: user._id, payload: { role: e.target.value } })}>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></td>
                  <td><select value={user.status} onChange={(e) => status.mutate({ id: user._id, value: e.target.value })}><option value="active">Activo</option><option value="disabled">Desactivado</option></select></td>
                  <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("es-ES") : "Sin registro"}</td>
                  <td><Button type="button" className="secondary" onClick={() => reset.mutate({ id: user._id, password: `Temp${Date.now()}!` })}>Reset password</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

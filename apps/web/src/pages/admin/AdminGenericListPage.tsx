import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentTable } from "../../components/admin/ContentTable";
import { EmptyState } from "../../components/common/EmptyState";
import { adminDelete, adminList } from "../../services/contentService";

export function AdminGenericListPage({ path, title, editBase }: { path: string; title: string; editBase?: string }) {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", path], queryFn: () => adminList<any>(path) });
  const remove = useMutation({
    mutationFn: (id: string) => adminDelete(path, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", path] })
  });
  return (
    <>
      <div className="admin-heading"><h1>{title}</h1>{editBase ? <Link className="btn" to={`${editBase}/new`}><Plus size={18} /> Nuevo</Link> : null}</div>
      {data?.length ? <ContentTable rows={data} editBase={editBase} onDelete={(id) => remove.mutate(id)} /> : <EmptyState title="No hay registros" />}
    </>
  );
}

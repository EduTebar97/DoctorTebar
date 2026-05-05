import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Inquiry } from "@doctor-tebar/shared";
import { adminList } from "../../services/contentService";
import { apiClient } from "../../services/apiClient";

export function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "inquiries"], queryFn: () => adminList<Inquiry>("inquiries") });
  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => apiClient.patch(`/admin/inquiries/${id}/status`, { status: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] })
  });
  return (
    <>
      <div className="admin-heading"><h1>Consultas recibidas</h1></div>
      <div className="inquiry-list">{data?.map((item) => <article className="admin-panel" key={item._id}><h3>{item.name}</h3><p>{item.email} · {item.projectStage} · {item.objectiveType}</p><p>{item.message}</p><select value={item.status} onChange={(e) => status.mutate({ id: item._id, value: e.target.value })}><option value="new">Nueva</option><option value="reviewed">Revisada</option><option value="replied">Respondida</option><option value="archived">Archivada</option></select></article>)}</div>
    </>
  );
}

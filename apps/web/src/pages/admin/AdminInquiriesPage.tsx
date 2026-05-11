import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Inquiry } from "@doctor-tebar/shared";
import { adminList } from "../../services/contentService";
import { apiClient } from "../../services/apiClient";

const statuses = [
  ["new", "Nueva"],
  ["reviewed", "Revisada"],
  ["pending_reply", "Pendiente de respuesta"],
  ["replied", "Respondida"],
  ["meeting_proposed", "Reunion propuesta"],
  ["proposal_sent", "Propuesta enviada"],
  ["accepted", "Aceptada"],
  ["discarded", "Descartada"],
  ["archived", "Archivada"]
];

export function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "inquiries"], queryFn: () => adminList<Inquiry>("inquiries") });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) => apiClient.patch(`/admin/inquiries/${id}/crm`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] })
  });
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Consultas / CRM</h1>
          <p>Gestiona oportunidades, prioridad, proxima accion, fuente y notas internas.</p>
        </div>
      </div>
      <div className="inquiry-list" data-tour="inquiries-list">
        {data?.map((item) => (
          <article className="admin-panel crm-card" key={item._id}>
            <div className="crm-head">
              <div>
                <h3>{item.name}</h3>
                <p>{item.email} · {item.projectStage} · {item.objectiveType}</p>
              </div>
              <span className="badge">{item.priority ?? "medium"}</span>
            </div>
            <p>{item.message}</p>
            <div className="form-grid">
              <label>Estado<select data-tour="inquiry-status" defaultValue={item.status} onChange={(e) => update.mutate({ id: item._id, payload: { status: e.target.value } })}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label>Prioridad<select data-tour="inquiry-priority" defaultValue={item.priority ?? "medium"} onChange={(e) => update.mutate({ id: item._id, payload: { priority: e.target.value } })}><option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option></select></label>
              <label>Valor estimado<input type="number" defaultValue={item.estimatedValue ?? ""} onBlur={(e) => update.mutate({ id: item._id, payload: { estimatedValue: e.target.value } })} /></label>
              <label>Fuente<select defaultValue={item.source ?? "contact_form"} onChange={(e) => update.mutate({ id: item._id, payload: { source: e.target.value } })}><option value="contact_form">Formulario</option><option value="linkedin">LinkedIn</option><option value="email">Email</option><option value="referral">Referido</option><option value="other">Otro</option></select></label>
              <label>Servicio de interes<input defaultValue={item.serviceInterest ?? ""} onBlur={(e) => update.mutate({ id: item._id, payload: { serviceInterest: e.target.value } })} /></label>
              <label>Proxima accion<input data-tour="inquiry-next-action" defaultValue={item.nextAction ?? ""} onBlur={(e) => update.mutate({ id: item._id, payload: { nextAction: e.target.value } })} /></label>
              <label className="span-2">Notas internas<textarea data-tour="inquiry-notes" rows={4} defaultValue={item.internalNotes ?? ""} onBlur={(e) => update.mutate({ id: item._id, payload: { internalNotes: e.target.value } })} /></label>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

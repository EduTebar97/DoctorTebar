import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "../../services/apiClient";

export function AdminAuditPage() {
  const [entity, setEntity] = useState("");
  const { data } = useQuery({
    queryKey: ["admin", "audit", entity],
    queryFn: async () => (await apiClient.get<any[]>("/admin/audit", { params: { entity: entity || undefined } })).data
  });
  return (
    <>
      <div className="admin-heading"><h1>Auditoria</h1></div>
      <div className="filters">
        <span>Entidad</span>
        <select value={entity} onChange={(e) => setEntity(e.target.value)}>
          <option value="">Todas</option>
          {["post", "news", "resource", "service", "settings", "user", "auth", "inquiry", "media"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Usuario</th><th>Accion</th><th>Entidad</th><th>IP</th></tr></thead>
          <tbody>
            {data?.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.createdAt).toLocaleString("es-ES")}</td>
                <td>{log.userId?.name ?? "Sistema"}</td>
                <td>{log.action}</td>
                <td>{log.entity} {log.entityId ? `· ${log.entityId}` : ""}</td>
                <td>{log.ip ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

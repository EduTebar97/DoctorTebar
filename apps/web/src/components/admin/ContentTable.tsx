import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";

export interface Row {
  _id: string;
  title?: string;
  name?: string;
  email?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
  excerpt?: string;
  description?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

function completeness(row: Row) {
  const checks = [row.title ?? row.name, row.excerpt ?? row.description, row.content, row.status, row.seoTitle, row.seoDescription, row.tags?.length];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function ContentTable({ rows, editBase, onDelete }: { rows: Row[]; editBase?: string; onDelete?: (id: string) => void }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Titulo</th><th>Estado</th><th>Completitud</th><th>Fecha</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              <td>{row.title ?? row.name ?? row.email}</td>
              <td>{row.status ?? "-"}</td>
              <td>{completeness(row)}%</td>
              <td>{new Date(row.updatedAt ?? row.createdAt ?? Date.now()).toLocaleDateString("es-ES")}</td>
              <td className="table-actions">
                {editBase ? <Link className="icon-btn" to={`${editBase}/${row._id}/edit`}><Edit size={17} /></Link> : null}
                {onDelete ? <Button className="danger icon-only" onClick={() => onDelete(row._id)}><Trash2 size={17} /></Button> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

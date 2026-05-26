import { AlertTriangle, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
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

interface ConfirmDeleteModalProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDeleteModal({ itemName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return createPortal(
    <div className="desc-modal-overlay" onClick={onCancel}>
      <div className="desc-modal confirm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="desc-modal-close" onClick={onCancel} aria-label="Cancelar">
          <X size={18} />
        </button>
        <div className="confirm-modal-icon">
          <AlertTriangle size={28} />
        </div>
        <h3>¿Eliminar este elemento?</h3>
        <p><strong>"{itemName}"</strong></p>
        <p className="confirm-modal-warning">Esta acción no se puede deshacer.</p>
        <div className="form-actions" style={{ justifyContent: "center", marginTop: 8 }}>
          <Button className="danger" onClick={onConfirm}>
            <Trash2 size={16} /> Eliminar definitivamente
          </Button>
          <Button className="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ContentTable({ rows, editBase, onDelete }: { rows: Row[]; editBase?: string; onDelete?: (id: string) => void }) {
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);

  function requestDelete(row: Row) {
    setPendingDelete(row);
  }

  function confirmDelete() {
    if (pendingDelete && onDelete) {
      onDelete(pendingDelete._id);
    }
    setPendingDelete(null);
  }

  return (
    <>
      {pendingDelete ? (
        <ConfirmDeleteModal
          itemName={pendingDelete.title ?? pendingDelete.name ?? pendingDelete.email ?? "elemento"}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
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
                  {onDelete ? <Button className="danger icon-only" onClick={() => requestDelete(row)}><Trash2 size={17} /></Button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

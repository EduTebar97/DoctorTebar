import { AlertTriangle, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

interface Props {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ itemName, onConfirm, onCancel }: Props) {
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

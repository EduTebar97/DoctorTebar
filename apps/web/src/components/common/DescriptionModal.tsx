import { useEffect } from "react";
import { X } from "lucide-react";

interface DescriptionModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export function DescriptionModal({ title, description, onClose }: DescriptionModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="desc-modal-overlay" onClick={onClose}>
      <div className="desc-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="desc-modal-title">
        <button className="desc-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>
        <h3 id="desc-modal-title">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

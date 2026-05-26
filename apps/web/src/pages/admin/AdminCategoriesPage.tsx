import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import type { BlogCategory } from "@doctor-tebar/shared";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../services/contentService";
import { Button } from "../../components/common/Button";
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal";
import { Loader } from "../../components/common/Loader";

const COLORS = ["#16a34a", "#0284c7", "#7c3aed", "#db2777", "#ea580c", "#ca8a04", "#0f766e", "#475569"];

interface CategoryFormState {
  name: string;
  color: string;
  order: number;
}

const empty: CategoryFormState = { name: "", color: "#16a34a", order: 0 };

export function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: cats = [], isLoading } = useQuery<BlogCategory[]>({
    queryKey: ["admin", "blog-categories"],
    queryFn: () => adminList<BlogCategory>("blog-categories")
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CategoryFormState>(empty);
  const [newForm, setNewForm] = useState<CategoryFormState>(empty);
  const [showNew, setShowNew] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BlogCategory | null>(null);

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "blog-categories"] });
    void qc.invalidateQueries({ queryKey: ["blog-categories"] });
  };

  const create = useMutation({
    mutationFn: (data: CategoryFormState) => adminCreate("blog-categories", data),
    onSuccess: () => { invalidate(); setNewForm(empty); setShowNew(false); }
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormState }) => adminUpdate("blog-categories", id, data),
    onSuccess: () => { invalidate(); setEditingId(null); }
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDelete("blog-categories", id),
    onSuccess: invalidate
  });

  function startEdit(cat: BlogCategory) {
    setEditingId(cat._id);
    setEditForm({ name: cat.name, color: cat.color, order: cat.order });
  }

  if (isLoading) return <Loader />;

  return (
    <div className="admin-categories-page">
      {pendingDelete ? (
        <ConfirmDeleteModal
          itemName={pendingDelete.name}
          onConfirm={() => { remove.mutate(pendingDelete._id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
      <div className="admin-heading">
        <h1>Categorías del blog</h1>
        <Button onClick={() => { setShowNew(true); setEditingId(null); }}>
          <Plus size={16} /> Nueva categoría
        </Button>
      </div>

      <p className="categories-hint">
        Estas categorías aparecen como filtros en el blog público y como opciones al crear un artículo.
      </p>

      {showNew && (
        <div className="category-form-card">
          <h3>Nueva categoría</h3>
          <CategoryForm
            value={newForm}
            onChange={setNewForm}
            onSave={() => create.mutate(newForm)}
            onCancel={() => { setShowNew(false); setNewForm(empty); }}
            saving={create.isPending}
          />
        </div>
      )}

      <div className="category-list">
        {cats.length === 0 && !showNew ? (
          <p className="empty-hint">No hay categorías. Crea la primera para que aparezca en el blog.</p>
        ) : null}
        {cats.map((cat) => (
          <div key={cat._id} className="category-row">
            {editingId === cat._id ? (
              <CategoryForm
                value={editForm}
                onChange={setEditForm}
                onSave={() => update.mutate({ id: cat._id, data: editForm })}
                onCancel={() => setEditingId(null)}
                saving={update.isPending}
              />
            ) : (
              <div className="category-row-view">
                <span className="category-badge-preview" style={{ background: cat.color }}>
                  {cat.name}
                </span>
                <span className="category-slug">/{cat.slug}</span>
                <div className="category-row-actions">
                  <button className="icon-btn" onClick={() => startEdit(cat)} title="Editar"><Edit2 size={15} /></button>
                  <button className="icon-btn danger" onClick={() => setPendingDelete(cat)} title="Eliminar"><Trash2 size={15} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({
  value, onChange, onSave, onCancel, saving
}: {
  value: CategoryFormState;
  onChange: (v: CategoryFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="category-form">
      <input
        className="category-name-input"
        placeholder="Nombre (ej: Causalidad)"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <input
        type="number"
        className="category-order-input"
        placeholder="Orden"
        value={value.order}
        onChange={(e) => onChange({ ...value, order: Number(e.target.value) })}
      />
      <div className="color-picker">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={"color-swatch" + (value.color === c ? " selected" : "")}
            style={{ background: c }}
            onClick={() => onChange({ ...value, color: c })}
            title={c}
          />
        ))}
      </div>
      <div className="category-form-preview">
        <span>Vista previa:</span>
        <span className="category-badge-preview" style={{ background: value.color }}>
          {value.name || "Categoría"}
        </span>
      </div>
      <div className="form-actions">
        <Button onClick={onSave} disabled={saving || !value.name.trim()}>
          <Check size={15} /> Guardar
        </Button>
        <Button className="secondary" onClick={onCancel}>
          <X size={15} /> Cancelar
        </Button>
      </div>
    </div>
  );
}

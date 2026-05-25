import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentTable } from "../../components/admin/ContentTable";
import { EmptyState } from "../../components/common/EmptyState";
import { adminDelete, adminList } from "../../services/contentService";

export function AdminTrainingListPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "training"],
    queryFn: () => adminList<any>("training")
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminDelete("training", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "training"] })
  });

  return (
    <>
      <div className="admin-heading">
        <h1>Formacion</h1>
        <div className="admin-heading-actions">
          <Link className="btn secondary" to="/admin/training/import">
            <Upload size={16} /> Importar
          </Link>
          <Link className="btn" to="/admin/training/new">
            <Plus size={18} /> Nuevo
          </Link>
        </div>
      </div>
      {data?.length
        ? <ContentTable rows={data} editBase="/admin/training" onDelete={(id) => remove.mutate(id)} />
        : <EmptyState title="No hay formaciones" />
      }
    </>
  );
}

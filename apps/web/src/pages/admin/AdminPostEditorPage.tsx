import { PostEditorForm } from "../../components/admin/PostEditorForm";

export function AdminPostEditorPage({ type = "posts" }: { type?: "posts" | "news" }) {
  return (
    <>
      <div className="admin-heading"><h1>{type === "news" ? "Nueva noticia" : "Nuevo post"}</h1></div>
      <PostEditorForm type={type} />
    </>
  );
}

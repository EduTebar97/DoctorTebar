import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Bold, Code, Heading2, Heading3, Image, Italic, List, ListOrdered, Pilcrow, Minus } from "lucide-react";
import { useEffect, useRef } from "react";

export function RichTextEditor({ value, onChange, onUploadImage }: { value: string; onChange: (value: string) => void; onUploadImage?: (file: File) => Promise<string> }) {
  const updatingFromProp = useRef(false);
  const imageInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      if (!updatingFromProp.current) {
        onChange(editor.getHTML());
      }
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      updatingFromProp.current = true;
      editor.commands.setContent(value || "");
      updatingFromProp.current = false;
    }
  }, [value, editor]);

  if (!editor) return null;

  async function insertImage(file: File) {
    if (!onUploadImage) return;
    console.info("[BLOG] Imagen seleccionada", { type: file.type, size: file.size });
    console.info("[BLOG] Subiendo imagen");
    try {
      const url = await onUploadImage(file);
      editor.chain().focus().insertContent(`<img src="${url}" alt="" />`).run();
      console.info("[BLOG] Imagen subida correctamente", { urlPresent: Boolean(url) });
    } catch (error: any) {
      console.error("[BLOG] Error subiendo imagen", error?.response?.data ?? error?.message ?? error);
    }
  }

  function btn(label: string, icon: React.ReactNode, action: () => void, active: boolean) {
    return (
      <button type="button" title={label} onClick={action} className={active ? "rte-btn active" : "rte-btn"}>
        {icon}
      </button>
    );
  }

  return (
    <div className="rich-editor" data-testid="rich-editor">
      <div className="rte-toolbar">
        {btn("Título (H2)", <Heading2 size={15} />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("Subtítulo (H3)", <Heading3 size={15} />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        {btn("Párrafo normal", <Pilcrow size={15} />, () => editor.chain().focus().setParagraph().run(), editor.isActive("paragraph") && !editor.isActive("heading"))}
        <span className="rte-sep" />
        {btn("Negrita", <Bold size={15} />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("Cursiva", <Italic size={15} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        <span className="rte-sep" />
        {btn("Lista con viñetas", <List size={15} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("Lista numerada", <ListOrdered size={15} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        <span className="rte-sep" />
        {btn("Bloque de código", <Code size={15} />, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        {btn("Separador horizontal", <Minus size={15} />, () => editor.chain().focus().setHorizontalRule().run(), false)}
        {onUploadImage ? btn("Insertar imagen", <Image size={15} />, () => imageInput.current?.click(), false) : null}
        <input
          ref={imageInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void insertImage(file);
            event.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
}

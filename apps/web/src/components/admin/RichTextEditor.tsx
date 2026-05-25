import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight,
  Bold, Code, Code2, Eraser, Heading1, Heading2, Heading3, Heading4,
  Highlighter, ImageIcon, Italic, Link2, Link2Off,
  List, ListOrdered, ListTodo, Minus, Pilcrow, Quote,
  Redo, Strikethrough, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Table2, Underline as UnderlineIcon, Undo
} from "lucide-react";
import { useEffect, useRef } from "react";

const COLORS = [
  { label: "Predeterminado", value: "" },
  { label: "Rojo", value: "#f87171" },
  { label: "Naranja", value: "#fb923c" },
  { label: "Amarillo", value: "#facc15" },
  { label: "Verde", value: "#4ade80" },
  { label: "Azul", value: "#60a5fa" },
  { label: "Morado", value: "#c084fc" },
  { label: "Rosa", value: "#f472b6" },
  { label: "Gris", value: "#9ca3af" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, onUploadImage, placeholder }: RichTextEditorProps) {
  const updatingFromProp = useRef(false);
  const imageInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ strike: {} }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder ?? "Escribe el contenido aquí..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!updatingFromProp.current) onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      updatingFromProp.current = true;
      editor.commands.setContent(value || "");
      updatingFromProp.current = false;
    }
  }, [value, editor]);

  if (!editor) return null;

  async function insertImage(file: File) {
    if (!onUploadImage) return;
    try {
      const url = await onUploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (error: any) {
      console.error("[RTE] Error subiendo imagen", error?.response?.data ?? error?.message);
    }
  }

  function insertLink() {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL del enlace:", prev);
    if (url === null) return;
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function btn(label: string, icon: React.ReactNode, action: () => void, active = false, disabled = false) {
    return (
      <button
        key={label}
        type="button"
        title={label}
        disabled={disabled}
        onClick={action}
        className={`rte-btn${active ? " active" : ""}`}
      >
        {icon}
      </button>
    );
  }

  const s = (px: number) => px;

  return (
    <div className="rich-editor" data-testid="rich-editor">
      <div className="rte-toolbar">

        {/* Deshacer / Rehacer */}
        {btn("Deshacer", <Undo size={s(14)} />, () => editor.chain().focus().undo().run(), false, !editor.can().undo())}
        {btn("Rehacer", <Redo size={s(14)} />, () => editor.chain().focus().redo().run(), false, !editor.can().redo())}
        <span className="rte-sep" />

        {/* Estilos de bloque */}
        {btn("Título H1", <Heading1 size={s(15)} />, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {btn("Título H2", <Heading2 size={s(15)} />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("Título H3", <Heading3 size={s(15)} />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        {btn("Título H4", <Heading4 size={s(15)} />, () => editor.chain().focus().toggleHeading({ level: 4 }).run(), editor.isActive("heading", { level: 4 }))}
        {btn("Párrafo", <Pilcrow size={s(15)} />, () => editor.chain().focus().setParagraph().run(), editor.isActive("paragraph") && !editor.isActive("heading"))}
        {btn("Cita", <Quote size={s(15)} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        <span className="rte-sep" />

        {/* Formato de texto */}
        {btn("Negrita", <Bold size={s(15)} />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("Cursiva", <Italic size={s(15)} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {btn("Subrayado", <UnderlineIcon size={s(15)} />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
        {btn("Tachado", <Strikethrough size={s(15)} />, () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
        {btn("Código en línea", <Code size={s(15)} />, () => editor.chain().focus().toggleCode().run(), editor.isActive("code"))}
        {btn("Subíndice", <SubscriptIcon size={s(15)} />, () => editor.chain().focus().toggleSubscript().run(), editor.isActive("subscript"))}
        {btn("Superíndice", <SuperscriptIcon size={s(15)} />, () => editor.chain().focus().toggleSuperscript().run(), editor.isActive("superscript"))}
        <span className="rte-sep" />

        {/* Color de texto */}
        <span className="rte-color-group" title="Color de texto">
          <span className="rte-color-swatch" style={{ background: editor.getAttributes("textStyle").color || "currentColor" }} />
          <select
            className="rte-color-select"
            value={editor.getAttributes("textStyle").color || ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().unsetColor().run();
              else editor.chain().focus().setColor(v).run();
            }}
          >
            {COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </span>
        {btn("Resaltar texto", <Highlighter size={s(15)} />, () => editor.chain().focus().toggleHighlight({ color: "#4ade8066" }).run(), editor.isActive("highlight"))}
        {btn("Quitar formato", <Eraser size={s(15)} />, () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
        <span className="rte-sep" />

        {/* Alineación */}
        {btn("Alinear izquierda", <AlignLeft size={s(15)} />, () => editor.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: "left" }))}
        {btn("Centrar", <AlignCenter size={s(15)} />, () => editor.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: "center" }))}
        {btn("Alinear derecha", <AlignRight size={s(15)} />, () => editor.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: "right" }))}
        {btn("Justificar", <AlignJustify size={s(15)} />, () => editor.chain().focus().setTextAlign("justify").run(), editor.isActive({ textAlign: "justify" }))}
        <span className="rte-sep" />

        {/* Listas */}
        {btn("Lista con viñetas", <List size={s(15)} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("Lista numerada", <ListOrdered size={s(15)} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {btn("Lista de tareas", <ListTodo size={s(15)} />, () => editor.chain().focus().toggleTaskList().run(), editor.isActive("taskList"))}
        <span className="rte-sep" />

        {/* Enlace */}
        {btn("Insertar enlace", <Link2 size={s(15)} />, insertLink, editor.isActive("link"))}
        {editor.isActive("link") ? btn("Quitar enlace", <Link2Off size={s(15)} />, () => editor.chain().focus().unsetLink().run()) : null}
        <span className="rte-sep" />

        {/* Tabla */}
        {btn("Insertar tabla 3×3", <Table2 size={s(15)} />, insertTable)}
        {editor.isActive("table") ? (
          <>
            {btn("Añadir columna", <span className="rte-text-btn">+col</span>, () => editor.chain().focus().addColumnAfter().run())}
            {btn("Añadir fila", <span className="rte-text-btn">+fila</span>, () => editor.chain().focus().addRowAfter().run())}
            {btn("Borrar columna", <span className="rte-text-btn">−col</span>, () => editor.chain().focus().deleteColumn().run())}
            {btn("Borrar fila", <span className="rte-text-btn">−fila</span>, () => editor.chain().focus().deleteRow().run())}
            {btn("Borrar tabla", <span className="rte-text-btn">×tabla</span>, () => editor.chain().focus().deleteTable().run())}
          </>
        ) : null}
        <span className="rte-sep" />

        {/* Otros */}
        {btn("Bloque de código", <Code2 size={s(15)} />, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        {btn("Separador horizontal", <Minus size={s(15)} />, () => editor.chain().focus().setHorizontalRule().run())}
        {onUploadImage ? btn("Insertar imagen", <ImageIcon size={s(15)} />, () => imageInput.current?.click()) : null}
        <input
          ref={imageInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void insertImage(f); e.target.value = ""; }}
        />
      </div>

      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      data-testid="rich-editor"
      rows={12}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="<p>Contenido del articulo...</p>"
    />
  );
}

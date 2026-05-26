import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Trash2, User, BookOpen, Tag, Filter, BarChart2, Users } from "lucide-react";
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal";
import {
  deleteChatMessage,
  getAdminChatMessages,
  getAdminChatMetrics,
  updateChatMessageStatus,
  type ChatMetrics
} from "../../services/contentService";
import type { TrainingChatMessage } from "@doctor-tebar/shared";

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo",
  reviewed: "Revisado",
  replied: "Respondido",
  archived: "Archivado"
};

const STATUS_COLORS: Record<string, string> = {
  new: "#2563eb",
  reviewed: "#d97706",
  replied: "#16a34a",
  archived: "#6b7280"
};

type Tab = "mensajes" | "metricas";

export function AdminChatPage() {
  const [tab, setTab] = useState<Tab>("mensajes");

  return (
    <>
      <div className="admin-heading">
        <h1>Chat de formación</h1>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e5e7eb" }}>
        <TabButton active={tab === "mensajes"} onClick={() => setTab("mensajes")} icon={<MessageCircle size={14} />} label="Mensajes" />
        <TabButton active={tab === "metricas"} onClick={() => setTab("metricas")} icon={<BarChart2 size={14} />} label="Métricas" />
      </div>

      {tab === "mensajes" && <MessagesTab />}
      {tab === "metricas" && <MetricsTab />}
    </>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
        border: "none", background: "none", cursor: "pointer", fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? "#111827" : "#6b7280",
        borderBottom: active ? "2px solid #111827" : "2px solid transparent",
        marginBottom: -1
      }}
    >
      {icon}{label}
    </button>
  );
}

// ─── Pestaña Mensajes ─────────────────────────────────────────────────────────

function MessagesTab() {
  const qc = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterBlock, setFilterBlock] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [active, setActive] = useState<{ course?: string; user?: string; topic?: string; block?: string; status?: string }>({});

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["admin-chat", active],
    queryFn: () => {
      if (active.course) console.log("[CHAT ADMIN] Aplicando filtro por formación:", active.course);
      if (active.user) console.log("[CHAT ADMIN] Aplicando filtro por usuario:", active.user);
      return getAdminChatMessages(active);
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateChatMessageStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-chat"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChatMessage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-chat"] })
  });

  function apply() {
    const f: typeof active = {};
    if (filterCourse.trim()) f.course = filterCourse.trim();
    if (filterUser.trim()) f.user = filterUser.trim();
    if (filterTopic.trim()) f.topic = filterTopic.trim();
    if (filterBlock.trim()) f.block = filterBlock.trim();
    if (filterStatus) f.status = filterStatus;
    setActive(f);
  }

  function clear() {
    setFilterCourse(""); setFilterUser(""); setFilterTopic(""); setFilterBlock(""); setFilterStatus("");
    setActive({});
  }

  return (
    <>
      {pendingDelete ? (
        <ConfirmDeleteModal
          itemName={pendingDelete.label}
          onConfirm={() => { deleteMutation.mutate(pendingDelete.id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Filter size={14} /><strong style={{ fontSize: 14 }}>Filtros</strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Formación (slug)</label>
            <input className="form-input" placeholder="ej: introduccion-clinica" value={filterCourse}
              onChange={e => setFilterCourse(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Usuario (nombre o email)</label>
            <input className="form-input" placeholder="ej: Ana García" value={filterUser}
              onChange={e => setFilterUser(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Bloque</label>
            <input className="form-input" placeholder="ej: fundamentos" value={filterBlock}
              onChange={e => setFilterBlock(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Tema</label>
            <input className="form-input" placeholder="ej: cohortes" value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Estado</label>
            <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="new">Nuevo</option>
              <option value="reviewed">Revisado</option>
              <option value="replied">Respondido</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={apply} style={{ fontSize: 13 }}>Aplicar filtros</button>
          <button className="btn btn-ghost" onClick={clear} style={{ fontSize: 13 }}>Limpiar</button>
        </div>
      </section>

      <section className="admin-panel">
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <MessageCircle size={16} />
          Historial de mensajes
          <span style={{ fontSize: 12, fontWeight: 400, color: "#6b7280", marginLeft: 4 }}>
            {messages.length} resultado{messages.length !== 1 ? "s" : ""} · ordenado por más reciente
          </span>
        </h2>

        {isLoading && <p style={{ color: "#6b7280", fontSize: 14 }}>Cargando mensajes…</p>}
        {isError && <p style={{ color: "#dc2626", fontSize: 14 }}>Error al cargar los mensajes.</p>}

        {!isLoading && !isError && messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
            <MessageCircle size={40} style={{ margin: "0 auto 12px" }} />
            <p>No hay mensajes con los filtros actuales.</p>
          </div>
        )}

        {messages.map(msg => (
          <ChatMessageCard key={msg._id} msg={msg}
            onStatus={status => statusMutation.mutate({ id: msg._id, status })}
            onDelete={() => setPendingDelete({ id: msg._id, label: `${msg.name} — "${msg.message.slice(0, 50)}${msg.message.length > 50 ? "…" : ""}"` })}
          />
        ))}
      </section>
    </>
  );
}

// ─── Pestaña Métricas ─────────────────────────────────────────────────────────

function MetricsTab() {
  const [metricsFilterCourse, setMetricsFilterCourse] = useState("");
  const [metricsFilterUser, setMetricsFilterUser] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-chat-metrics"],
    queryFn: getAdminChatMetrics
  });

  if (isLoading) return <p style={{ color: "#6b7280", fontSize: 14 }}>Calculando métricas…</p>;
  if (isError || !data) return <p style={{ color: "#dc2626", fontSize: 14 }}>Error al cargar métricas.</p>;

  const filteredFormations = metricsFilterCourse
    ? data.byFormation.filter(f => f.courseTitle.toLowerCase().includes(metricsFilterCourse.toLowerCase()) || f.courseSlug.includes(metricsFilterCourse.toLowerCase()))
    : data.byFormation;

  const filteredUsers = metricsFilterUser
    ? data.byUser.filter(u => u.name.toLowerCase().includes(metricsFilterUser.toLowerCase()) || u.email.toLowerCase().includes(metricsFilterUser.toLowerCase()))
    : data.byUser;

  return (
    <>
      {/* Tarjetas resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        <MetricCard label="Total mensajes" value={data.total} color="#2563eb" />
        <MetricCard label="Mensajes nuevos" value={data.open} color="#d97706" />
        <MetricCard label="Formaciones activas" value={data.byFormation.length} color="#7c3aed" />
        <MetricCard label="Usuarios activos" value={data.byUser.length} color="#16a34a" />
        <MetricCard label="Usuarios en varias formaciones" value={data.usersWithMultipleCourses} color="#dc2626" />
      </div>

      {/* Por formación */}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <BookOpen size={15} /> Mensajes por formación
          </h2>
          <input className="form-input" style={{ maxWidth: 220, fontSize: 13 }}
            placeholder="Filtrar por formación…"
            value={metricsFilterCourse} onChange={e => setMetricsFilterCourse(e.target.value)} />
        </div>
        {filteredFormations.length === 0
          ? <p style={{ color: "#9ca3af", fontSize: 13 }}>Sin datos.</p>
          : filteredFormations.map(f => (
            <div key={f.courseSlug} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{f.courseTitle}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{f.courseSlug}</p>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                <span><strong>{f.total}</strong> mensaje{f.total !== 1 ? "s" : ""}</span>
                <span style={{ color: "#d97706" }}><strong>{f.open}</strong> nuevos</span>
                <span style={{ color: "#7c3aed" }}><strong>{f.distinctUserCount}</strong> usuario{f.distinctUserCount !== 1 ? "s" : ""}</span>
              </div>
              <FormationBar value={f.total} max={Math.max(...data.byFormation.map(x => x.total), 1)} />
            </div>
          ))
        }
      </section>

      {/* Por usuario */}
      <section className="admin-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <Users size={15} /> Seguimiento por usuario
          </h2>
          <input className="form-input" style={{ maxWidth: 220, fontSize: 13 }}
            placeholder="Filtrar por usuario…"
            value={metricsFilterUser} onChange={e => setMetricsFilterUser(e.target.value)} />
        </div>
        {filteredUsers.length === 0
          ? <p style={{ color: "#9ca3af", fontSize: 13 }}>Sin datos.</p>
          : filteredUsers.map(u => <UserMetricCard key={u._id} user={u} />)
        }
      </section>
    </>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fff" }}>
      <p style={{ fontSize: 28, fontWeight: 700, color, margin: "0 0 4px" }}>{value}</p>
      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{label}</p>
    </div>
  );
}

function FormationBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ width: 80, height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: "#2563eb", borderRadius: 99 }} />
    </div>
  );
}

function UserMetricCard({ user }: { user: ChatMetrics["byUser"][number] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 12, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <User size={13} color="#6b7280" />
            <strong style={{ fontSize: 13 }}>{user.name}</strong>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{user.email}</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 10 }}>
            <span>Conversaciones abiertas: <strong style={{ color: "#d97706" }}>{user.openMessages}</strong></span>
            <span>Formaciones distintas: <strong style={{ color: "#7c3aed" }}>{user.distinctCourses}</strong></span>
            <span>Total mensajes: <strong>{user.totalMessages}</strong></span>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Formaciones:</p>
            <ul style={{ fontSize: 12, color: "#374151", paddingLeft: 16, margin: 0 }}>
              {user.courses.map(c => (
                <li key={c.slug}>{c.title}: <strong>{c.count}</strong> mensaje{c.count !== 1 ? "s" : ""}</li>
              ))}
            </ul>
          </div>
        </div>
        {user.lastActivity && (
          <p style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
            Última actividad:<br />{new Date(user.lastActivity).toLocaleString("es-ES")}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de mensaje ───────────────────────────────────────────────────────

function ChatMessageCard({ msg, onStatus, onDelete }: {
  msg: TrainingChatMessage;
  onStatus: (s: string) => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 12, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <User size={13} color="#6b7280" />
            <strong style={{ fontSize: 13 }}>{msg.name}</strong>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{msg.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <BookOpen size={12} color="#6b7280" />
            <span style={{ fontSize: 12, color: "#374151" }}>{msg.courseTitle}</span>
            {msg.blockTitle && (
              <><Tag size={11} color="#9ca3af" /><span style={{ fontSize: 12, color: "#6b7280" }}>Bloque: {msg.blockTitle}</span></>
            )}
            {msg.topicTitle && (
              <><Tag size={11} color="#9ca3af" /><span style={{ fontSize: 12, color: "#6b7280" }}>{msg.topicTitle}</span></>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#111827", margin: "8px 0", lineHeight: 1.5 }}>{msg.message}</p>
          <p style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(msg.createdAt).toLocaleString("es-ES")}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
            background: `${STATUS_COLORS[msg.status]}22`, color: STATUS_COLORS[msg.status]
          }}>
            {STATUS_LABELS[msg.status] ?? msg.status}
          </span>
          <select
            style={{ fontSize: 12, padding: "3px 6px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer" }}
            value={msg.status} onChange={e => onStatus(e.target.value)} title="Cambiar estado"
          >
            <option value="new">Nuevo</option>
            <option value="reviewed">Revisado</option>
            <option value="replied">Respondido</option>
            <option value="archived">Archivado</option>
          </select>
          <button onClick={onDelete}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}
            title="Eliminar mensaje">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

export function StatCard({ label, value, icon }: { label: string; value: number | string; icon?: ReactNode }) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </div>
  );
}

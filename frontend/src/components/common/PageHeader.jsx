export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-aegis-primary">{eyebrow}</p>}
      <h2 className="mt-1 text-3xl font-bold text-slate-950">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-slate-600">{description}</p>}
    </div>
  );
}

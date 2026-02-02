type Props = {
  title: string;
  value: string | number;
  trend?: string;
  subtext?: string;
};

export default function KpiCard({ title, value, trend, subtext }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider text-black">{title}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <h2 className="text-3xl font-bold text-[#0F172A]">{value}</h2>
        {trend && <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}
import { Cloud } from "./deco/Cloud";

interface EmptyStateProps {
  onClear?: () => void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Cloud variant="b" className="h-20 w-32 text-petal/60" />
      <p className="font-display text-lg font-bold text-plum">لا توجد ألعاب مطابقة</p>
      {onClear && (
        <button type="button" onClick={onClear} className="mt-1 rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white">
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}

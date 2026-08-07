import { Cloud } from "./deco/Cloud";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Cloud variant="c" className="h-24 w-40 text-petal/60" />
      <p className="font-display text-lg font-bold text-plum">عذراً، حدث خطأ</p>
      <p className="max-w-sm text-sm text-plum/70">{message}</p>
    </div>
  );
}

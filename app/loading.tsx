function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-cloud shadow-sm">
      <div className="aspect-square bg-petal/20" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-16 rounded-full bg-petal/20" />
        <div className="h-4 w-3/4 rounded bg-petal/20" />
        <div className="h-3 w-1/2 rounded bg-petal/20" />
        <div className="mt-1 h-8 w-full rounded-full bg-petal/20" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

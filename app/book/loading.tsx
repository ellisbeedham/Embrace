export default function BookLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="h-8 bg-embrace-muted/20 rounded w-48 mb-2 animate-pulse" />
      <div className="h-5 bg-embrace-muted/20 rounded w-64 mb-8 animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-embrace-muted/10 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

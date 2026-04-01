export default function PlansLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="h-10 bg-embrace-muted/20 rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-5 bg-embrace-muted/20 rounded w-48 mx-auto animate-pulse" />
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-embrace-muted/10 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function CategorySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <section>
      <h2 className="text-lg font-medium mb-4 border-b pb-2">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
}

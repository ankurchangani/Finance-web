export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--background, #0a0f1e)" }}
    >
      {children}
    </div>
  );
}
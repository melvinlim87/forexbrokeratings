export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6f7fa] to-[#e7eaf3] dark:from-zinc-900 dark:to-zinc-800">
      {children}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <main className="min-h-dvh lg:flex lg:justify-center">
        <div
          className="
            w-full min-h-dvh bg-white
            lg:min-h-0 lg:w-[600px] lg:h-dvh
            lg:shadow-xl lg:overflow-hidden
          "
        >
          <div className="min-h-dvh lg:h-full lg:overflow-y-auto lg:scrollbar-none lg:text-[18px] pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

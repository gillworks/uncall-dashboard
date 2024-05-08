import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Coming soon</h3>
          <p className="text-sm text-muted-foreground">
            Dashboard coming in a future release.
          </p>
        </div>
      </div>
    </main>
  );
}

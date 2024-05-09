import { NumbersTable } from './numbers-table';
import { AddNumberDialog } from '@/components/numbers/AddNumberDialog';

export default async function NumbersPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Numbers</h1>
        <div className="ml-auto">
          <AddNumberDialog />
        </div>
      </div>
      <NumbersTable />
    </main>
  );
}

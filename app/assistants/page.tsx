import { getUsers, getAssistants } from '@/lib/db';
import { UsersTable } from '../users-table';
import { AssistantsTable } from '../assistants-table';
import { Search } from '../search';
import { AddAssistantDialog } from '@/components/assistants/AddAssistantDialog';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { assistants, newOffset } = await getAssistants(search, Number(offset));

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Assistants</h1>
        <div className="ml-auto">
          <AddAssistantDialog />
        </div>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
      <AssistantsTable assistants={assistants} offset={newOffset} />
    </main>
  );
}

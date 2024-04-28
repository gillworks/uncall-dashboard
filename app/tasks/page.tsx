import { TasksTable } from './tasks-table';

export default async function TasksPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Tasks</h1>
      </div> */}
      <TasksTable />
    </main>
  );
}

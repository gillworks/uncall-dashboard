import { TasksTable } from './tasks-table';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';

export default async function TasksPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Tasks</h1>
        <div className="ml-auto">
          <AddTaskDialog />
        </div>
      </div>
      <TasksTable />
    </main>
  );
}

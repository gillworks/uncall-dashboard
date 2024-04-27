'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SelectAssistant } from '@/lib/db';
import { deleteAssistant } from './actions';
import { useRouter } from 'next/navigation';

export function AssistantsTable({
  assistants,
  offset
}: {
  assistants: SelectAssistant[];
  offset: number | null;
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Model</TableHead>
              <TableHead className="hidden md:table-cell">Voice</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.map((assistant) => (
              <AssistantRow key={assistant.id} assistant={assistant} />
            ))}
          </TableBody>
        </Table>
      </form>
      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}

function AssistantRow({ assistant }: { assistant: SelectAssistant }) {
  const assistantId = assistant.id;
  const deleteAssistantWithId = deleteAssistant.bind(null, assistantId);

  return (
    <TableRow>
      <TableCell className="font-medium">{assistant.name}</TableCell>
      <TableCell className="hidden md:table-cell">{JSON.stringify(assistant.model)}</TableCell>
      <TableCell>{JSON.stringify(assistant.voice)}</TableCell>
      <TableCell>
        <Button
          className="w-full"
          size="sm"
          variant="outline"
          formAction={deleteAssistantWithId}
          disabled
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

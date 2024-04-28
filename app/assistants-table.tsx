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
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data); // Log to see the structure
      return data;
    });

export function AssistantsTable({ offset }: { offset: number | null }) {
  const { data: assistants, error } = useSWR(`/api/assistants`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!assistants || !Array.isArray(assistants)) return <div>Loading...</div>;

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Identity</TableHead>
              <TableHead className="hidden md:table-cell">Style</TableHead>
              <TableHead className="hidden md:table-cell">Model</TableHead>
              <TableHead className="hidden md:table-cell">Voice</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.map((assistant: SelectAssistant) => (
              <AssistantRow key={assistant.id} assistant={assistant} />
            ))}
          </TableBody>
        </Table>
      </form>
    </>
  );
}

function AssistantRow({ assistant }: { assistant: SelectAssistant }) {
  const assistantId = assistant.id;
  const deleteAssistantWithId = deleteAssistant.bind(null, assistantId);

  return (
    <TableRow>
      <TableCell className="font-medium">{assistant.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {assistant.identity || 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {assistant.style || 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {assistant.model ? JSON.stringify(assistant.model) : 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {assistant.voice ? JSON.stringify(assistant.voice) : 'N/A'}
      </TableCell>
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

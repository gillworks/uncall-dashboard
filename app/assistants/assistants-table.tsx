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
import useSWR, { mutate } from 'swr';
import { EditAssistantDialog } from '@/components/assistants/EditAssistantDialog';
import { useState } from 'react';

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data); // Log to see the structure
      return data;
    });

async function deleteAssistant(assistantId: string) {
  const response = await fetch(`/api/delete-assistant?id=${assistantId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    // Re-fetch assistants data to update the UI
    mutate('/api/assistants');
  } else {
    console.error('Failed to delete the assistant');
  }
}

export function AssistantsTable({ offset }: { offset: number | null }) {
  const { data: assistants, error } = useSWR(`/api/assistants`, fetcher);
  const [selectedAssistant, setSelectedAssistant] =
    useState<null | SelectAssistant>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!assistants || !Array.isArray(assistants)) return <div>Loading...</div>;

  return (
    <>
      {selectedAssistant && (
        <EditAssistantDialog
          assistantId={selectedAssistant.id.toString()}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Identity</TableHead>
              <TableHead className="hidden md:table-cell">Style</TableHead>
              <TableHead className="hidden md:table-cell">Model</TableHead>
              <TableHead className="hidden md:table-cell">Voice</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.map((assistant: SelectAssistant) => (
              <AssistantRow
                key={assistant.id}
                assistant={assistant}
                setSelectedAssistant={setSelectedAssistant}
                setIsOpen={setIsOpen} // Pass setIsOpen to the row
              />
            ))}
          </TableBody>
        </Table>
      </form>
    </>
  );
}

function AssistantRow({
  assistant,
  setSelectedAssistant,
  setIsOpen // Pass setIsOpen from the parent component
}: {
  assistant: SelectAssistant;
  setSelectedAssistant: (assistant: SelectAssistant) => void;
  setIsOpen: (isOpen: boolean) => void; // Add this line
}) {
  const assistantId = assistant.id;

  const deleteAssistantWithId = () => deleteAssistant(assistantId.toString());

  // Use setIsOpen from props to control the dialog visibility
  const handleEditClick = (assistant: SelectAssistant) => {
    setSelectedAssistant(assistant);
    setIsOpen(true);
  };

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
      <TableCell className="flex justify-between">
        <Button
          className="flex-1 mr-2"
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.preventDefault();
            handleEditClick(assistant);
          }}
        >
          Edit
        </Button>
        <Button
          className="flex-1"
          size="sm"
          variant="destructive"
          onClick={deleteAssistantWithId}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

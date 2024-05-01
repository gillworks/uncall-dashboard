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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';

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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteAssistantWithId = () => setIsConfirmOpen(true);

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
          onClick={(event) => {
            event.preventDefault();
            deleteAssistantWithId();
          }}
        >
          Delete
        </Button>
      </TableCell>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the assistant "{assistant.name}"?
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              deleteAssistant(assistantId.toString());
              setIsConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </TableRow>
  );
}

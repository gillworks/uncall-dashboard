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
import { EditAssistantDialog } from '@/components/assistants/EditAssistantDialog';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function deleteAssistant(assistantId: string) {
  const { error } = await supabase
    .from('assistants')
    .delete()
    .match({ id: assistantId });

  if (error) {
    console.error('Failed to delete the assistant:', error.message);
  }
}

export function AssistantsTable({ offset }: { offset: number | null }) {
  const [assistants, setAssistants] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<null | any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleChanges = (payload: any) => {
      fetchAssistants();
    };

    const subscription = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assistants' },
        handleChanges
      )
      .subscribe();

    fetchAssistants();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAssistants = async () => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select()
        .order('createdAt', { ascending: true });
      if (error) throw error;
      setAssistants(data);
    } catch (error) {
      setError('Failed to load');
    }
  };

  if (error) return <div>{error}</div>;
  if (assistants === null) return <div>Loading...</div>;
  if (assistants.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no assistants
          </h3>
          <p className="text-sm text-muted-foreground">
            Add an assistant to get started
          </p>
        </div>
      </div>
    );

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
            {assistants.map((assistant: any) => (
              <AssistantRow
                key={assistant.id}
                assistant={assistant}
                setSelectedAssistant={setSelectedAssistant}
                setIsOpen={setIsOpen}
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
  setIsOpen
}: {
  assistant: any;
  setSelectedAssistant: (assistant: any) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const assistantId = assistant.id;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteAssistantWithId = () => setIsConfirmOpen(true);

  const handleEditClick = (assistant: any) => {
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

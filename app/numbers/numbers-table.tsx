'use client';

import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { EditNumberDialog } from '@/components/numbers/EditNumberDialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Number } from 'types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CallData {
  id: string;
}

async function deleteNumber(numberId: string) {
  const { error } = await supabase
    .from('numbers')
    .delete()
    .match({ id: numberId });

  if (error) {
    console.error('Failed to delete the number:', error.message);
  }
}

export function NumbersTable() {
  const [numbers, setNumbers] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const handleChanges = (payload: any) => {
      fetchNumbers();
    };

    const subscription = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'numbers' },
        handleChanges
      )
      .subscribe();

    fetchNumbers();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('numbers')
        .select(
          `
          *,
          assistants (
            id,
            name,
            identity,
            style,
            voice
          )
        `
        )
        .order('createdAt', { ascending: true });
      if (error) throw error;
      setNumbers(data);
    } catch (error) {
      setError('Failed to load');
    }
  };

  if (error) return <div>{error}</div>;
  if (numbers === null) return <div>Loading...</div>;
  if (numbers.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no numbers
          </h3>
          <p className="text-sm text-muted-foreground">
            Add a number to assign an assistant to receive incoming calls
          </p>
        </div>
      </div>
    );

  const confirmDeleteNumber = (numberId: string) => {
    setSelectedNumberId(numberId);
    setIsConfirmOpen(true);
  };

  const openEditDialog = (numberId: string) => {
    setSelectedNumberId(numberId);
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead className="hidden md:table-cell">
                Twilio Account SID
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Twilio Auth Token
              </TableHead>
              <TableHead className="hidden md:table-cell">Assistant</TableHead>
              <TableHead className="hidden md:table-cell">
                Created Date/Time
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(numbers) &&
              numbers.map((number: Number) => (
                <TableRow key={number.id}>
                  <TableCell className="font-medium">{number.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {number.number}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {number.twilioAccountSid}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {number.twilioAuthToken}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {number.assistants
                      ? number.assistants.name
                      : 'Deleted Assistant'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(number.createdAt), {
                      addSuffix: true
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={() => openEditDialog(number.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => confirmDeleteNumber(number.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{numbers.length}</strong> of{' '}
          <strong>{numbers.length}</strong> numbers
        </div>
      </CardFooter>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the number "
            {numbers && Array.isArray(numbers)
              ? numbers.find((number: Number) => number.id === selectedNumberId)
                  ?.name
              : 'this number'}
            "?
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              deleteNumber(selectedNumberId!);
              setIsConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
      {selectedNumberId && (
        <EditNumberDialog
          numberId={selectedNumberId}
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </Card>
  );
}

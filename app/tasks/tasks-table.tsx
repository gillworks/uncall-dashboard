'use client';

import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Task {
  id: string;
  name: string;
  status: string;
  type: string;
  assistants: {
    name: string;
  };
  createdAt: string;
  contactName: string;
  contactPhoneNumber: string;
}

interface CallData {
  id: string;
}

async function deleteTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().match({ id: taskId });

  if (error) {
    console.error('Failed to delete the task:', error.message);
  }
}

async function startTask(taskId: string) {
  const { data: callData, error } = (await supabase
    .from('calls')
    .insert({
      taskId: taskId,
      status: 'queued',
      type: 'outbound'
    })
    .select()) as { data: CallData[] | null; error: any };

  if (!error) {
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ status: 'in progress' })
      .match({ id: taskId });

    if (!updateError) {
      if (callData && callData[0] && callData[0].id) {
        // Create a call in vapi
        const createCallResponse = await fetch(
          '/api/external/vapi/create-call',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              taskId: taskId,
              callId: callData[0].id
            })
          }
        );

        if (!createCallResponse.ok) {
          console.error('Failed to make the external call');
        }
      } else {
        console.error('No call data available to create external call');
      }
    } else {
      console.error('Failed to update the task status to in progress');
    }
  } else {
    console.error('Failed to start the task');
  }
}

export function TasksTable() {
  const [tasks, setTasks] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const handleChanges = (payload: any) => {
      fetchTasks();
    };

    const subscription = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        handleChanges
      )
      .subscribe();

    fetchTasks();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
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
      setTasks(data);
    } catch (error) {
      setError('Failed to load');
    }
  };

  if (error) return <div>{error}</div>;
  if (tasks === null) return <div>Loading...</div>;
  if (tasks.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no tasks
          </h3>
          <p className="text-sm text-muted-foreground">
            Add a task to get started
          </p>
        </div>
      </div>
    );

  const confirmDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsConfirmOpen(true);
  };

  const openEditDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Assistant</TableHead>
              <TableHead className="hidden md:table-cell">
                Contact Name
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Contact Phone
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Created Date/Time
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(tasks) &&
              tasks.map((task: Task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === 'in progress'
                          ? 'default'
                          : task.status === 'complete'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.assistants
                      ? task.assistants.name
                      : 'Deleted Assistant'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.contactName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.contactPhoneNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(task.createdAt), {
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
                        {task.status === 'draft' &&
                          task.type === 'Outbound Call' &&
                          task.assistants !== null && (
                            <DropdownMenuItem
                              onSelect={() => startTask(task.id)}
                            >
                              Start Task
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem
                          onSelect={() => openEditDialog(task.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => confirmDeleteTask(task.id)}
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
          Showing <strong>1-{tasks.length}</strong> of{' '}
          <strong>{tasks.length}</strong> tasks
        </div>
      </CardFooter>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task "
            {tasks && Array.isArray(tasks)
              ? tasks.find((task: Task) => task.id === selectedTaskId)?.name
              : 'this task'}
            "?
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              deleteTask(selectedTaskId!);
              setIsConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
      {selectedTaskId && (
        <EditTaskDialog
          taskId={selectedTaskId}
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </Card>
  );
}

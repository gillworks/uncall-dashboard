'use client';

import { MoreHorizontal } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Task {
  id: string;
  name: string;
  status: string;
  type: string;
  assistants: {
    name: string;
  };
  createdAt: string;
}

async function deleteTask(taskId: string) {
  const response = await fetch(`/api/delete-task?id=${taskId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    // Re-fetch tasks data to update the UI
    mutate('/api/tasks');
  } else {
    console.error('Failed to delete the task');
  }
}

async function startTask(taskId: string) {
  const startResponse = await fetch('/api/add-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      taskId: taskId,
      status: 'queued',
      type: 'outbound'
    })
  });

  if (startResponse.ok) {
    const callData = await startResponse.json();

    const updateResponse = await fetch(`/api/edit-task-status/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'in progress'
      })
    });

    if (updateResponse.ok) {
      mutate('/api/tasks');
      mutate('/api/unread-calls-count');

      // Create a call in vapi
      const createCallResponse = await fetch('/api/external/vapi/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId: taskId,
          callId: callData.id
        })
      });

      if (!createCallResponse.ok) {
        console.error('Failed to make the external call');
      }
    } else {
      console.error('Failed to update the task status to in progress');
    }
  } else {
    console.error('Failed to start the task');
  }
}

export function TasksTable() {
  const { data: tasks, error } = useSWR('/api/tasks', fetcher);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (error) return <div>Failed to load tasks.</div>;
  if (!tasks) return <div>Loading tasks...</div>;

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
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Manage your tasks and view their status.
            </CardDescription>
          </div>
          <div className="ml-auto">
            <AddTaskDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
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
                    {task.assistants.name}
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
                          task.type === 'Outbound Call' && (
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

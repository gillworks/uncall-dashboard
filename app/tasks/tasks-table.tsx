'use client';

import { MoreHorizontal } from 'lucide-react';
import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
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

export function TasksTable() {
  const { data: tasks, error } = useSWR('/api/tasks', fetcher);

  if (error) return <div>Failed to load tasks.</div>;
  if (!tasks) return <div>Loading tasks...</div>;

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
                        task.status === 'active'
                          ? 'default'
                          : task.status === 'in progress'
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
    </Card>
  );
}

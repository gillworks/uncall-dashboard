'use client';

import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { mutate } from 'swr';
import TaskFormFields from './TaskFormFields';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().max(255).min(2),
  instructions: z.string().min(1),
  type: z
    .string({
      required_error: 'Please select a task type.'
    })
    .min(1),
  assistant: z
    .string({
      required_error: 'Please select an assistant to perform the task.'
    })
    .min(1)
});

export interface Assistant {
  id: string;
  name: string;
}

export function AddTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    fetch('/api/assistants')
      .then((response) => response.json())
      .then((data: Assistant[]) => setAssistants(data))
      .catch((error) => console.error('Failed to load assistants:', error));
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      instructions: '',
      type: '',
      assistant: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Find the assistant ID corresponding to the selected assistant name
    const assistantId = assistants.find(
      (assistant) => assistant.name === values.assistant
    )?.id;

    fetch('/api/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: values.name,
        instructions: values.instructions,
        type: values.type,
        assistant: assistantId // Pass the assistantId instead of the assistant name
      })
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          description: 'Task created successfully!'
        });
        form.reset();
        setIsOpen(false);
        mutate('/api/tasks', true); // Ensure this matches the SWR key in the TasksTable
      })
      .catch((error) => {
        console.error('Failed to create task:', error);
        toast({
          description: 'Failed to create task.'
        });
      });
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ClipboardCheck className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a new task</DialogTitle>
              <DialogDescription>
                Fill in the details of the new task and click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <TaskFormFields form={form} assistants={assistants} />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

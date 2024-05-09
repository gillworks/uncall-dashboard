'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import TaskFormFields from './TaskFormFields';
import { Assistant } from 'types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formSchema = z.object({
  name: z.string().max(255).min(2),
  instructions: z.string().min(1),
  type: z.string().min(1, { message: 'Please select a task type.' }),
  assistant: z.string().min(1, {
    message: 'Please select an assistant to perform the task.'
  }),
  contactName: z.string().max(255).min(2),
  contactPhoneNumber: z.string().min(10).max(15)
});

export function EditTaskDialog({
  taskId,
  isOpen,
  onOpenChange
}: {
  taskId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      instructions: '',
      type: '',
      assistant: '',
      contactName: '',
      contactPhoneNumber: ''
    }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: assistantsData, error: assistantsError } = await supabase
        .from('assistants')
        .select('*');
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (assistantsError || taskError) {
        throw new Error(assistantsError?.message || taskError?.message);
      }

      setAssistants(assistantsData);
      const resetData = {
        name: taskData.name,
        instructions: taskData.instructions,
        type: taskData.type,
        assistant:
          assistantsData.find((a: Assistant) => a.id === taskData.assistantId)
            ?.name || '',
        contactName: taskData.contactName,
        contactPhoneNumber: taskData.contactPhoneNumber
      };
      form.reset(resetData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, taskId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const assistantId = assistants.find(
      (assistant) => assistant.name === values.assistant
    )?.id;

    supabase
      .from('tasks')
      .update({
        name: values.name,
        instructions: values.instructions,
        type: values.type,
        assistantId: assistantId,
        contactName: values.contactName,
        contactPhoneNumber: values.contactPhoneNumber
      })
      .match({ id: taskId })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to update task:', error.message);
          toast({
            description: 'Failed to update task.'
          });
        } else {
          toast({
            description: 'Task updated successfully!'
          });
          form.reset();
          onOpenChange(false);
        }
      });
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the details of the task and click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <TaskFormFields
                key={`${taskId}-${assistants.length}`}
                form={form}
                assistants={assistants}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

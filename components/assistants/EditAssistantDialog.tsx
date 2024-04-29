'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
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
import { useState } from 'react';
import { mutate } from 'swr';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AssistantFormFields } from './AssistantFormFields';

const formSchema = z.object({
  name: z.string().max(255).min(2),
  identity: z.string(),
  style: z.string(),
  model: z.string().optional(),
  voice: z.string().optional()
});

export function EditAssistantDialog({
  assistantId,
  isOpen,
  onOpenChange
}: {
  assistantId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      identity: '',
      style: '',
      model: '',
      voice: ''
    }
  });

  useEffect(() => {
    form.reset({
      // Reset the form with empty values before fetching new data
      name: '',
      identity: '',
      style: '',
      model: '',
      voice: ''
    });
    fetch(`/api/assistant/${assistantId}`)
      .then((response) => response.json())
      .then((data) => {
        form.reset({
          name: data.name,
          identity: data.identity,
          style: data.style,
          model: data.model ? JSON.stringify(data.model) : '',
          voice: data.voice ? JSON.stringify(data.voice) : ''
        });
      })
      .catch((error) => console.error('Failed to fetch assistant:', error));
  }, [assistantId, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`/api/edit-assistant/${assistantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: values.name,
        identity: values.identity,
        style: values.style,
        model: values.model
          ? JSON.stringify({ modelData: values.model })
          : null,
        voice: values.voice ? JSON.stringify({ voiceData: values.voice }) : null
      })
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          description: 'Assistant updated successfully!'
        });
        form.reset();
        onOpenChange(false);
        mutate('/api/assistants', true); // Ensure this matches the SWR key in the AssistantsTable
      })
      .catch((error) => {
        console.error('Failed to update assistant:', error);
        toast({
          description: 'Failed to update assistant.'
        });
      });
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit assistant</DialogTitle>
              <DialogDescription>
                Fill in the details of the assistant and click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <AssistantFormFields form={form} />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update assistant</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

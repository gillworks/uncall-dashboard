'use client';

import { Button } from '@/components/ui/button';
import { UserRoundPlus } from 'lucide-react';
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

export function AddAssistantDialog() {
  const [isOpen, setIsOpen] = useState(false);

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('/api/add-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: values.name,
        identity: values.identity,
        style: values.style,
        model: values.model,
        voice: values.voice
      })
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          description: 'Assistant created successfully!'
        });
        form.reset();
        setIsOpen(false);
        mutate('/api/assistants', true); // Ensure this matches the SWR key in the AssistantsTable
      })
      .catch((error) => {
        console.error('Failed to create assistant:', error);
        toast({
          description: 'Failed to create assistant.'
        });
      });
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlus className="mr-2 h-4 w-4" /> Add Assistant
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a new assistant</DialogTitle>
              <DialogDescription>
                Fill in the details of the new assistant and click save when
                you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <AssistantFormFields form={form} />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create assistant</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
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
import { Hash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import NumberFormFields from './NumberFormFields';
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
  number: z.string().min(10).max(15),
  twilioAccountSid: z.string().min(10).max(255),
  twilioAuthToken: z.string().min(10).max(255),
  assistant: z.string().optional()
});

export function AddNumberDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    supabase
      .from('assistants')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load assistants:', error.message);
        } else {
          setAssistants(data);
        }
      });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      number: '',
      twilioAccountSid: '',
      twilioAuthToken: '',
      assistant: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Find the assistant ID corresponding to the selected assistant name, if provided
    const assistantId = values.assistant
      ? assistants.find((assistant) => assistant.name === values.assistant)?.id
      : null;

    supabase
      .from('numbers')
      .insert([
        {
          name: values.name,
          number: values.number,
          twilioAccountSid: values.twilioAccountSid,
          twilioAuthToken: values.twilioAuthToken,
          assistantId: assistantId
        }
      ])
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to create number:', error.message);
          toast({
            description: 'Failed to create number.'
          });
        } else {
          toast({
            description: 'Number created successfully!'
          });
          form.reset();
          setIsOpen(false);
        }
      });
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Hash className="mr-2 h-4 w-4" /> Add Number
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a new number</DialogTitle>
              <DialogDescription>
                Fill in the details of the new number and click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <NumberFormFields form={form} assistants={assistants} />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Number</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AssistantFormFields } from './AssistantFormFields';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formSchema = z.object({
  name: z.string().max(255).min(2),
  identity: z.string(),
  style: z.string(),
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
      voice: ''
    }
  });

  useEffect(() => {
    form.reset();
    supabase
      .from('assistants')
      .select('*')
      .eq('id', assistantId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch assistant:', error.message);
        } else {
          form.reset({
            name: data.name,
            identity: data.identity,
            style: data.style,
            voice: JSON.stringify(data.voice)
          });
        }
      });
  }, [assistantId, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    supabase
      .from('assistants')
      .update({
        name: values.name,
        identity: values.identity,
        style: values.style,
        voice: values.voice ? JSON.parse(values.voice) : null
      })
      .match({ id: assistantId })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to update assistant:', error.message);
          toast({
            description: 'Failed to update assistant.'
          });
        } else {
          toast({
            description: 'Assistant updated successfully!'
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

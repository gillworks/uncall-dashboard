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
  assistant: z.string().min(1, {
    message: 'Please select an assistant to answer calls to this number.'
  })
});

export function EditNumberDialog({
  numberId,
  isOpen,
  onOpenChange
}: {
  numberId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: assistantsData, error: assistantsError } = await supabase
        .from('assistants')
        .select('*');
      const { data: numberData, error: numberError } = await supabase
        .from('numbers')
        .select('*')
        .eq('id', numberId)
        .single();

      if (assistantsError || numberError) {
        throw new Error(assistantsError?.message || numberError?.message);
      }

      setAssistants(assistantsData);
      const resetData = {
        name: numberData.name,
        number: numberData.number,
        twilioAccountSid: numberData.twilioAccountSid,
        twilioAuthToken: numberData.twilioAuthToken,
        assistant:
          assistantsData.find((a: Assistant) => a.id === numberData.assistantId)
            ?.name || ''
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
  }, [isOpen, numberId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const assistantId = assistants.find(
      (assistant) => assistant.name === values.assistant
    )?.id;

    supabase
      .from('numbers')
      .update({
        name: values.name,
        number: values.number,
        twilioAccountSid: values.twilioAccountSid,
        twilioAuthToken: values.twilioAuthToken,
        assistantId: assistantId
      })
      .match({ id: numberId })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to update number:', error.message);
          toast({
            description: 'Failed to update number.'
          });
        } else {
          toast({
            description: 'Number updated successfully!'
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
              <DialogTitle>Edit Number</DialogTitle>
              <DialogDescription>
                Update the details of the number and click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <NumberFormFields
                key={`${numberId}-${assistants.length}`}
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

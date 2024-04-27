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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().max(255),
  model: z.string().optional(), // Assuming JSON stringified data
  voice: z.string().optional() // Assuming JSON stringified data
});

export function AddAssistantDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: { name: string; model?: string; voice?: string }) => {
    console.log(data); // For debugging
    reset(); // Reset form fields after submission
  };

  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlus className="mr-2 h-4 w-4" /> Add Assistant
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create a new assistant</DialogTitle>
            <DialogDescription>
              Fill in the details of the new assistant and click save when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register('name')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model (JSON)
              </Label>
              <Textarea
                id="model"
                {...register('model')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voice" className="text-right">
                Voice (JSON)
              </Label>
              <Textarea
                id="voice"
                {...register('voice')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                toast({
                  description: 'Assistant added successfully!'
                });
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

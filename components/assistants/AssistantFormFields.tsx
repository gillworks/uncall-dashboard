import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface AssistantFormFieldsProps {
  form: UseFormReturn<any>; // Specify the form schema type instead of 'any' if available
}

export const AssistantFormFields = ({ form }: AssistantFormFieldsProps) => (
  <>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} className="col-span-3" />
          </FormControl>
          <FormDescription>
            This is your assistant's display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="identity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Identity</FormLabel>
          <FormControl>
            <Input {...field} className="col-span-3" />
          </FormControl>
          <FormDescription>This is your assistant's identity.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="style"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Style</FormLabel>
          <FormControl>
            <Textarea {...field} className="col-span-3" />
          </FormControl>
          <FormDescription>What is this assistant's style?</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="voice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Voice</FormLabel>
          <FormControl>
            <Textarea {...field} className="col-span-3" />
          </FormControl>
          <FormDescription>
            JSON data for the assistant's voice configuration.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

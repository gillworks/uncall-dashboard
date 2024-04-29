import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

import { Assistant } from './AddTaskDialog';

interface TaskFormFieldsProps {
  form: any; // Replace 'any' with the specific form type
  assistants: Assistant[];
}

export const TaskFormFields = ({ form, assistants }: TaskFormFieldsProps) => {
  useEffect(() => {}, [assistants]);

  return (
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
            <FormDescription>This is your task's name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructions</FormLabel>
            <FormControl>
              <Textarea {...field} className="col-span-3" />
            </FormControl>
            <FormDescription>
              Detailed instructions for the task.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              key={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Outbound Call">Outbound Call</SelectItem>
                <SelectItem value="Inbound Call">Inbound Call</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Place an outbound call or receive an inbound call.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="assistant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assistant</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              key={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assistant" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {assistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.name}>
                    {assistant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose an assistant to assign this task to.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TaskFormFields;

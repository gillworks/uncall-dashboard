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
import { useEffect } from 'react';

import { Assistant } from 'types';

interface NumberFormFieldsProps {
  form: any; // Replace 'any' with the specific form type
  assistants: Assistant[];
}

export const NumberFormFields = ({
  form,
  assistants
}: NumberFormFieldsProps) => {
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
            <FormDescription>Give your number a name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} className="col-span-3" />
            </FormControl>
            <FormDescription>10-digit phone number.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="twilioAccountSid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twilio Account SID</FormLabel>
            <FormControl>
              <Input {...field} className="col-span-3" />
            </FormControl>
            <FormDescription>
              Twilio Account SID for the account this number belongs to.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="twilioAuthToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twilio Auth Token</FormLabel>
            <FormControl>
              <Input {...field} className="col-span-3" />
            </FormControl>
            <FormDescription>
              Twilio Auth Token for the account this number belongs to.
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
              Assign an assistant to answer incoming calls to this number.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default NumberFormFields;

import { format, addHours, addDays, nextSaturday } from 'date-fns';
import {
  Archive,
  Download,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  AudioLines,
  PhoneOutgoing, // Assuming call type icons are needed
  PhoneIncoming,
  ClipboardCheck // Added ClipboardCheck icon import
} from 'lucide-react';

import {
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Call } from '@/components/calls/data';

interface CallDisplayProps {
  call: Call | null;
}

export function CallDisplay({ call }: CallDisplayProps) {
  const today = new Date();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!call}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!call}>
                <AudioLines className="h-4 w-4" />
                <span className="sr-only">Recording</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Play Recording</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!call}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download Recording</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!call}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {call ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="flex items-center font-semibold">
                  {call.assistant}
                  {call.type === 'outbound' ? (
                    <PhoneOutgoing className="ml-1 h-4 w-4" />
                  ) : (
                    <PhoneIncoming className="ml-1 h-4 w-4" />
                  )}
                </div>
                <div className="line-clamp-1 text-xs flex items-center">
                  <ClipboardCheck className="mr-1 h-4 w-4" />
                  {call.task}
                </div>
              </div>
            </div>
            {call.startedAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(call.startedAt), 'PPpp')}
              </div>
            )}
          </div>
          <Separator />
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold mb-2">Summary</h3>
            <div className="whitespace-pre-wrap text-sm py-2">
              {call.summary}
            </div>
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap px-4 py-2 text-sm">
            <h3 className="text-sm font-semibold mb-2">Transcript</h3>
            <div className="py-2">{call.transcript}</div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}

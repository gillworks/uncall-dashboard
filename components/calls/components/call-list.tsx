import { ComponentProps } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  ClipboardCheck,
  Check,
  Ellipsis,
  Clock,
  MessageSquareQuote,
  Mic,
  PhoneOutgoing,
  PhoneIncoming
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Call } from '@/components/calls/data';
import { useCall } from '@/components/calls/use-call';

interface CallListProps {
  items: Call[];
}

export function CallList({ items }: CallListProps) {
  const [call, setCall] = useCall();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => {
          const labels: {
            text: string;
            variant:
              | 'default'
              | 'outline'
              | 'secondary'
              | 'destructive'
              | null
              | undefined;
            icon: JSX.Element;
          }[] = [];
          if (item.startedAt && item.endedAt) {
            labels.push({
              text: 'Completed',
              variant: 'outline',
              icon: <Check className="ml-1 h-4 w-4" />
            });
          }
          if (item.startedAt && !item.endedAt) {
            labels.push({
              text: 'In Progress',
              variant: 'default',
              icon: <Ellipsis className="ml-1 h-4 w-4" />
            });
          }
          if (!item.startedAt) {
            labels.push({
              text: 'Queued',
              variant: 'secondary',
              icon: <Clock className="ml-1 h-4 w-4" />
            });
          }
          if (item.transcribed) {
            labels.push({
              text: 'Transcribed',
              variant: 'outline',
              icon: <MessageSquareQuote className="ml-1 h-4 w-4" />
            });
          }
          if (item.recordingUrl) {
            labels.push({
              text: 'Recorded',
              variant: 'outline',
              icon: <Mic className="ml-1 h-4 w-4" />
            });
          }

          return (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                call.selected === item.id && 'bg-muted'
              )}
              onClick={() =>
                setCall({
                  ...call,
                  selected: item.id
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.assistant}</div>
                    {item.type === 'outbound' ? (
                      <PhoneOutgoing className="ml-1 h-4 w-4" />
                    ) : (
                      <PhoneIncoming className="ml-1 h-4 w-4" />
                    )}
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xs',
                      call.selected === item.id
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatDistanceToNow(new Date(item.startedAt), {
                      addSuffix: true
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3 text-muted-foreground" />
                  <div className="text-xs font-medium">{item.task}</div>
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.summary?.substring(0, 300) || ''}
              </div>
              {labels.length ? (
                <div className="flex items-center gap-2">
                  {labels.map((label) => (
                    <Badge key={label.text} variant={label.variant}>
                      {label.text}
                      {label.icon}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

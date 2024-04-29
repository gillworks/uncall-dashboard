import { useEffect, useState } from 'react';
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
import { Call } from '@/types';
import { mutate } from 'swr';

interface CallListProps {
  callType?: 'inbound' | 'outbound';
  selectedCallId: string | null;
  setSelectedCallId: (id: string | null) => void;
}

export function CallList({
  callType,
  selectedCallId,
  setSelectedCallId
}: CallListProps) {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    async function fetchCalls() {
      const url = callType ? `/api/calls?type=${callType}` : '/api/calls';
      const response = await fetch(url);
      const data = await response.json();
      setCalls(
        data.map((call: Call) => ({
          ...call,
          taskName: call.tasks.name,
          assistant: call.tasks.assistants.name
        }))
      );
    }

    fetchCalls();
  }, [callType]);

  const handleSelectCall = async (id: string) => {
    setSelectedCallId(id);
    const selectedCall = calls.find((call) => call.id === id);
    if (selectedCall && !selectedCall.read) {
      try {
        const response = await fetch(`/api/edit-call/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ read: true })
        });
        if (response.ok) {
          setCalls(
            calls.map((call) =>
              call.id === id ? { ...call, read: true } : call
            )
          );
          mutate('/api/unread-calls-count');
        }
      } catch (error) {
        console.error('Failed to mark call as read', error);
      }
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {calls.map((item) => {
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
                selectedCallId === item.id && 'bg-muted'
              )}
              onClick={() => handleSelectCall(item.id)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {item.tasks.assistants.name}
                    </div>
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
                      selectedCallId === item.id
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatDistanceToNow(
                      new Date(item.startedAt || item.createdAt),
                      {
                        addSuffix: true
                      }
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3 text-muted-foreground" />
                  <div className="text-xs font-medium">{item.tasks.name}</div>
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

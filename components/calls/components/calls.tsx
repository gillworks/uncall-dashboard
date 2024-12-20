'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CallDisplay } from '@/components/calls/components/call-display';
import { CallList } from '@/components/calls/components/call-list';
import { Call } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CallProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Calls({
  defaultLayout = [440, 655],
  defaultCollapsed = false,
  navCollapsedSize
}: CallProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      const { data, error } = await supabase
        .from('calls')
        .select(
          `
          *,
          tasks (
            name,
            assistants (
              name
            )
          )
        `
        )
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching calls:', error.message);
      } else {
        setCalls(data);
      }
    }

    fetchCalls();
  }, []);

  useEffect(() => {
    console.log('Selected Call ID:', selectedCallId);
  }, [selectedCallId]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-screen items-stretch"
      >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Call Log</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All calls
                </TabsTrigger>
                <TabsTrigger
                  value="outbound"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Outbound
                </TabsTrigger>
                <TabsTrigger
                  value="inbound"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Inbound
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <CallList
                selectedCallId={selectedCallId}
                setSelectedCallId={setSelectedCallId}
              />
            </TabsContent>
            <TabsContent value="outbound" className="m-0">
              <CallList
                callType="outbound"
                selectedCallId={selectedCallId}
                setSelectedCallId={setSelectedCallId}
              />
            </TabsContent>
            <TabsContent value="inbound" className="m-0">
              <CallList
                callType="inbound"
                selectedCallId={selectedCallId}
                setSelectedCallId={setSelectedCallId}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]}>
          <CallDisplay
            call={calls.find((item) => item.id === selectedCallId) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

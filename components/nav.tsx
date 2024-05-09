'use client';

import { Badge } from '@/components/ui/badge';
import { NavItem } from '../app/nav-item';
import {
  SquareKanban,
  Users,
  Hash,
  ClipboardCheck,
  PhoneOutgoing,
  Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Nav() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase
      .from('calls')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
      .then(({ error, count }) => {
        if (error) {
          console.error('Error fetching unread calls count:', error.message);
        } else {
          setUnreadCount(count ?? 0);
        }
      });

    const handleChanges = () => {
      supabase
        .from('calls')
        .select('id', { count: 'exact', head: true })
        .eq('read', false)
        .then(({ error, count }) => {
          if (error) {
            console.error('Error fetching unread calls count:', error.message);
          } else {
            setUnreadCount(count ?? 0);
          }
        });
    };

    const subscription = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calls' },
        handleChanges
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <NavItem href="/">
        <SquareKanban className="h-5 w-5" />
        Dashboard
      </NavItem>
      <NavItem href="/assistants">
        <Users className="h-5 w-5" />
        Assistants
      </NavItem>
      <NavItem href="/numbers">
        <Hash className="h-5 w-5" />
        Numbers
      </NavItem>
      <NavItem href="/tasks">
        <ClipboardCheck className="h-5 w-5" />
        Tasks
      </NavItem>
      <NavItem href="/calls">
        <PhoneOutgoing className="h-5 w-5" />
        <span className="flex justify-between w-full">
          Calls
          {unreadCount > 0 && (
            <Badge className="ml-1" variant="default">
              {unreadCount}
            </Badge>
          )}
        </span>
      </NavItem>
      <NavItem href="/settings">
        <Settings className="h-5 w-5" />
        Settings
      </NavItem>
    </>
  );
}

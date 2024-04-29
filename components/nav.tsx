'use client';

import { Badge } from '@/components/ui/badge';
import { NavItem } from '../app/nav-item';
import {
  TimelineChartIcon,
  UsersIcon,
  TaskIcon,
  PhoneOutgoingIcon,
  SettingsIcon
} from '@/components/icons';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Nav() {
  const { data } = useSWR('/api/unread-calls-count', fetcher);

  return (
    <>
      <NavItem href="/">
        <TimelineChartIcon className="h-4 w-4" />
        Dashboard
      </NavItem>
      <NavItem href="/assistants">
        <UsersIcon className="h-4 w-4" />
        Assistants
      </NavItem>
      <NavItem href="/tasks">
        <TaskIcon className="h-4 w-4" />
        Tasks
      </NavItem>
      <NavItem href="/calls">
        <PhoneOutgoingIcon className="h-4 w-4" />
        <span className="flex justify-between w-full">
          Calls
          {data && data.unreadCount > 0 && (
            <Badge className="ml-1" variant="default">
              {data.unreadCount}
            </Badge>
          )}
        </span>
      </NavItem>
      <NavItem href="/settings">
        <SettingsIcon className="h-4 w-4" />
        Settings
      </NavItem>
    </>
  );
}

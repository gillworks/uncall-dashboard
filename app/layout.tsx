import './globals.css';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import {
  Logo,
  PhoneOutgoingIcon,
  SettingsIcon,
  UsersIcon,
  TaskIcon,
  TimelineChartIcon
} from '@/components/icons';
import { User } from './user';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { NavItem } from './nav-item';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-5">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="/"
                  >
                    <Logo />
                    <span className="">Uncall</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
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
                        <Badge className="ml-1" variant="default">
                          3
                        </Badge>
                      </span>
                    </NavItem>
                    <NavItem href="/settings">
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </NavItem>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
                <Link
                  className="flex items-center gap-2 font-semibold lg:hidden"
                  href="/"
                >
                  <Logo />
                  <span className="">ACME</span>
                </Link>
                <User />
                <ModeToggle />
              </header>
              {children}
            </div>
          </div>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

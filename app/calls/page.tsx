import { cookies } from 'next/headers';
import Image from 'next/image';

import { Calls } from '@/components/calls/components/calls';

export default function MailPage() {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value && collapsed.value !== 'undefined'
      ? JSON.parse(collapsed.value)
      : undefined;

  return (
    <>
      <div className="hidden flex-col md:flex">
        <Calls
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}

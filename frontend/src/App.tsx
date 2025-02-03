import type { ReactElement } from 'react';
import { GrafanaContainer } from '@/components/Grafana';
import { SocketProvider } from '@/context/SocketProvider';
import { TabsLayout } from '@/components/TabsLayout';
import { HeaderNav } from '@/components/HeaderNav';

export const App = (): ReactElement => (
  <SocketProvider>
    <div className="controls gap-4">
      <HeaderNav />

      <TabsLayout />
    </div>

    <GrafanaContainer />
  </SocketProvider>
);

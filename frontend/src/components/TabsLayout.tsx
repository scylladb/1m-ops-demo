import type { ReactElement } from 'react';
import { Tabs, Tab, Stack } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { FaGaugeSimple, FaRocket, FaCircleInfo } from 'react-icons/fa6';
import { Dashboard } from '@/components/Dashboard';
import { Scenarios } from '@/components/Scenarios';
import { About } from '@/components/About';

type Key = 'dashboard' | 'scenarios' | 'about';

interface SectionTab {
  readonly key: Key;
  readonly title: string;
  readonly Icon: IconType;
  readonly Component: () => ReactElement;
}

const tabs: readonly SectionTab[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    Icon: FaGaugeSimple,
    Component: Dashboard,
  },
  {
    key: 'scenarios',
    title: 'Scenarios',
    Icon: FaRocket,
    Component: Scenarios,
  },
  {
    key: 'about',
    title: 'About',
    Icon: FaCircleInfo,
    Component: About,
  },
];

export const TabsLayout = (): ReactElement => (
  <Tabs
    defaultActiveKey="dashboard"
    id="controlTabs"
    className="nav-tabs nav-fill"
  >
    {tabs.map(({ key, title, Icon, Component }) => (
      <Tab
        key={key}
        eventKey={key}
        title={
          <TabHeader
            title={title}
            Icon={Icon}
          />
        }
      >
        <Component />
      </Tab>
    ))}
  </Tabs>
);

interface TabHeaderProps {
  readonly title: string;
  readonly Icon: IconType;
}

export const TabHeader = ({ title, Icon }: TabHeaderProps): ReactElement => (
  <Stack
    direction="horizontal"
    gap={2}
    className="justify-content-center"
  >
    <Icon />
    <span>{title}</span>
  </Stack>
);

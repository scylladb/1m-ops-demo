import type { ReactElement } from 'react';
import { ClusterProperties } from '@/components/Dashboard/ClusterProperties';
import { LoaderProperties } from '@/components/Dashboard/LoaderProperties';

export const Dashboard = (): ReactElement => (
  <>
    <ClusterProperties />
    <LoaderProperties />
  </>
);

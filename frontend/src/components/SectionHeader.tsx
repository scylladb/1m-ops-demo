import type { ReactElement } from 'react';
import type { ChildrenProps } from '@/util/props';

export const SectionHeader = ({ children }: ChildrenProps): ReactElement => (
  <h3 className="mb-3">{children}</h3>
);

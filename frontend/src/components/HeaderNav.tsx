import type { ReactElement } from 'react';
import logo from '@/assets/images/scylla-logo.svg';

export const HeaderNav = (): ReactElement => (
  <div className="top-nav d-flex align-items-center justify-content-between">
    <img
      src={logo}
      alt="ScyllaDB"
    />

    <h3>Demo</h3>
  </div>
);

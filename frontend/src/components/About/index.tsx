import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { FaGithub, FaXTwitter, FaLinkedinIn, FaBook } from 'react-icons/fa6';
import { LinkButton } from '@/components/Button';
import mascot from '@/assets/images/scylladb-mascot-cloud.svg';

export const About = (): ReactElement => (
  <>
    <Banner />
    <LinkButtons />
    <Copyright />
  </>
);

const Banner = (): ReactElement => (
  <Card>
    <Card.Body className="section-about">
      <img
        src={mascot}
        alt=""
      />

      <h2>
        1 million ops/sec <br />
        ScyllaDB demos with Terraform
      </h2>

      <p className="lead">
        Test and benchmark ScyllaDB under a 1 million operations per second
        workload.
      </p>
    </Card.Body>
  </Card>
);

const linkButtonsProps: readonly {
  readonly href: string;
  readonly buttonText: string;
  readonly Icon?: IconType;
}[] = [
  {
    href: 'https://www.scylladb.com',
    buttonText: 'ScyllaDB.com',
  },
  {
    href: 'https://docs.scylladb.com',
    buttonText: 'Documentation',
    Icon: FaBook,
  },
  {
    href: 'https://github.com/scylladb',
    buttonText: 'GitHub',
    Icon: FaGithub,
  },
  {
    href: 'https://twitter.com/scylladb',
    buttonText: 'X',
    Icon: FaXTwitter,
  },
  {
    href: 'https://www.linkedin.com/company/scylladb',
    buttonText: 'LinkedIn',
    Icon: FaLinkedinIn,
  },
];

const LinkButtons = (): ReactElement => (
  <div className="flex-grow-1">
    <div className="hstack justify-content-center gap-3 flex-wrap">
      {linkButtonsProps.map((props) => (
        <LinkButton
          key={props.href}
          href={props.href}
          {...(props.Icon
            ? {
                iconProps: {
                  Icon: props.Icon,
                  utilClassesString: 'me-1',
                },
              }
            : {})}
        >
          {props.buttonText}
        </LinkButton>
      ))}
    </div>
  </div>
);

const Copyright = (): ReactElement => (
  <div className="border-top pt-3 small text-center">
    &copy; {new Date().getFullYear()} ScyllaDB. All rights reserved.
  </div>
);

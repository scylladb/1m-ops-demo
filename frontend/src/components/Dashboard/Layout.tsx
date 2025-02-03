import type { ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import type { ChildrenProps } from '@/util/props';

export const ButtonsContainer = ({ children }: ChildrenProps): ReactElement => (
  <div className="hstack gap-3">{children}</div>
);

interface PropertiesFormProps extends ChildrenProps {
  readonly utilClassesString?: string;
}

export const PropertiesForm = ({
  children,
  utilClassesString,
}: PropertiesFormProps): ReactElement => (
  <Form className={`vstack gap-3 ${utilClassesString ?? ''}`}>{children}</Form>
);

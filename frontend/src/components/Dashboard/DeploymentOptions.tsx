import { type ReactElement, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import {
  ButtonsContainer,
  PropertiesForm,
} from '@/components/Dashboard/Layout';

const cloudOptions = [
  'ScyllaDB Cloud - ScyllaDB Enterprise',
  'AWS EC2 - ScyllaDB Enterprise',
] as const;

type CloudOptions = (typeof cloudOptions)[number];

const isEC2InstanceType = (value: string): value is CloudOptions =>
  cloudOptions.find((instanceType) => instanceType === value) !== undefined;

export const DeploymentOptions = (): ReactElement => {
  const [isRunning, setIsRunning] = useState(false);
  const [instanceType, setInstanceType] = useState<CloudOptions>(cloudOptions[0]);

  return (
    <Card>
      <Card.Body>
        <SectionHeader>Deployment options</SectionHeader>

        <PropertiesForm utilClassesString="mb-3">
          <Form.Group>
            <Form.Label
              column
              sm="4"
              className="small-label"
            >
              Choose cloud
            </Form.Label>

            <Form.Select
              value={instanceType}
              onChange={(event) => {
                if (isEC2InstanceType(event.target.value)) {
                  setInstanceType(event.target.value);
                }
              }}
            >
              {cloudOptions.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <ButtonsContainer>
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implement save logic
                console.log('Saving cluster properties...');
              }}
            >
              Save
            </Button>

            <Button
              variant={isRunning ? 'warning' : 'success'}
              iconProps={{
                Icon: isRunning ? FaStop : FaPlay,
                utilClassesString: 'me-2',
              }}
              onClick={() => {
                setIsRunning((prevIsRunning) => !prevIsRunning);
                console.log(`Cluster ${isRunning ? 'stopped' : 'started'}.`);
              }}
            >{`${isRunning ? 'Stop' : 'Run'} Cluster`}</Button>
          </ButtonsContainer>
        </PropertiesForm>
      </Card.Body>
    </Card>
  );
};

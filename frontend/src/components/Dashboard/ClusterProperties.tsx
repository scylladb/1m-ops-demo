import { type ReactElement, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { Button } from '@/components/Button';
import { Slider } from '@/components/Slider';
import { SectionHeader } from '@/components/SectionHeader';
import {
  ButtonsContainer,
  PropertiesForm,
} from '@/components/Dashboard/Layout';

const ec2InstanceTypes = [
  't2.micro',
  't2.small',
  't2.medium',
  't3.micro',
  't3.small',
  't3.medium',
] as const;

type EC2InstanceType = (typeof ec2InstanceTypes)[number];

const isEC2InstanceType = (value: string): value is EC2InstanceType =>
  ec2InstanceTypes.find((instanceType) => instanceType === value) !== undefined;

export const ClusterProperties = (): ReactElement => {
  const [isRunning, setIsRunning] = useState(false);
  const [numberOfNodes, setNumberOfNodes] = useState(3);
  const [instanceType, setInstanceType] = useState<EC2InstanceType>('t2.micro');

  return (
    <Card>
      <Card.Body>
        <SectionHeader>Cluster Properties</SectionHeader>

        <PropertiesForm utilClassesString="mb-3">
          <Slider
            value={numberOfNodes}
            min={1}
            max={10}
            step={1}
            onChange={(event) => {
              setNumberOfNodes(Number(event.target.value));
            }}
            label="Number of Nodes"
          />

          <Form.Group>
            <Form.Label
              column
              sm="4"
              className="small-label"
            >
              Instance Type
            </Form.Label>

            <Form.Select
              value={instanceType}
              onChange={(event) => {
                if (isEC2InstanceType(event.target.value)) {
                  setInstanceType(event.target.value);
                }
              }}
            >
              {ec2InstanceTypes.map((type) => (
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

import { type ReactElement } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Slider } from '@/components/Slider';
import { SectionHeader } from '@/components/SectionHeader';
import {
  PropertiesForm,
} from '@/components/Dashboard/Layout';

const ec2InstanceTypes = [
  't2.micro',
  'i4i.large',
  'i4i.xlarge',
  'i4i.2xlarge',
  'i4i.4xlarge',
  'i4i.8xlarge',
  'i4i.12xlarge',
  'i4i.16xlarge'
] as const;

export type EC2InstanceType = (typeof ec2InstanceTypes)[number];

const isEC2InstanceType = (value: string): value is EC2InstanceType =>
  ec2InstanceTypes.find((instanceType) => instanceType === value) !== undefined;

interface ClusterPropertiesProps {
  numberOfNodes: number;
  setNumberOfNodes: (value: number) => void;
  instanceType: EC2InstanceType;
  setInstanceType: (value: EC2InstanceType) => void;
}

export const ClusterProperties = ({
  numberOfNodes,
  setNumberOfNodes,
  instanceType,
  setInstanceType,
}: ClusterPropertiesProps): ReactElement => {
  return (
    <Card>
      <Card.Body>
        <SectionHeader>ScyllaDB cluster</SectionHeader>

        <PropertiesForm utilClassesString="mb-3">
          <Slider
            value={numberOfNodes}
            min={3}
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
        </PropertiesForm>
      </Card.Body>
    </Card>
  );
};

import { type ReactElement, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { Button } from '@/components/Button';
import { Slider } from '@/components/Slider';
import { SectionHeader } from '@/components/SectionHeader';
import {
  ButtonsContainer,
  PropertiesForm,
} from '@/components/Dashboard/Layout';

interface LoaderPropertiesProps {
  numberOfLoaders: number;
  setNumberOfLoaders: (value: number) => void;
  readOps: number;
  setReadOps: (value: number) => void;
  writeOps: number;
  setWriteOps: (value: number) => void;
}

const OPS_SLIDER_MIN_VALUE = 500;
const OPS_SLIDER_MAX_VALUE = 10000000;
const OPS_SLIDER_STEP_VALUE = 10000;

export const LoaderProperties = ({
  numberOfLoaders,
  setNumberOfLoaders,
  readOps,
  setReadOps,
  writeOps,
  setWriteOps
}: LoaderPropertiesProps): ReactElement =>{

  return (
    <Card>
      <Card.Body>
        <SectionHeader>Workload</SectionHeader>

        <PropertiesForm>
          <Slider
            value={readOps}
            min={OPS_SLIDER_MIN_VALUE}
            max={OPS_SLIDER_MAX_VALUE}
            step={OPS_SLIDER_STEP_VALUE}
            onChange={(event) => {
              setReadOps(Number(event.target.value));
            }}
            label="Read Ops/sec"
          />

          <Slider
            value={writeOps}
            min={OPS_SLIDER_MIN_VALUE}
            max={OPS_SLIDER_MAX_VALUE}
            step={OPS_SLIDER_STEP_VALUE}
            onChange={(event) => {
              setWriteOps(Number(event.target.value));
            }}
            label="Write Ops/sec"
          />

          <Slider
            value={numberOfLoaders}
            min={1}
            max={10}
            step={1}
            onChange={(event) => {
              setNumberOfLoaders(Number(event.target.value));
            }}
            label="Number of Loader Instances"
          />

        </PropertiesForm>
      </Card.Body>
    </Card>
  );
};

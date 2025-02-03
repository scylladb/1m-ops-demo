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

export const LoaderProperties = (): ReactElement => {
  const [isRunning, setIsRunning] = useState(false);
  const [readOpsPerSec, setReadOpsPerSec] = useState(1000);
  const [writeOpsPerSec, setWriteOpsPerSec] = useState(500);
  const [numberOfLoaders, setNumberOfLoaders] = useState(2);

  return (
    <Card>
      <Card.Body>
        <SectionHeader>Loader Properties</SectionHeader>

        <PropertiesForm>
          <Slider
            value={readOpsPerSec}
            min={500}
            max={5000}
            step={100}
            onChange={(event) => {
              setReadOpsPerSec(Number(event.target.value));
            }}
            label="Read Ops/sec"
          />

          <Slider
            value={writeOpsPerSec}
            min={100}
            max={5000}
            step={100}
            onChange={(event) => {
              setWriteOpsPerSec(Number(event.target.value));
            }}
            label="Write Ops/sec"
          />

          <Slider
            value={numberOfLoaders}
            min={1}
            max={20}
            step={1}
            onChange={(event) => {
              setNumberOfLoaders(Number(event.target.value));
            }}
            label="Number of Loader Instances"
          />

          <ButtonsContainer>
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implement save logic
                console.log('Saving loader properties...');
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
                console.log(`Loader ${isRunning ? 'stopped' : 'started'}.`);
              }}
            >{`${isRunning ? 'Stop' : 'Start'} Loader`}</Button>
          </ButtonsContainer>
        </PropertiesForm>
      </Card.Body>
    </Card>
  );
};

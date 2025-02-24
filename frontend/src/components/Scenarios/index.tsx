import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Collapse, Card, Spinner } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import {
  FaDatabase,
  FaRocket,
  FaRegFileLines,
  FaPlay,
  FaStop,
  FaCheck,
  FaUpRightAndDownLeftFromCenter,
  FaDownLeftAndUpRightToCenter,
} from 'react-icons/fa6';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { useSocketContext } from '@/context/socket';
import type { ScenarioEventKey } from '@/util/api';

const scenarioCardsProps: readonly ScenarioCardProps[] = [
  {
    eventKey: 'original_cluster',
    Icon: FaDatabase,
    title: 'Set up 3-node cluster',
    description:
      'Set up a ScyllaDB cluster with three nodes.',
    collapseId: 'stepOneCollapse',
  },
  {
    eventKey: 'sample_data',
    Icon: FaRegFileLines,
    title: 'Load sample data',
    description:
      'Create schema and insert a sample dataset.',
    collapseId: 'stepTwoCollapse',
  },
  {
    eventKey: 'start_stress',
    Icon: FaRocket,
    title: 'Start loader',
    description:
      'Start sending read and write requests to the cluster.',
    collapseId: 'stepThreeCollapse',
  },
  {
    eventKey: 'scale_out',
    Icon: FaUpRightAndDownLeftFromCenter,
    title: 'Scale out (add 3 nodes)',
    description:
      "Start up three nodes and add them to the cluster.",
    collapseId: 'stepFourCollapse',
  },
  {
    eventKey: 'scale_in',
    Icon: FaDownLeftAndUpRightToCenter,
    title: 'Scale in (remove 3 nodes)',
    description:
      'Remove three nodes (stop the Scylla server on three nodes).',
    collapseId: 'stepFiveCollapse',
  },
  {
    eventKey: 'stop_stress',
    Icon: FaStop,
    title: 'Stop loader',
    description:
      'Stop sending requests.',
    collapseId: 'stepSixCollapse',
  },
];

export const Scenarios = () => {
  const [allowedEventKeys, setAllowedEventKeys] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/data/terraform-data.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('File not available');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data.scenario_steps)) {
            setAllowedEventKeys(data.scenario_steps);
            clearInterval(interval); // Stop once the file is available
          }
        })
        .catch((error) => console.error('Error loading scenario steps:', error));
    }, 2000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <SectionHeader>Steps</SectionHeader>
      <ol className="cards-list">
        {scenarioCardsProps
          .filter((props) => allowedEventKeys.includes(props.eventKey))
          .map((props) => (
            <li key={props.eventKey}>
              <ScenarioCard {...props} />
            </li>
          ))}
      </ol>
    </div>
  );
};

export interface ScenarioCardProps {
  readonly eventKey: ScenarioEventKey;
  readonly title: string;
  readonly description: string;
  readonly collapseId: string;
  readonly Icon: IconType;
}

type RunState = 'idle' | 'running' | 'success';

export const ScenarioCard = ({
  Icon,
  title,
  description,
  collapseId,
  eventKey,
}: ScenarioCardProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);
  const [runState, setRunState] = useState<RunState>('idle');
  const { emitEvent } = useSocketContext();

  return (
    <Card className="p-2">
      <div className="desc">
        <ScenarioCardHeader
          Icon={Icon}
          title={title}
          collapseId={collapseId}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />

        <CollapseContent
          isOpen={isOpen}
          collapseId={collapseId}
          description={description}
        />
      </div>

      <div className="actions">
        <ActionButton
          runState={runState}
          onClick={() => {
            setRunState('success');
            emitEvent(eventKey);
          }}
        />
      </div>
    </Card>
  );
};

interface ScenarioCardHeaderProps {
  readonly Icon: IconType;
  readonly title: string;
  readonly collapseId: string;
  readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly isOpen: boolean;
}

const ScenarioCardHeader = ({
  Icon,
  title,
  collapseId,
  setIsOpen,
  isOpen,
}: ScenarioCardHeaderProps): ReactElement => (
  <a
    className="d-block flex-grow-1"
    onClick={() => {
      setIsOpen((prevIsOpen) => !prevIsOpen);
    }}
    aria-controls={collapseId}
    aria-expanded={isOpen}
  >
    <h4>
      <Icon /> {title}
    </h4>
  </a>
);

interface CollapseContentProps {
  readonly isOpen: boolean;
  readonly collapseId: string;
  readonly description: string;
}

const CollapseContent = ({
  isOpen,
  collapseId,
  description,
}: CollapseContentProps): ReactElement => (
  <Collapse in={isOpen}>
    <div
      className="collapse-content"
      id={collapseId}
    >
      {description}
    </div>
  </Collapse>
);

interface ActionButtonProps {
  readonly runState: RunState;
  readonly onClick: () => void;
}

const ActionButton = ({ runState, onClick }: ActionButtonProps) => {
  switch (runState) {
    case 'idle': {
      return (
        <Button
          variant="light"
          onClick={onClick}
          iconProps={{ Icon: FaPlay, utilClassesString: 'me-2' }}
        >
          Run
        </Button>
      );
    }
    case 'running': {
      return (
        <Button
          variant="light"
          disabled
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Running
        </Button>
      );
    }
    case 'success': {
      return (
        <Button
          variant="success"
          disabled
          iconProps={{ Icon: FaCheck }}
        />
      );
    }
  }
};

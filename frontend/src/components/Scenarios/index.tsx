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
      'Initialize a resilient ScyllaDB cluster with three interconnected nodes, ready for high-performance data operations.',
    collapseId: 'stepOneCollapse',
  },
  {
    eventKey: 'sample_data',
    Icon: FaRegFileLines,
    title: 'Load sample data',
    description:
      'Populate the database with predefined sample data, showcasing key-value pairs, relational mappings, or time-series metrics.',
    collapseId: 'stepTwoCollapse',
  },
  {
    eventKey: 'start_stress',
    Icon: FaRocket,
    title: 'Start loader',
    description:
      'Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.',
    collapseId: 'stepThreeCollapse',
  },
  {
    eventKey: 'scale_out',
    Icon: FaUpRightAndDownLeftFromCenter,
    title: 'Scale out (add 3 nodes)',
    description:
      "Seamlessly add three additional nodes to the cluster, enabling automatic data redistribution and increased capacity using ScyllaDB's tablet architecture.",
    collapseId: 'stepFourCollapse',
  },
  {
    eventKey: 'scale_in',
    Icon: FaDownLeftAndUpRightToCenter,
    title: 'Scale in (remove 3 nodes)',
    description:
      'Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.',
    collapseId: 'stepFiveCollapse',
  },
  {
    eventKey: 'stop_stress',
    Icon: FaStop,
    title: 'Stop loader',
    description:
      'Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.',
    collapseId: 'stepSixCollapse',
  },
];

export const Scenarios = () => {
  const [allowedEventKeys, setAllowedEventKeys] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/terraform-data.json')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.scenario_steps)) {
          setAllowedEventKeys(data.scenario_steps);
        }
      })
      .catch((error) => console.error('Error loading scenario steps:', error));
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

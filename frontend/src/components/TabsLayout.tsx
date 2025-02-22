import { useState, type ReactElement } from 'react';
import { Tabs, Tab, Stack, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { FaGaugeSimple, FaRocket, FaCircleInfo } from 'react-icons/fa6';
import { Dashboard } from '@/components/Dashboard';
import { Scenarios } from '@/components/Scenarios';
import { About } from '@/components/About';

type Key = 'dashboard' | 'scenarios' | 'about';

interface SectionTab {
  readonly key: Key;
  readonly title: string;
  readonly Icon: IconType;
  readonly Component: () => ReactElement;
}

const tabs: readonly SectionTab[] = [
  {
    key: 'dashboard',
    title: 'Terraform settings',
    Icon: FaGaugeSimple,
    Component: Dashboard,
  },
  /*{
    key: 'scenarios',
    title: 'Scenarios',
    Icon: FaRocket,
    Component: Scenarios,
  },
  {
    key: 'about',
    title: 'About',
    Icon: FaCircleInfo,
    Component: About,
  },*/
];

export const TabsLayout = (): ReactElement => {
  const [showPopup, setShowPopup] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState('scylladb-cloud');
  const handleInit = async () => {
    setShowPopup(false);
    try {

      const response = await fetch('http://localhost:5000/choose-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: selectedDemo }),
      });
      
      if (response.ok) {
        console.log("`terraform init` started")
      } else {
        const errorText = await response.text();
        console.error('Failed to submit demo selection:', errorText);
      }
    } catch (error) {
      console.error('Error submitting demo selection:', error);
    }
  };

  return (
    <>
      <Modal show={showPopup} onHide={() => setShowPopup(false)} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Choose a ScyllaDB performance DEMO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDropdown">
              <Form.Select value={selectedDemo} onChange={(e) => setSelectedDemo(e.target.value)}>
                <option value="scylladb-cloud">ScyllaDB Cloud</option>
                <option value="scylladb-enterprise">ScyllaDB Enterprise</option>
                <option value="tablets-scaling">ScyllaDB on AWS - Scaling 3 to 6 nodes</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleInit}>
            Initialize
          </Button>
        </Modal.Footer>
      </Modal>

      <Tabs defaultActiveKey="dashboard" id="controlTabs" className="nav-tabs nav-fill">
        {tabs.map(({ key, title, Icon, Component }) => (
          <Tab key={key} eventKey={key} title={<TabHeader title={title} Icon={Icon} />}>
            <Component />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

interface TabHeaderProps {
  readonly title: string;
  readonly Icon: IconType;
}

export const TabHeader = ({ title, Icon }: TabHeaderProps): ReactElement => (
  <Stack
    direction="horizontal"
    gap={2}
    className="justify-content-center"
  >
    <Icon />
    <span>{title}</span>
  </Stack>
);

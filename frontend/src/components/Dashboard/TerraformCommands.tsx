import { useState, type ReactElement } from 'react';
import { Modal, Form, Stack } from 'react-bootstrap';
import { Button } from '@/components/Button';
import { FaPlay, FaStop } from 'react-icons/fa6';

interface TerraformCommandsProps {
  numberOfNodes: number;
  instanceType: string;
  numberOfLoaders: number;
  readOps: number;
  writeOps: number;
}

export const TerraformCommands = ({
  numberOfNodes,
  instanceType,
  numberOfLoaders,
  readOps,
  writeOps
}: TerraformCommandsProps): ReactElement => {
  const [isApplyRunning, setIsApplyRunning] = useState(false);

  const handlePlan = async () => {
    try {

      const response = await fetch('http://localhost:5000/tf-plan', {  // Flask app
        method: 'GET',
      });

      if (response.ok) {
        console.log("`terraform plan` started")
      } else {
        const errorText = await response.text();
        console.error('Failed to run terraform plan:', errorText);
      }
    } catch (error) {
      console.error('Error running terraform plan:', error);
    }
  };

  const handleApply = async () => {
    try {

      const response = await fetch('http://localhost:5000/tf-apply', {  // Flask app
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "scylla_node_count": numberOfNodes,
          "scylla_instance_type": instanceType,
          "numberOfLoaders": numberOfLoaders,
          "readOps": readOps,
          "writeOps": writeOps,
        })
      });

      if (response.ok) {
        console.log("`terraform apply` started")
      } else {
        const errorText = await response.text();
        console.error('Failed to run terraform apply:', errorText);
      }
    } catch (error) {
      console.error('Error running terraform apply:', error);
    }
  };

  const handleDestroy = async () => {
    try {

      const response = await fetch('http://localhost:5000/tf-destroy', {  // Flask app
        method: 'GET',
      });

      if (response.ok) {
        console.log("`terraform destroy` started")
      } else {
        const errorText = await response.text();
        console.error('Failed to run terraform destroy:', errorText);
      }
    } catch (error) {
      console.error('Error running terraform destroy:', error);
    }
  };

  return (
    <>
      <Stack direction="horizontal" gap={3} className="mb-3">
        <Button variant="primary" className="w-100" onClick={handlePlan}>
          PLAN
        </Button>
        <Button
          variant={isApplyRunning ? 'warning' : 'success'}
          className="w-100"
          iconProps={{
            Icon: isApplyRunning ? FaStop : FaPlay,
            utilClassesString: 'me-2',
          }}
          onClick={async () => {
            //setIsApplyRunning((isRunning) => !isRunning);
            await handleApply();
          }}
        >{`${isApplyRunning ? 'CANCEL' : 'APPLY'}`}</Button>
        <Button variant="danger" className="w-100"
          onClick={async () => {
            //setIsDestroyRunning((isRunning) => !isRunning);
            await handleDestroy();
          }}>
          DESTROY
        </Button>
      </Stack>
    </>
  );
};

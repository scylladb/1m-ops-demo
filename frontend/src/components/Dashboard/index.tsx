import { useState, type ReactElement } from 'react';
import { ClusterProperties, EC2InstanceType } from '@/components/Dashboard/ClusterProperties';
import { LoaderProperties } from '@/components/Dashboard/LoaderProperties';
import { TerraformCommands } from '@/components/Dashboard/TerraformCommands';

export const Dashboard = (): ReactElement => {
  const [numberOfNodes, setNumberOfNodes] = useState(3);
  const [instanceType, setInstanceType] = useState<EC2InstanceType>('i4i.4xlarge');
  const [readOps, setReadOps] = useState(10000);
  const [writeOps, setWriteOps] = useState(10000);
  const [numberOfLoaders, setNumberOfLoaders] = useState(2);
  

  return (<>
    <TerraformCommands numberOfNodes={numberOfNodes} instanceType={instanceType}
                       numberOfLoaders={numberOfLoaders} readOps={readOps} writeOps={writeOps} />
    <ClusterProperties numberOfNodes={numberOfNodes} setNumberOfNodes={setNumberOfNodes} 
                         instanceType={instanceType} setInstanceType={setInstanceType}/>
    <LoaderProperties numberOfLoaders={numberOfLoaders} setNumberOfLoaders={setNumberOfLoaders}
                      readOps={readOps} setReadOps={setReadOps}
                      writeOps={writeOps} setWriteOps={setWriteOps}  />
  </>)
};

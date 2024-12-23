const { useEffect, useState, useRef } = React;
const { Tabs, Tab, Button, Collapse, Card, Form, Row, Col, Spinner } = ReactBootstrap;

// React Application Code
const App = () => {

      // Use a ref to persist the socket instance across renders
      const socket = useRef(null); 

      // Emit events when buttons are clicked
      const emitEvent = (eventName) => {
        console.log(`Emitting event: ${eventName}`);
        if (socket.current) {
          socket.current.emit(eventName);
        }
      };


    const handleClusterToggle = (isRunning) => {
      if (isRunning) {
        console.log('Loader Started');
      } else {
        console.log('Loader Stopped');
      }
    };

    const handleLoaderToggle = (isRunning) => {
      if (isRunning) {
        console.log('Loader Started');
      } else {
        console.log('Loader Stopped');
      }
    };

    const ConsoleOutput = () => {
      const [output, setOutput] = useState("[Welcome to ScyllaDB Tech Demo]"); 
      const outputRef = useRef(null);

      useEffect(() => {
        // Initialize the socket connection
        socket.current = window.io();

        // Set up event listeners
        socket.current.on("playbook_output", (data) => {
          setOutput((prevOutput) => prevOutput + data.output);
          console.log(data.output);
        });

        // Cleanup socket connection on component unmount
        return () => {
          socket.current.disconnect();
        };
      }, []);

      useEffect(() => {
        // Scroll the pre element to the bottom
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight; 
        }
      }, [output]); 

      return (
        <pre id="output" className="pre flex-grow-1" ref={outputRef}>
          {output}
        </pre>
      );
    };

  // Scenario Card Component
  const ScenarioCard = ({ icon, title, description, collapseId, onClick }) => {
    const [open, setOpen] = useState(true);
    const [runState, setRunState] = useState(0);
     
    const handleButtonClick = () => {
      setRunState(2); 
      if (onClick) {
        onClick(); // Call the parent-provided onClick if it exists
      }
    };

    return (
      <Card className="p-2">
        <div className="desc">
          <a
            className="d-block flex-grow-1"
            onClick={() => setOpen(!open)}
            aria-controls={collapseId}
            aria-expanded={open}
          >
            <h4>
              <i className={icon}></i> {title}
            </h4>
          </a>
          <Collapse in={open}>
            <div id={collapseId}>
              <div className="collapse-content">
                {description}
              </div>
            </div>
          </Collapse>
        </div>
        <div className="actions">
          <RunButton state={runState} onClick={handleButtonClick} />
        </div>
      </Card>
    );
  }; 

  //Icon Component
  const Icon = ({ icon, margin = "me-1", children }) => {
    return (
      <i className={`icon-${icon} ${margin}`}>
        {children}
      </i>
    );
  };

  const Slider = ({ value, min, max, step, onChange, label }) => {
    return (
      <div>
        <Form.Label column sm="4" className="small-label">{label}</Form.Label>
        <Row>
          
          <Col>
            <Form.Range
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={onChange}
            />
            <div className="d-flex justify-content-between">
              <div className="small-label">{min}</div>
              <div className="small-label">{max}</div>
            </div>
          </Col>

          <div style={{ width: '90px' }}>
            <Form.Control
              type="number"
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={onChange}
              className="blend-input"
            />
          </div>
        </Row>
      </div>
    );
  };

  const ToggleButton = ({ initialState, onState, offState, onToggle }) => {
    const [isOn, setIsOn] = useState(initialState);

    const handleClick = () => {
      setIsOn(!isOn);
      onToggle(!isOn); // Notify parent of state change
    };

    return (
      <Button variant={isOn ? 'warning' : 'success'} onClick={handleClick}>
        {isOn ? offState : onState}
      </Button>
    );
  };

  const RunButton = ({ state, onClick }) => {

    return (
      <div>
        {state === 0 && (
          <Button variant="light" onClick={onClick}>
            <i className="icon-play me-2"></i> Run
          </Button>
        )}
        {state === 1 && (
          <Button variant="light" disabled>
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
        )}
        {state === 2 && (
          <Button variant="success" disabled >
            <i className="icon-check"></i>
          </Button>
        )}
      </div>
    );
  };


  const ClusterProperties = ({ handleSaveClusterProperties }) => {
    const [numNodes, setNumNodes] = useState(3);
    const [instanceType, setInstanceType] = useState('t2.micro');

    return (
      <Card>
        <Card.Body>
          <h3 className="mb-3">Cluster Properties</h3>
          <Form className="vstack gap-3 mb-3">
            <Slider
              value={numNodes}
              min={1}
              max={10}
              step={1}
              onChange={(e) => setNumNodes(Number(e.target.value))}
              label="Number of Nodes"
            />

            <Form.Group>
              <Form.Label column sm="4" className="small-label">Instance Type</Form.Label>
              <div>
                <Form.Select
                  value={instanceType}
                  onChange={(e) => setInstanceType(e.target.value)}
                >
                  <option value="t2.micro">t2.micro</option>
                  <option value="t2.small">t2.small</option>
                  <option value="t2.medium">t2.medium</option>
                  <option value="t3.micro">t3.micro</option>
                  <option value="t3.small">t3.small</option>
                  <option value="t3.medium">t3.medium</option>
                </Form.Select>
              </div>
            </Form.Group>

            <div className="hstack gap-3">

              <Button variant="primary" onClick={() => emitEvent("sample_data")}>
                Save
              </Button>
              <ToggleButton
                initialState={false} 
                onState={<><Icon icon="play"/> Run Cluster</>}
                offState={<><Icon icon="stop"/> Stop Cluster</>}
                onToggle={handleClusterToggle}
              />

            </div>

          </Form>
        </Card.Body>
      </Card>
    );
  };

  const LoaderProperties = ({ handleSaveLoaderProperties }) => {
    const [readOps, setReadOps] = useState(1000);
    const [writeOps, setWriteOps] = useState(500);
    const [numLoaders, setNumLoaders] = useState(2);

    return (
      <Card>
        <Card.Body>
          <h3 className="mb-3">Loader Properties</h3>
          <Form className="vstack gap-3">
            <Slider
              value={readOps}
              min={500}
              max={5000}
              step={100}
              onChange={(e) => setReadOps(Number(e.target.value))}
              label="Read Ops/sec"
            />
            <Slider
              value={writeOps}
              min={100}
              max={5000}
              step={100}
              onChange={(e) => setWriteOps(Number(e.target.value))}
              label="Write Ops/sec"
            />
            <Slider
              value={numLoaders}
              min={1}
              max={20}
              step={1}
              onChange={(e) => setNumLoaders(Number(e.target.value))}
              label="Number of Loader Instances"
            />
            <div className="hstack gap-3">
              <Button variant="primary" onClick={() => handleSaveLoaderProperties(readOps, writeOps, numLoaders)}>
                Save
              </Button>
              <ToggleButton
                initialState={false} 
                onState={<><Icon icon="play"/> Start Loader</>}
                offState={<><Icon icon="stop"/> Stop Loader</>}
                onToggle={handleLoaderToggle}
              />
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  // MainContainer Component
  const MainContainer = () => (
    <div className="controls gap-4">
        <div className="top-nav d-flex align-items-center">
          <img src="./img/scylla-logo.svg" alt="ScyllaDB" />
          <div className="flex-grow-1"></div>
          <h3>Tech Demo</h3>
        </div>
        
        <Tabs defaultActiveKey="home" id="controlTabs" className="nav-tabs nav-fill">
          <Tab eventKey="home" title={<><Icon icon="dashboard"/> Dashboard</>}>
            <>
              <ClusterProperties/>
              <LoaderProperties/>
            </>
          </Tab>
          <Tab eventKey="settings" title={<><Icon icon="rocket"/> Scenarios</>}>
            <div>
              <h3 className="mb-3">Tablets demo</h3>
              <ol className="cards-list">
                <li>
                  <ScenarioCard
                    icon="icon-database"
                    title="Set up 3-node cluster"
                    description="Initialize a resilient ScyllaDB cluster with three interconnected nodes, ready for high-performance data operations."
                    collapseId="stepOneCollapse"
                    onClick={() => emitEvent("original_cluster")}
                  />
                </li>
                <li>
                  <ScenarioCard
                    icon="icon-sample-data"
                    title="Load sample data"
                    description="Populate the database with predefined sample data, showcasing key-value pairs, relational mappings, or time-series metrics."
                    collapseId="stepTwoCollapse"
                    onClick={() => emitEvent("sample_data")}
                  />
                </li>
                <li>
                  <ScenarioCard
                    icon="icon-rocket"
                    title="Start loader"
                    description="Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance."
                    collapseId="stepThreeCollapse"
                    onClick={() => emitEvent("start_stress")}
                  />
                </li>
                <li>
                  <ScenarioCard
                    icon="icon-scale_out"
                    title="Scale out (add 3 nodes)"
                    description="Seamlessly add three additional nodes to the cluster, enabling automatic data redistribution and increased capacity using ScyllaDB's tablet architecture."
                    collapseId="stepFourCollapse"
                    onClick={() => emitEvent("scale_out")}
                  />
                </li>
                <li>
                  <ScenarioCard
                    icon="icon-scale_in"
                    title="Scale in (remove 3 nodes)"
                    description="Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance."
                    collapseId="stepFiveCollapse"
                    onClick={() => emitEvent("scale_in")}
                  />
                </li>
                <li>
                  <ScenarioCard
                    icon="icon-stop"
                    title="Stop loader"
                    description="Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance."
                    collapseId="stepSixCollapse"
                    onClick={() => emitEvent("stop_stress")}
                  />
                </li>
              </ol>
            </div>
          </Tab>
          <Tab eventKey="about"  title={<><Icon icon="info"/> About</>}>
            <>
            <Card>
              <Card.Body className="section-about">
                <img src="./img/scylladb-mascot-cloud.svg" alt="" />
                <h2>1 million ops/sec <br/>ScyllaDB demos with Terraform</h2>
                <p className="lead">Test and benchmark ScyllaDB under a 1 million operations per second workload.</p>
              </Card.Body>
            </Card>
            
            <div className="flex-grow-1">
              <div className="hstack justify-content-center gap-3 flex-wrap">
                <Button variant="light" href="https://www.scylladb.com" target="_blank">
                  ScyllaDB.com
                </Button>
                <Button variant="light" href="https://docs.scylladb.com" target="_blank">
                  <Icon icon="docs"/>Documentation
                </Button>
                <Button variant="light" href="https://github.com/scylladb" target="_blank">
                  <Icon icon="github"/>GitHub
                </Button>
                <Button variant="light" href="https://twitter.com/scylladb" target="_blank">
                  <Icon icon="x"/>X
                </Button>
                <Button variant="light" href="https://www.linkedin.com/company/scylladb" target="_blank">
                  <Icon className="linkedin"/>LinkedIn
                </Button>
              </div>
                  
            </div>
            <div className="border-top pt-3 small text-center">
              &copy; {new Date().getFullYear()} ScyllaDB. All rights reserved.
            </div>
            </>
          </Tab>
        </Tabs>
      </div>
  );

  // GrafanaContainer Component
  const GrafanaContainer = () => { 
    

    const [grafanaUrls, setGrafanaUrls] = useState({"Loading Grafana...": ""});

    useEffect(() => {
      fetch('../data/grafana_urls.json') // Adjust the path based on where the file is hosted
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched grafanaUrls');
          setGrafanaUrls(data);
        })
        .catch((error) => {
          console.error('Error fetching grafanaUrls:', error);
        });
    }, []);

    return (
    <div className="grafana">
      <Tabs defaultActiveKey="console" id="tabMenu" className="nav-tabs" transition={false}>
        <Tab eventKey="console" title={
          <>
            <Icon icon="terminal"/> Console
          </>
        }>
          <ConsoleOutput/>
        </Tab>
        {/* Dynamically Rendered Tabs */}
        {Object.entries(grafanaUrls).map(([key, url]) => (
          <Tab eventKey={key.toLowerCase()} title={key} key={key}>
            <iframe
              src={url} title={key}
            ></iframe>
          </Tab>
        ))}
      </Tabs>
    </div>
  )};

  return (
  <>
    <MainContainer />
    <GrafanaContainer/>
  </>
)};

// Render the App Component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
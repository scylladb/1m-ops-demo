import {
  type ReactElement,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { FaTerminal } from 'react-icons/fa6';
import { useSocketContext } from '@/context/socket';
import {
  type GrafanaURLs,
  flaskServerURL,
  isGrafanaUrls,
  isPlaybookOutput,
  playbookOutputEventKey,
} from '@/util/api';
import { TabHeader } from '@/components/TabsLayout';

// This resolves to "<root>/public/data/grafana-urls.json"
const grafanaUrlsPath = '/data/terraform-data.json';

export const GrafanaContainer = (): ReactElement => {
  const [fetchIsPending, setFetchIsPending] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [grafanaUrls, setGrafanaUrls] = useState<GrafanaURLs | null>(null);
  const [fileAvailable, setFileAvailable] = useState(false);


  const fetchAndSetGrafanaUrls = useCallback(async (): Promise<void> => {
    setFetchIsPending(false);
    setIsFetching(true);

    return fetch(grafanaUrlsPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data: unknown) => {
        if (isGrafanaUrls(data)) {
          setGrafanaUrls(data);
        } else {
          throw new Error(
            'Invalid Grafana URLs data received. Expected Record<string, string> but got' +
              String(data)
          );
        }
      })
      .catch((error: unknown) => {
        console.error('Error fetching grafanaUrls:', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(grafanaUrlsPath, { method: 'HEAD' });

        if (response.ok) {
          clearInterval(interval); // Stop checking if the file is found
          setFileAvailable(true);
          fetchAndSetGrafanaUrls(); // Fetch data
        }
      } catch (error) {
        console.log('File not available yet, retrying...');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchIsPending, isFetching, fetchAndSetGrafanaUrls]);

  return (
    <div className="grafana">
      <Tabs
        defaultActiveKey="console"
        id="tabMenu"
        className="nav-tabs"
        transition={false}
      >
        <Tab
          eventKey="console"
          title={
            <TabHeader
              title="Console"
              Icon={FaTerminal}
            />
          }
        >
          <ConsoleOutput />
        </Tab>

        {((fetchIsPending || isFetching) && !fileAvailable) ? (
          <Tab
            eventKey="loading"
            title="&#9203;"
          />
        ) : grafanaUrls ? (
          Object.entries(grafanaUrls["grafana_urls"]).slice(1).map(([key, url]) => ( // skip first entry as it's not URL
            Boolean(grafanaUrls["grafana_urls"]["isScyllaCloud"] == "true") ? (
            <Tab
              eventKey={key.toLowerCase()}
              title={key}
              key={key}
            >
              <a target="_blank" href={url as string}>Open ScyllaDB Cloud Monitoring</a>
            </Tab>
            ) :
            (
            <Tab
              eventKey={key.toLowerCase()}
              title={key}
              key={key}
            >
              <iframe
                src={url as string}
                title={key}
              ></iframe>
            </Tab>
            )
          ))
        ) : (
          <></>
        )}
      </Tabs>
    </div>
  );
};

const ConsoleOutput = (): ReactElement => {
  const { socketRef } = useSocketContext();
  const [output, setOutput] = useState('[Welcome to ScyllaDB DEMO UI]');
  const outputRef = useRef<HTMLPreElement | null>(null);

  // Set up socket connection and listen for playbook output
  useEffect(() => {
    socketRef.current = io(flaskServerURL);

    socketRef.current.on(playbookOutputEventKey, (data: unknown) => {
      if (isPlaybookOutput(data)) {
        setOutput((prevOutput) => prevOutput + data['output']);

        console.log(output);
      } else {
        console.error('Invalid data received:', data);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [socketRef, output]);

  // Scroll the pre element to the bottom on output change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <pre
      id="output"
      className="pre flex-grow-1"
      ref={outputRef}
    >
      {output}
    </pre>
  );
};

import {
  isObject,
  objectHasProperty,
} from '@/util/guard';

export const flaskServerURL = 'http://localhost:5000';

export type ScenarioEventKey =
  | 'original_cluster'
  | 'sample_data'
  | 'start_stress'
  | 'scale_out'
  | 'scale_in'
  | 'stop_stress';

export const playbookOutputEventKey = 'playbook_output';

interface PlaybookOutputData {
  readonly output: string;
}

export const isPlaybookOutput = (data: unknown): data is PlaybookOutputData =>
  isObject(data) &&
  objectHasProperty(data, 'output') &&
  typeof data['output'] === 'string';

export type GrafanaURLs = Readonly<Record<any, any>>;

export type ScenarioSteps = Readonly<Array<string>>;

export const isGrafanaUrls = (data: unknown): data is GrafanaURLs =>
  isObject(data);

export const isScenarioSteps = (data: unknown): data is ScenarioSteps =>
  isObject(data);

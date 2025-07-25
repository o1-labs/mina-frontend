import { FirebaseOptions } from '@firebase/app';

export interface MinaEnv {
  production: boolean;
  configs: MinaNode[];
  identifier?: string;
  isVanilla?: boolean;
  aggregator?: string;
  nodeLister?: {
    domain: string;
    port: number;
  };
  tracingEndpoint?: {
    domain: string;
    port: number;
  };
  sentry?: SentryConfig;
  firebase?: FirebaseOptions;
  globalConfig?: {
    features?: FeaturesConfig;
  };
}

export interface MinaNode {
  name: string;
  graphql: string;
  'tracing-graphql'?: string;
  debugger?: string;
  minaExplorer?: string;
  features?: FeaturesConfig;
}

export type FeaturesConfig = {
  [key in FeatureType]?: string[];
};

export type FeatureType =
  | 'dashboard'
  | 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  | 'benchmarks'
  | 'explorer'
  | 'logs'
  | 'storage'
  | 'snark-worker'
  | 'experiments';

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}

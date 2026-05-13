import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'fetcher',
  // aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  nodeLister: {
    domain: "http://log-fetcher.orchestrator-compose", // Will be replaced by Webpack DefinePlugin
    port: 4000, // Will be replaced by Webpack DefinePlugin
  },
  tracingEndpoint: {
    domain: 'http://log-api.orchestrator-compose',
    port: 9080,
  },
  isVanilla: false,
  globalConfig: {
    features: {
      dashboard: ['nodes', 'topology'],
      tracing: ['overview', 'blocks'],
      experiments: [],
    },
  },
  configs: [],
};

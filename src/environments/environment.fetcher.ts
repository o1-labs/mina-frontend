import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'fetcher',
  // aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  nodeLister: {
    domain: "https://orchestrator-log-fetcher-2.gcp.o1test.net", // Will be replaced by Webpack DefinePlugin
    port: 443, // Will be replaced by Webpack DefinePlugin
  },
  tracingEndpoint: {
    domain: 'https://orchestrator-log-api-2.gcp.o1test.net',
    port: 443,
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

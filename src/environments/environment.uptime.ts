import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'uptime',
  // aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  // nodeLister: {
  //   domain: 'http://65.21.195.80',
  //   port: 4000,
  // },
  isVanilla: true,
  globalConfig: {
    features: {
      dashboard: ['nodes', 'topology'],
      explorer: [
        'blocks',
        'transactions',
        'snark-pool',
        'scan-state',
        'snark-traces',
      ],
      resources: ['system'],
      network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      benchmarks: ['wallets', 'transactions'],
      storage: ['accounts'],
      'snark-worker': ['dashboard', 'actions'],
      'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
    {
      graphql: 'http://plain-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      'tracing-graphql': 'http://plain-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      name: 'plain-1',
    },
    {
      graphql: 'http://plain-2-itn.hetzner-itn-1.gcp.o1test.net:80',
      'tracing-graphql': 'http://plain-2-itn.hetzner-itn-1.gcp.o1test.net:80',
      name: 'plain-2',
    },
    {
      graphql: 'http://whale-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      'tracing-graphql': 'http://whale-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      name: 'whale-1',
    },
    {
      graphql: 'http://whale-2-itn.hetzner-itn-1.gcp.o1test.net:80',
      'tracing-graphql': 'http://whale-2-itn.hetzner-itn-1.gcp.o1test.net:80',
      name: 'whale-2',
    },
    {
      graphql: 'http://coordinator-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      'tracing-graphql':
        'http://coordinator-1-itn.hetzner-itn-1.gcp.o1test.net:80',
      name: 'coordinator-1',
    },
  ],
};

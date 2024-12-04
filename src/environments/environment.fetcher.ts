import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'fetcher',
  // aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  nodeLister: {
    domain: process.env['FETCHER_HOST'] ?? 'localhost',
    port: Number(process.env['FETCHER_PORT'] ?? 4000),
  },
  isVanilla: false,
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
  configs: [],
};
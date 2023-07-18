import { InfrastructureConfig } from '../../../src/config';

export const infrastructure: InfrastructureConfig = {
  kubernetes: {
    clusterName: 'hyperlane-mainnet',
  },
  monitoring: {
    namespace: 'monitoring',
    prometheus: {
      deployName: 'prometheus',
      // Node exporter does not work with GKE Autopilot
      nodeExporterEnabled: false,
      helmChart: {
        // See https://github.com/prometheus-community/helm-charts#usage
        repository: {
          name: 'prometheus-community',
          url: 'https://prometheus-community.github.io/helm-charts',
        },
        name: 'prometheus',
        version: '15.0.1',
      },
    },
  },
  externalSecrets: {
    namespace: 'external-secrets',
    helmChart: {
      repository: {
        name: 'external-secrets',
        url: 'https://charts.external-secrets.io',
      },
      name: 'external-secrets',
      version: '0.5.1',
    },
    gcpServiceAccountName: 'k8s-external-secrets-mainnet2',
    accessibleGCPSecretPrefixes: [
      'hyperlane-mainnet2-',
      'rc-mainnet2-',
      'mainnet2-',
      'permissionless-mainnet2-',
    ],
  },
};

import { KeyFunderConfig } from '../../../src/config/funding.js';
import { Role } from '../../../src/roles.js';
import { Contexts } from '../../contexts.js';

import { environment } from './chains.js';
import { mainnet3SupportedChainNames } from './supportedChainNames.js';

export const keyFunderConfig: KeyFunderConfig<
  typeof mainnet3SupportedChainNames
> = {
  docker: {
    repo: 'gcr.io/abacus-labs-dev/hyperlane-monorepo',
    tag: '1b067fe-20241106-190859',
  },
  // We're currently using the same deployer/key funder key as mainnet2.
  // To minimize nonce clobbering we offset the key funder cron
  // to run 30 mins after the mainnet2 cron.
  cronSchedule: '45 * * * *', // Every hour at the 45-minute mark
  namespace: environment,
  prometheusPushGateway:
    'http://prometheus-prometheus-pushgateway.monitoring.svc.cluster.local:9091',
  contextFundingFrom: Contexts.Hyperlane,
  contextsAndRolesToFund: {
    [Contexts.Hyperlane]: [Role.Relayer, Role.Kathy],
    [Contexts.ReleaseCandidate]: [Role.Relayer, Role.Kathy],
  },
  // desired balance config, must be set for each chain
  desiredBalancePerChain: {
    ancient8: '0.5',
    alephzeroevm: '100',
    apechain: '50',
    arbitrum: '0.5',
    arbitrumnova: '0.05',
    astar: '100',
    astarzkevm: '0.05',
    avalanche: '5',
    b3: '0.05',
    base: '0.5',
    bitlayer: '0.002',
    blast: '0.2',
    bob: '0.2',
    bsc: '5',
    celo: '3',
    cheesechain: '50',
    chiliz: '200',
    coredao: '25',
    cyber: '0.05',
    degenchain: '100',
    dogechain: '100',
    endurance: '20',
    ethereum: '0.5',
    everclear: '0.05',
    fantom: '100',
    flare: '500',
    flow: '5',
    fraxtal: '0.2',
    fusemainnet: '20',
    gnosis: '5',
    gravity: '500',
    harmony: '500',
    immutablezkevm: '25',
    inevm: '3',
    kaia: '250',
    kroma: '0.05',
    linea: '0.2',
    lisk: '0.05',
    lukso: '20',
    lumia: '1',
    mantapacific: '0.2',
    mantle: '20',
    merlin: '0.002',
    metall2: '0.05',
    metis: '3',
    mint: '0.05',
    mode: '0.2',
    molten: '3',
    moonbeam: '5',
    morph: '0.05',
    oortmainnet: '2000',
    optimism: '0.5',
    orderly: '0.05',
    polygon: '20',
    polygonzkevm: '0.5',
    polynomial: '0.05',
    proofofplay: '0.05',
    rari: '0.05',
    real: '0.1',
    redstone: '0.2',
    rootstock: '0.002',
    sanko: '2',
    scroll: '0.5',
    sei: '50',
    shibarium: '50',
    snaxchain: '0.05',
    // ignore non-evm chains
    stride: '0',
    superposition: '0.05',
    taiko: '0.2',
    tangle: '2',
    viction: '3',
    worldchain: '0.2',
    xai: '20',
    xlayer: '0.5',
    zeronetwork: '0.05',
    zetachain: '20',
    zircuit: '0.02',
    zksync: '0.05',
    zoramainnet: '0.2',
    // ignore non-evm chains
    injective: '0',
    neutron: '0',
    osmosis: '0',
    solanamainnet: '0',
    eclipsemainnet: '0',
  },
  // if not set, keyfunder defaults to 0
  desiredKathyBalancePerChain: {
    ancient8: '0',
    arbitrum: '0.1',
    avalanche: '6',
    base: '0.05',
    blast: '0',
    bob: '0',
    bsc: '0.35',
    celo: '150',
    cheesechain: '0',
    cyber: '0',
    degenchain: '0',
    endurance: '0',
    ethereum: '0.4',
    fraxtal: '0',
    fusemainnet: '0',
    gnosis: '100',
    inevm: '0.05',
    kroma: '0',
    linea: '0',
    lisk: '0',
    lukso: '0',
    mantapacific: '0',
    mantle: '0',
    merlin: '0',
    metis: '0',
    mint: '0',
    mode: '0',
    moonbeam: '250',
    optimism: '0.1',
    polygon: '85',
    polygonzkevm: '0.05',
    proofofplay: '0',
    real: '0',
    redstone: '0',
    sanko: '0',
    scroll: '0.05',
    sei: '0',
    taiko: '0',
    tangle: '0',
    viction: '0.05',
    worldchain: '0',
    xai: '0',
    xlayer: '0',
    zetachain: '0',
    zircuit: '0',
    zoramainnet: '0',
    // ignore non-evm chains
    injective: '0',
    neutron: '0',
    osmosis: '0',
    eclipsemainnet: '0',
    solanamainnet: '0',
  },
  // if not set, keyfunder defaults to using desired balance * 0.2 as the threshold
  igpClaimThresholdPerChain: {
    ancient8: '0.1',
    arbitrum: '0.1',
    avalanche: '2',
    base: '0.1',
    blast: '0.1',
    bob: '0.1',
    bsc: '0.3',
    celo: '5',
    cheesechain: '25',
    cyber: '0.025',
    degenchain: '50',
    endurance: '10',
    ethereum: '0.2',
    fraxtal: '0.1',
    fusemainnet: '10',
    gnosis: '5',
    inevm: '3',
    kroma: '0.025',
    linea: '0.1',
    lisk: '0.025',
    lukso: '10',
    mantapacific: '0.1',
    mantle: '10',
    merlin: '0.001',
    metis: '1',
    mint: '0.025',
    mode: '0.1',
    moonbeam: '5',
    optimism: '0.1',
    polygon: '20',
    polygonzkevm: '0.1',
    proofofplay: '0.025',
    real: '0.05',
    redstone: '0.1',
    sanko: '1',
    scroll: '0.1',
    sei: '5',
    taiko: '0.1',
    tangle: '1',
    viction: '2',
    worldchain: '0.1',
    xai: '10',
    xlayer: '0.25',
    zetachain: '20',
    zircuit: '0.01',
    zoramainnet: '0.1',
    // ignore non-evm chains
    injective: '0',
    neutron: '0',
    osmosis: '0',
    eclipsemainnet: '0',
    solanamainnet: '0',
  },
};

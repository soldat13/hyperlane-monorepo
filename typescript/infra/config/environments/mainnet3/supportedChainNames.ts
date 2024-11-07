// These chains may be any protocol type.
// Placing them here instead of adjacent chains file to avoid circular dep
export const mainnet3SupportedChainNames = [
  'ancient8',
  'alephzeroevmmainnet',
  'apechain',
  'arbitrum',
  'arbitrumnova',
  'astar',
  'astarzkevm',
  'flame',
  'avalanche',
  'b3',
  'base',
  'bitlayer',
  'blast',
  'bob',
  'bsc',
  'celo',
  'cheesechain',
  'chilizmainnet',
  'coredao',
  'cyber',
  'degenchain',
  'dogechain',
  'eclipsemainnet',
  'endurance',
  'ethereum',
  'everclear',
  'fantom',
  'flare',
  'flowmainnet',
  'fraxtal',
  'fusemainnet',
  'gnosis',
  'gravity',
  'harmony',
  'immutablezkevmmainnet',
  'inevm',
  'injective',
  'kaia',
  'kroma',
  'linea',
  'lisk',
  'lukso',
  'lumia',
  'mantapacific',
  'mantle',
  'merlin',
  'metal',
  'metis',
  'mint',
  'mode',
  'molten',
  'moonbeam',
  'morph',
  'neutron',
  'oortmainnet',
  'optimism',
  'orderly',
  'osmosis',
  'polygon',
  'polygonzkevm',
  'polynomialfi',
  'prom',
  'proofofplay',
  'rarichain',
  'real',
  'redstone',
  'rootstockmainnet',
  'sanko',
  'scroll',
  'sei',
  'shibarium',
  'snaxchain',
  'solanamainnet',
  'stride',
  'superpositionmainnet',
  'taiko',
  'tangle',
  'viction',
  'worldchain',
  'xai',
  'xlayer',
  'zeronetwork',
  'zetachain',
  'zircuit',
  'zksync',
  'zoramainnet',
] as const;

export const supportedChainNames = [...mainnet3SupportedChainNames];

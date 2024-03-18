import { ethers } from 'ethers';
import path from 'path';
import { prompt } from 'prompts';

import { HelloWorldDeployer } from '@hyperlane-xyz/helloworld';
import {
  ChainMap,
  ContractVerifier,
  ExplorerLicenseType,
  HypERC20Deployer,
  HyperlaneCore,
  HyperlaneCoreDeployer,
  HyperlaneDeployer,
  HyperlaneIgpDeployer,
  HyperlaneIsmFactory,
  HyperlaneProxyFactoryDeployer,
  InterchainAccount,
  InterchainAccountDeployer,
  InterchainQueryDeployer,
  LiquidityLayerDeployer,
  TestRecipientDeployer,
  TokenType,
  resolveAccountOwner,
} from '@hyperlane-xyz/sdk';
import { objMap } from '@hyperlane-xyz/utils';

import { Contexts } from '../config/contexts';
import { deployEnvToSdkEnv } from '../src/config/environment';
import { deployWithArtifacts } from '../src/deployment/deploy';
import { TestQuerySenderDeployer } from '../src/deployment/testcontracts/testquerysender';
import {
  extractBuildArtifact,
  fetchExplorerApiKeys,
} from '../src/deployment/verify';
import { impersonateAccount, useLocalProvider } from '../src/utils/fork';

import {
  Modules,
  SDK_MODULES,
  getAddresses,
  getArgs,
  getContractAddressesSdkFilepath,
  getModuleDirectory,
  withBuildArtifactPath,
  withContext,
  withModuleAndFork,
  withNetwork,
} from './agent-utils';
import { getEnvironmentConfig } from './core-utils';

async function main() {
  const {
    context = Contexts.Hyperlane,
    module,
    fork,
    environment,
    network,
    buildArtifactPath,
  } = await withContext(
    withNetwork(withModuleAndFork(withBuildArtifactPath(getArgs()))),
  ).argv;
  const envConfig = getEnvironmentConfig(environment);
  const env = deployEnvToSdkEnv[environment];

  let multiProvider = await envConfig.getMultiProvider();
  console.log('multiProvider', Object.keys(multiProvider.metadata));

  if (fork) {
    multiProvider = multiProvider.extendChainMetadata({
      [fork]: { blocks: { confirmations: 0 } },
    });
    await useLocalProvider(multiProvider, fork);
    const owner = await resolveAccountOwner(
      multiProvider,
      fork,
      envConfig.owners[fork].owner,
    );
    const signer = await impersonateAccount(owner);
    multiProvider.setSharedSigner(signer);
  }

  let contractVerifier;
  if (buildArtifactPath) {
    // fetch explorer API keys from GCP
    const apiKeys = await fetchExplorerApiKeys();
    // extract build artifact contents
    const buildArtifact = extractBuildArtifact(buildArtifactPath);
    // instantiate verifier
    contractVerifier = new ContractVerifier(
      multiProvider,
      apiKeys,
      buildArtifact,
      ExplorerLicenseType.MIT,
    );
  }

  let config: ChainMap<unknown> = {};
  let deployer: HyperlaneDeployer<any, any>;
  if (module === Modules.PROXY_FACTORY) {
    config = objMap(envConfig.core, (_chain) => true);
    deployer = new HyperlaneProxyFactoryDeployer(
      multiProvider,
      contractVerifier,
    );
  } else if (module === Modules.CORE) {
    config = envConfig.core;
    const ismFactory = HyperlaneIsmFactory.fromAddressesMap(
      getAddresses(environment, Modules.PROXY_FACTORY),
      multiProvider,
    );
    deployer = new HyperlaneCoreDeployer(
      multiProvider,
      ismFactory,
      contractVerifier,
    );
  } else if (module === Modules.WARP) {
    const core = HyperlaneCore.fromEnvironment(env, multiProvider);
    const ismFactory = HyperlaneIsmFactory.fromAddressesMap(
      getAddresses(environment, Modules.PROXY_FACTORY),
      multiProvider,
    );
    const routerConfig = core.getRouterConfig(envConfig.owners);
    console.log('routerConfig', routerConfig.sepolia.owner);
    // const scrollsepolia = {
    //   ...routerConfig.scrollsepolia,
    //   type: TokenType.synthetic,
    //   name: 'Wrapped Ether',
    //   symbol: 'WETH',
    //   decimals: 18,
    //   totalSupply: '0',
    // };
    const sepolia = {
      ...routerConfig.sepolia,
      type: TokenType.native,
    };
    const plumetestnet = {
      ...routerConfig.plumetestnet,
      type: TokenType.synthetic,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      totalSupply: '0',
    };
    config = {
      // scrollsepolia,
      plumetestnet,
      sepolia,
    };
    // return;
    deployer = new HypERC20Deployer(
      multiProvider,
      ismFactory,
      contractVerifier,
    );
    deployer.cacheAddressesMap({
      plumetestnet: {
        interchainAccountRouter: '0xA0aB1750b4F68AE5E8C42d936fa78871eae52643',
      },
      sepolia: {
        interchainAccountRouter: '0x90360940B160B862F2e249124D89d734b3981DAb',
      },
    });
  } else if (module === Modules.INTERCHAIN_GAS_PAYMASTER) {
    config = envConfig.igp;
    deployer = new HyperlaneIgpDeployer(multiProvider, contractVerifier);
  } else if (module === Modules.INTERCHAIN_ACCOUNTS) {
    const core = HyperlaneCore.fromEnvironment(env, multiProvider);
    config = core.getRouterConfig(envConfig.owners);
    // filter config to only include sepolia and optimismgoerli for now
    config = {
      sepolia: config.sepolia,
      scrollsepolia: config.scrollsepolia,
      plumetestnet: config.plumetestnet,
    };
    deployer = new InterchainAccountDeployer(multiProvider, contractVerifier);
    const addresses = getAddresses(environment, Modules.INTERCHAIN_ACCOUNTS);
    console.log('deploy: ICA addresses', JSON.stringify(addresses, null, 2));
    InterchainAccount.fromAddressesMap(addresses, multiProvider);
    return;
  } else if (module === Modules.INTERCHAIN_QUERY_SYSTEM) {
    const core = HyperlaneCore.fromEnvironment(env, multiProvider);
    config = core.getRouterConfig(envConfig.owners);
    deployer = new InterchainQueryDeployer(multiProvider, contractVerifier);
  } else if (module === Modules.LIQUIDITY_LAYER) {
    const core = HyperlaneCore.fromEnvironment(env, multiProvider);
    const routerConfig = core.getRouterConfig(envConfig.owners);
    if (!envConfig.liquidityLayerConfig) {
      throw new Error(`No liquidity layer config for ${environment}`);
    }
    config = objMap(
      envConfig.liquidityLayerConfig.bridgeAdapters,
      (chain, conf) => ({
        ...conf,
        ...routerConfig[chain],
      }),
    );
    deployer = new LiquidityLayerDeployer(multiProvider, contractVerifier);
  } else if (module === Modules.TEST_RECIPIENT) {
    const addresses = getAddresses(environment, Modules.CORE);

    for (const chain of Object.keys(addresses)) {
      config[chain] = {
        interchainSecurityModule:
          addresses[chain].interchainSecurityModule ??
          ethers.constants.AddressZero, // ISM is required for the TestRecipientDeployer but onchain if the ISM is zero address, then it uses the mailbox's defaultISM
      };
    }
    deployer = new TestRecipientDeployer(multiProvider, contractVerifier);
  } else if (module === Modules.TEST_QUERY_SENDER) {
    // Get query router addresses
    const queryAddresses = getAddresses(
      environment,
      Modules.INTERCHAIN_QUERY_SYSTEM,
    );
    config = objMap(queryAddresses, (_c, conf) => ({
      queryRouterAddress: conf.router,
    }));
    deployer = new TestQuerySenderDeployer(multiProvider, contractVerifier);
  } else if (module === Modules.HELLO_WORLD) {
    const core = HyperlaneCore.fromEnvironment(env, multiProvider);
    config = core.getRouterConfig(envConfig.owners);
    deployer = new HelloWorldDeployer(
      multiProvider,
      undefined,
      contractVerifier,
    );
  } else {
    console.log(`Skipping ${module}, deployer unimplemented`);
    return;
  }

  const modulePath = getModuleDirectory(environment, module, context);

  console.log(`Deploying to ${modulePath}`);

  const isSdkArtifact = SDK_MODULES.includes(module) && environment !== 'test';

  const addresses = isSdkArtifact
    ? path.join(
        getContractAddressesSdkFilepath(),
        `${deployEnvToSdkEnv[environment]}.json`,
      )
    : path.join(modulePath, 'addresses.json');

  const verification = path.join(modulePath, 'verification.json');

  const cache = {
    addresses,
    verification,
    read: environment !== 'test',
    write: !fork,
  };
  // Don't write agent config in fork tests
  const agentConfig =
    module === Modules.CORE && !fork
      ? {
          addresses,
          environment,
          multiProvider,
        }
      : undefined;

  // prompt for confirmation in production environments
  if (environment !== 'test' && !fork) {
    const confirmConfig = network ? config[network] : config;
    console.log(JSON.stringify(confirmConfig, null, 2));
    const { value: confirmed } = await prompt({
      type: 'confirm',
      name: 'value',
      message: `Confirm you want to deploy this ${module} configuration to ${environment}?`,
      initial: false,
    });
    if (!confirmed) {
      process.exit(0);
    }
  }

  await deployWithArtifacts(
    config,
    deployer,
    cache,
    network ?? fork,
    agentConfig,
  );
}

main()
  .then()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

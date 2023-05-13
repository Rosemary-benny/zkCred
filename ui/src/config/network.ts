import { toHex } from '@utils/wallet';

export const networkConfig: Record<string, any> = {
  '0x13881': {
    name: 'Polygon Testnet Mumbai',
    title: 'Polygon Testnet Mumbai',
    chainName: 'Polygon',
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpcUrls-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpcUrls.bwarelabs.com',
    ],
    faucets: ['https://faucet.polygon.technology/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'maticmum',
    chainId: 80001,
    networkId: 80001,
    blockExplorerUrls: [
      {
        name: 'polygonscan',
        url: 'https://mumbai.polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },
};

export type AddEthereumChainParameterType = {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
};

export const getNetworkForMetamask = (
  network: any,
): AddEthereumChainParameterType => {
  delete network['name'];
  delete network['faucets'];
  delete network['infoURL'];
  delete network['networkId'];
  delete network['shortName'];
  delete network['title'];
  delete network['blockExplorerUrls'];
  network['chainId'] = toHex(network['chainId']);
  return network;
};

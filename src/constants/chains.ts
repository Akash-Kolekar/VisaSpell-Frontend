// src/constants/chains.ts
import type { Chain } from "wagmi/chains";

// Custom chain for Scroll Sepolia with your API key
export const scrollSepoliaChain: Chain = {
  id: 534351, // Replace 
  name: "Scroll Sepolia",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/Ho11VknkIFwvZFi0QNeHgSk2Ennrq-4B`], // Replace YOUR_API_KEY with your key
    },
    public: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/Ho11VknkIFwvZFi0QNeHgSk2Ennrq-4B`],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
};

// Custom chain for Vanguard Vanar
export const vanguardVanarChain: Chain = {
  id: 78600, // Replace 
  name: "Vanguard Vanar",
  nativeCurrency: {
    name: "Vanar",
    symbol: "VNR",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-vanguard.vanarchain.com"],
    },
    public: {
      http: ["https://rpc-vanguard.vanarchain.com"],
    },
  },
  blockExplorers: {
    default: { name: "Vanar Explorer", url: "https://explorer-vanguard.vanarchain.com" },
  },
  testnet: true,
};

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, scrollSepolia, scroll, sepolia, vanar } from 'wagmi/chains';
import { scrollSepoliaChain, vanguardVanarChain } from "@/constants/chains";

export const config = getDefaultConfig({
  appName: 'Student Visa System',
  projectId: 'ff57aaef61a30290506508a62dc4e88e',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    scrollSepolia,
    scroll,
    sepolia,
    vanar,
    scrollSepoliaChain,
    vanguardVanarChain,
  ],
  // ssr: true,
});

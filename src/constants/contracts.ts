import verificationHubAbi from "./VerificationHub.json";
import embassyGatewayAbi from "./EmbassyGateway.json";
import feeManagerAbi from "./FeeManager.json";
import timelineEnhancerAbi from "./TimelineEnhancer.json";
import universityHandlerAbi from "./UniversityHandler.json";
import studentVisaSystemAbi from "./StudentVisaSystem.json";
import type { Abi } from "viem";


  
  export const VISA_STATUS: Record<number, string> = {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
  };

  export const VISA_FEES: Record<0 | 1 | 2, bigint> = {
    0: BigInt(0.00001 * 1e18), // Standard = 0.000001 ETH
    1: BigInt(0.00003 * 1e18), // Expedited = 0.000003 ETH
    2: BigInt(0.00005 * 1e18), // Emergency = 0.000005 ETH
  };
  
  export const PRIORITY_LEVEL: Record<number, string> = {
    0: "Standard",
    1: "Expedited",
    2: "Emergency",
  };
  

  
export const STUDENT_VISA_CONTRACT = {
  address: "0xbF907BAc50fb0C788130968AC740AA12fFdC2eE6" as `0x${string}`, // Replace with actual deployed contract address
  abi: studentVisaSystemAbi.abi as Abi,
};

export const VERIFICATION_HUB_CONTRACT = {
  address: "0xFaA35f474b695dDd8823864754C56fB566EFb90d" as `0x${string}`,
  abi: verificationHubAbi.abi as Abi,
};

export const EMBASSY_GATEWAY_CONTRACT = {
  address: "0x322Ef8c4c7ec0Dd74F0A493AFDd87d47092Bdf88" as `0x${string}`,
  abi: embassyGatewayAbi.abi as Abi,
};

export const FEE_MANAGER_CONTRACT = {
  address: "0x8BC7017E234Ca88D1A21a023BB98796634fe9588" as `0x${string}`,
  abi: feeManagerAbi.abi as Abi,
};

export const TIMELINE_ENHANCER_CONTRACT = {
  address: "0xf342E9e0995d9677784DD57E876C0B10f89C0593" as `0x${string}`,
  abi: timelineEnhancerAbi.abi as Abi,
};

export const UNIVERSITY_HANDLER_CONTRACT = {
  address: "0xE927A3cE99bBc0204B10Dd81F99e13354a70016D" as `0x${string}`,
  abi: universityHandlerAbi.abi as Abi,
};


export const APPLICATION_ADDRESSES: string[] = [
  "0xB58634C4465D93A03801693FD6d76997C797e42A", 
  "0xStudentAddress2",
];

  
  
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
    0: BigInt(0.0001 * 1e18), // Standard = 0.000001 ETH
    1: BigInt(0.0003 * 1e18), // Expedited = 0.000003 ETH
    2: BigInt(0.0005 * 1e18), // Emergency = 0.000005 ETH
  };
  
  export const PRIORITY_LEVEL: Record<number, string> = {
    0: "Standard",
    1: "Expedited",
    2: "Emergency",
  };
  

  
export const STUDENT_VISA_CONTRACT = {
  address: "0xEb9eB1Dd3fa0333bea7B4Fa053Eb9557e55FDa74" as `0x${string}`, 
  abi: studentVisaSystemAbi.abi as Abi,
};

export const VERIFICATION_HUB_CONTRACT = {
  address: "0x1ac4e8896b044FC61c4B0D3b0456591A3C1c6a49" as `0x${string}`,
  abi: verificationHubAbi.abi as Abi,
};

export const EMBASSY_GATEWAY_CONTRACT = {
  address: "0x444FC16EA2d53f46d68FB833eB62e1E24539f2d6" as `0x${string}`,
  abi: embassyGatewayAbi.abi as Abi,
};

export const FEE_MANAGER_CONTRACT = {
  address: "0x29D8A21C5288F9bd6E8221443f06D57665a53219" as `0x${string}`,
  abi: feeManagerAbi.abi as Abi,
};

export const TIMELINE_ENHANCER_CONTRACT = {
  address: "0xA9e58d307B8A2125F38d47a570653AbA1765A851" as `0x${string}`,
  abi: timelineEnhancerAbi.abi as Abi,
};

export const UNIVERSITY_HANDLER_CONTRACT = {
  address: "0xEC049424385BC993DdBFc0B66B589C7007f4b383" as `0x${string}`,
  abi: universityHandlerAbi.abi as Abi,
};


export const APPLICATION_ADDRESSES: string[] = [
  "0xB58634C4465D93A03801693FD6d76997C797e42A", 
  "0xStudentAddress2",
];

  
  
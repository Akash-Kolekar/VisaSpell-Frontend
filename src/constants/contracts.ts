import contractData from "@/constants/StudentVisaSystem.json";
import verificationHubAbi from "./VerificationHub.json";
import type { Abi } from "viem";


export const STUDENT_VISA_CONTRACT = {
    address: "0x1221d1F70EE5Df5C0c2b9Efac309156aB541f300" as `0x${string}`, // Replace with actual deployed contract address
    abi: contractData.abi,
  };
  
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
  

export const VERIFICATION_HUB_CONTRACT = {
  address: "0xFaA35f474b695dDd8823864754C56fB566EFb90d" as `0x${string}`,
  abi: verificationHubAbi.abi as Abi,
};

  
  
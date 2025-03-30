# Student Visa System

A **Blockchain-based Student Visa Application System** that streamlines the visa application process, integrates role-based access for universities, embassies, verifiers, and administrators, and offers advanced features such as priority processing, document verification, and credibility scoring. This project leverages Solidity smart contracts deployed on Ethereum-compatible chains, Next.js for the frontend, Tailwind CSS for styling, and RainbowKit/Wagmi for wallet connectivity.

---

## Table of Contents

- [Student Visa System](#student-visa-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Smart Contracts](#smart-contracts)
  - [Frontend Architecture](#frontend-architecture)
  - [Roles \& Access](#roles--access)
  - [Installation \& Setup](#installation--setup)
  - [License](#license)

---

## Overview

The **Student Visa System** is designed to provide a transparent, secure, and efficient process for students to apply for visas using blockchain technology. By storing application data on-chain, we ensure immutability and transparency. The system implements role-based access where universities, embassies, verifiers, and administrators have distinct permissions to process and manage visa applications.

---

## Features

- **Priority Processing:**  
  Students can choose between Standard, Expedited, or Emergency processing, with corresponding fees and processing times.

- **Document Verification:**  
  Students submit documents on-chain. Authorized verifiers (university, embassy) verify or reject the documents with comments.

- **Biometric Verification:**  
  An additional credibility boost for students who complete biometric verification.

- **Conditional Approval:**  
  Embassies can issue conditional approvals, requiring further steps or documents from the applicant.

- **Credibility Scoring:**  
  Each applicant has a dynamic credibility score that is updated based on document verifications, biometric checks, and other criteria.

- **Role-Based Access Control:**  
  - **Admin:** Manages roles, contract settings, and fee withdrawals.
  - **University:** Registers programs and verifies student admissions.
  - **Embassy:** Approves, rejects, or conditionally approves applications and requests additional documents.
  - **Verifier:** Processes document verification requests and updates applicant credibility.
  - **Student:** Applies for a visa, submits required documents, and tracks application status.

- **Timeline Enhancement & Predictions:**  
  The system includes a TimelineEnhancer contract to predict processing times and success probabilities based on the application data.

- **Graph Protocol Integration (Optional):**  
  Indexing of contract events for efficient off-chain querying (planned for future enhancements).

---

## Smart Contracts

1. **StudentVisaSystem.sol:**  
   Core contract managing application creation, fee processing, credibility scoring, and final approval/rejection.

2. **UniversityHandler.sol:**  
   Handles university registration, program management, and admission verification.

3. **EmbassyGateway.sol:**  
   Provides functions for embassies to request additional documents and override decisions.

4. **FeeManager.sol:**  
   Manages fee collection and tracks payments in ETH.

5. **TimelineEnhancer.sol:**  
   Generates predictions for processing times and success probabilities based on application data.

6. **VerificationHub.sol:**  
   Manages document verification requests, records verification results, and maintains verifier statistics.

Additional interfaces and helper contracts (e.g., IEmbassyGateway, IFeeManager, IVerificationHub) ensure proper interaction between the modules.

---

## Frontend Architecture

- **Next.js 13+ (App Router):**  
  The project is built with Next.js using the App Router. Global layout, providers, and route-based pages (e.g., `/embassy`, `/university`, `/admin`, `/verifier`, `/profile`) are defined in the `src/app` folder.

- **Tailwind CSS:**  
  Tailwind is used for responsive, utility-first styling. Global styles are defined in `globals.css` and customized in `tailwind.config.js`.

- **RainbowKit & Wagmi:**  
  These libraries handle wallet connectivity and blockchain interactions. The Providers component in `src/app/providers.tsx` wraps the application with the necessary context.

- **React Hooks:**  
  Custom hooks such as `useVisaApplications` are used to fetch application data from the blockchain (or dummy data for prototyping).

- **Notifications:**  
  A Notifications component (using a library like `react-hot-toast`) provides user feedback for transactions and errors.

---

## Roles & Access

- **Admin:**  
  Manages system configuration, role assignments, and fee withdrawals.

- **University:**  
  Registers programs and verifies student admissions.

- **Embassy:**  
  Approves, rejects, or conditionally approves applications; requests additional documents.

- **Verifier:**  
  Processes document verification requests and updates credibility scores.

- **Student (Default):**  
  Applies for visas, submits required documents, and tracks application status.

---

## Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/YourUser/student-visa-frontend.git
   cd student-visa-frontend

2. **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure Environment:**

   - **Tailwind:** Ensure your `tailwind.config.js` includes the correct content paths for all your source files.
   - **RainbowKit/Wagmi:** Update your project ID and chain configurations in `src/lib/wagmi.ts`.
   - **Contract Addresses:** Update `src/constants/contracts.ts` with your deployed contract addresses and corresponding ABIs.

4. **Running the Application**

   - **Local Development:**

     ```bash
     npm run dev
     # or
     yarn dev
     ```

     The application will be available at `http://localhost:3000`.

   - **Production Build:**

     ```bash
     npm run build
     npm run start
     # or
     yarn build
     yarn start
     ```

     This will run a production-optimized build.

5. **Deploying the Contracts**

   - **Compile & Test:**

     ```bash
     forge test
     # or
     npx hardhat test
     ```

   - **Deploy:**

     ```bash
     npx hardhat run scripts/deploy.ts --network sepolia
     ```

   - **Update Frontend:** Copy the deployed contract addresses and corresponding ABIs into `src/constants/contracts.ts`.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
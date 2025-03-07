"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";
import { create } from "ipfs-http-client";

// Initialize the IPFS client (using a public gateway, e.g., Infura)
const ipfsClient = create({ url: "https://ipfs.infura.io:5001/api/v0" });

export default function FileUploadDocument() {
  const { address, isConnected } = useAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState("");
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload file to IPFS and get the hash
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    setUploading(true);
    try {
      const added = await ipfsClient.add(selectedFile);
      const hash = added.path;
      setFileHash(hash);
      alert("File uploaded to IPFS. Hash: " + hash);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file. Check console for details.");
    }
    setUploading(false);
  };

  // Submit the document hash on-chain via the contract
  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      alert("Please connect your wallet.");
      return;
    }
    if (!fileHash) {
      alert("Please upload a file first.");
      return;
    }
    if (!expiryDate) {
      alert("Please provide an expiry date.");
      return;
    }
    try {
      // Convert expiryDate from a date string to a UNIX timestamp (seconds) as BigInt
      const expiryTimestamp = BigInt(Math.floor(new Date(expiryDate).getTime() / 1000));
      // Here we assume DocumentType "2" means "Other" or the appropriate type for file uploads
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "submitDocument",
        args: [address, 2, fileHash, expiryTimestamp],
      });
      alert("Document submitted successfully on-chain!");
      // Clear state after successful submission
      setSelectedFile(null);
      setFileHash(null);
      setExpiryDate("");
    } catch (err: any) {
      console.error("Error submitting document:", err);
      alert("Failed to submit document. Check the console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Upload Document to IPFS & Submit
      </h2>
      {!isConnected ? (
        <p className="text-center text-red-500">Please connect your wallet.</p>
      ) : (
        <>
          <div className="mb-4">
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload File to IPFS"}
          </button>
          {fileHash && (
            <p className="mt-2 text-center text-green-500">
              File Hash: {fileHash}
            </p>
          )}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            onClick={handleSubmitDocument}
            disabled={isPending}
            className={`w-full p-3 rounded-lg font-bold transition-all mt-4 ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isPending ? "Submitting Document..." : "Submit Document On-chain"}
          </button>
          {isSuccess && (
            <p className="text-center text-green-500 mt-3">
              Document submitted successfully on-chain!
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 mt-3">
              Error: {error.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

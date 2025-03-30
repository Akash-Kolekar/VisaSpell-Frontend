"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

// We will dynamically load the IPFS HTTP client on the client side.
async function createIpfsClient() {
  const { create } = await import("ipfs-http-client");
  return create({ url: "https://ipfs.infura.io:5001/api/v0" });
}

export default function FileUploadDocument() {
  const { address, isConnected } = useAccount();
  const [ipfsClient, setIpfsClient] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState("");
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Load IPFS client only on the client side.
  useEffect(() => {
    createIpfsClient()
      .then((client) => setIpfsClient(client))
      .catch((err) => console.error("Failed to load IPFS client:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    if (!ipfsClient) {
      alert("IPFS client is not loaded yet. Please try again in a moment.");
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
      // Convert expiryDate from a date string to a UNIX timestamp (in seconds) as BigInt
      const expiryTimestamp = BigInt(Math.floor(new Date(expiryDate).getTime() / 1000));
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "submitDocument",
        args: [address, 2, fileHash, expiryTimestamp],
      });
      // Clear state after successful submission
      setSelectedFile(null);
      setFileHash(null);
      setExpiryDate("");
    } catch (err: any) {
      console.error("Error submitting document:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        Document Upload to IPFS
      </h2>
      
      {!isConnected ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to upload documents.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Step 1: Upload to IPFS
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to select file</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={uploading || !ipfsClient || !selectedFile}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  uploading || !ipfsClient || !selectedFile
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-sm"
                }`}
              >
                {uploading ? "Uploading..." : "Upload to IPFS"}
              </button>
            </div>
          </div>
          
          {fileHash && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">File Hash:</p>
              <p className="font-mono text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                {fileHash}
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Step 2: Submit On-chain
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              
              <button
                onClick={handleSubmitDocument}
                disabled={isPending || !fileHash || !expiryDate}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isPending || !fileHash || !expiryDate
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-sm"
                }`}
              >
                {isPending ? "Processing..." : "Submit Document On-chain"}
              </button>
            </div>
          </div>
          
          {isSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-center text-green-600 dark:text-green-300 font-medium">
                Document submitted successfully on-chain!
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
              <p className="text-center text-red-600 dark:text-red-300 font-medium">
                Error submitting document
              </p>
              <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
                {error.message.slice(0, 100)}...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

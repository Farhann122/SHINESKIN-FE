import React, { useState } from "react";
import axiosInstance from "../../ax";

const CheckOutModal = ({ onUploadSuccess }) => {
  const [transactionId, setTransactionId] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleTransactionIdChange = (event) => {
    setTransactionId(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!transactionId) {
      setUploadStatus("Please enter a valid Transaction ID.");
      return;
    }

    if (!file) {
      setUploadStatus("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("imageTransaction", file);

    try {
      setUploadStatus("Uploading...");
      const response = await axiosInstance.put(
        `/api/update-transaction/${transactionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus("Upload successful!");
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message || "Upload failed. Please try again."
          : "Upload failed due to a network error.";
      setUploadStatus(errorMessage);
    }
  };

  return (
    <div>
      <h2>Check Out Modal</h2>
      <div>
        <label>
          Transaction ID:
          <input
            type="text"
            value={transactionId}
            onChange={handleTransactionIdChange}
            placeholder="Enter Transaction ID"
          />
        </label>
      </div>
      <div>
        <label>
          Upload Image:
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default CheckOutModal;

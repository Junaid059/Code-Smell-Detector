import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);  // For error handling

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);  // Clear previous results
    setErrorMessage(null);  // Clear previous errors
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Response from server:", response.data); // Log the server response
      setResult(response.data);  // Set the result from Checkstyle
    } catch (error) {
      console.error("Error uploading file", error.response?.data || error); // Log the full error response
      setErrorMessage("Error processing file."); // Display a generic error message
      setResult(null); // Clear result on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Code Smell Detector</h1>
        
        {/* Square Container for displaying code smells */}
        <div className="result-container">
          <h3>Detected Code Smells:</h3>
          <div className="result-box">
            {loading ? (
              <p>Processing file, please wait...</p>
            ) : result ? (
              // Check if result.messages exists and is an array before using join
              Array.isArray(result.messages) && result.messages.length > 0 ? (
                <pre>{result.messages.join('\n')}</pre>  // Use <pre> for formatted output
              ) : (
                <p>No code smells detected.</p> // Handle case where no smells are detected
              )
            ) : (
              <p>No file uploaded yet. The result will appear here after detection.</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Upload Button */}
        <div className="upload-section">
          <label className="custom-file-upload">
            <input type="file" onChange={handleFileChange} />
            {file ? file.name : "Choose File"}
          </label>
          <button onClick={handleFileUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload and Detect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
    setErrorMessage(null);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      console.log("Uploading file:", file); 
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setErrorMessage(false);
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file", error.response?.data || error);
      setErrorMessage("Error processing file.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Code Smell Detector</h1>
        <div className="result-container">
          <h3>Detected Code Smells:</h3>
          <div className="result-box">
            {loading ? (
              <PulseLoader />
            ) : result ? (
              Array.isArray(result.smells) && result.smells.length > 0 ? (
                <pre>
                  {result.smells.map(smell => (
                    <div key={smell.type}>
                      <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Type: {smell.type}</span>, Details: {smell.details}
                    </div>
                  ))}
                </pre>
              ) : (
                <p>No code smells detected.</p>
              )
            ) : (
              <p>No file uploaded yet. The result will appear here after detection.</p>
            )}
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="upload-section">
          <label className="custom-file-upload">
            <input type="file" onChange={handleFileChange} />
            {file ? file.name : "Choose File"}
          </label>
          <button onClick={handleFileUpload} disabled={loading}>
            {loading ? <PulseLoader /> : "Upload and Detect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

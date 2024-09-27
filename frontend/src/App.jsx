import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file", error);
      setResult("Error processing file.");
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
            {result ? (
              <pre>{result}</pre>
            ) : (
              <p>No file uploaded yet. The result will appear here after detection.</p>
            )}
          </div>
        </div>

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

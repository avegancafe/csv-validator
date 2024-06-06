import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [templateHeaders, setTemplateHeaders] = useState([]);
  const [testHeaders, setTestHeaders] = useState([]);
  const [validationResult, setValidationResult] = useState(null);

  const handleTemplateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const headers = result.data[0];
          setTemplateHeaders(headers);
        }
      });
    }
  };

  const handleTestUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const headers = result.data[0];
          setTestHeaders(headers);
          validateHeaders(headers);
        }
      });
    }
  };

  const validateHeaders = (headers) => {
    const missingHeaders = templateHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      setValidationResult(`Missing columns: ${missingHeaders.join(', ')}`);
    } else {
      setValidationResult('All columns are present.');
    }
  };

  return (
    <div className="App">
      <h1>CSV Validator</h1>
      <div>
        <label>
          Upload Template CSV:
          <input type="file" accept=".csv" onChange={handleTemplateUpload} />
        </label>
      </div>
      <div>
        <label>
          Upload Test CSV:
          <input type="file" accept=".csv" onChange={handleTestUpload} />
        </label>
      </div>
      {validationResult && (
        <div>
          <h2>Validation Result:</h2>
          <p>{validationResult}</p>
        </div>
      )}
    </div>
  );
}

export default App;

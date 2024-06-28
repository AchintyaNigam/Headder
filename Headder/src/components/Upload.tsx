import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from './ui/input';
import '../App.css';

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) 
    {
      setError('File size exceeds 5 MB');
      setFile(null);
    } 
    else 
    {
      setError(null);
      setFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('header', headerText);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/docx/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Create a blob object from the response
        const blob = await response.blob();
        // Create a URL for the blob object
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const a = document.createElement('a');
        // Set the href and download attributes for the link
        a.href = url;
        a.download = 'modified_document.docx';
        // Append the link to the body
        document.body.appendChild(a);
        // Click the link to trigger the download
        a.click();
        // Remove the link from the body
        document.body.removeChild(a);
        // Clean up by revoking the object URL
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Upload Page</h1>
      <p>If a header doesn't exit in the file a new one will get created. If it does exist, it will be replaced with your input</p>
      <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a .docx file here, or click to select one</p>
        {file && <p>Selected file: {file.name}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <Input
        type="text"
        placeholder="Enter header text"
        value={headerText}
        onChange={(e) => setHeaderText(e.target.value)}
        style={{ marginTop: '20px', padding: '10px', width: '100%' }}
      />
      {file && (
        <button onClick={handleUpload} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Upload and Download
        </button>
      )}
    </div>
  );
}

export default Upload;

import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Import the CSS

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false); // To disable button during upload

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage(''); // Clear any previous messages
        } else {
            setMessage('No file selected');
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        // File validation
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true); // Disable upload button during upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3307/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message || 'File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file');
        } finally {
            setIsUploading(false); // Enable button after upload
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
                    className="file-input"
                    onChange={handleFileChange}
                />
                <button
                    type="submit"
                    className="upload-button"
                    disabled={isUploading || !file} // Disable button if no file or uploading
                >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
            {message && (
                <p className={`message ${message.includes('Failed') ? 'error-message' : 'success-message'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default FileUpload;

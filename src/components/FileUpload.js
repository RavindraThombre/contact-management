// src/components/FileUpload.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Optional: Add styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3307/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setContacts(response.data.contacts);  // Save contacts


            // Navigate to Dashboard after successful upload
            if (response.status === 200) {
                navigate('/dashboard'); // Change '/dashboard' to your actual dashboard route
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file');
        }
    };


    return (
        <div className="upload-container">
            <form onSubmit={handleFileUpload}>
                <input type="file" className="file-input" accept=".csv, .xlsx" onChange={handleFileChange} />
                <button type="submit" className="upload-button">Upload File</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;

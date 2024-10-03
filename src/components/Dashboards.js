// Dashboard.js (React component)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboards = () => {
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:3307/api/contacts', {
                    params: { page, limit: 10 },  // Fetch 10 contacts per page
                });
                setContacts(response.data.contacts);
                setTotalPages(response.data.totalPages);  // Update total pages
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, [page]);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Contact Dashboard</h2>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>State</th>
                        <th>Company Name</th>
                        <th>Designation</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.clientName}</td>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>{contact.state}</td>
                            <td>{contact.companyName}</td>
                            <td>{contact.designation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-buttons">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="pagination-btn"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboards;

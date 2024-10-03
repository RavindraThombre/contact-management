// Dashboard.js (React component)
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboards = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredContacts, setFilteredContacts] = useState([]); // Filtered contacts to display
  const [loading, setLoading] = useState(true); // Loading state
  const [stateFilter, setStateFilter] = useState(""); // Filter for state
  const [companyFilter, setCompanyFilter] = useState(""); // Filter for company name

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:3307/api/contacts", {
          params: { page, limit: 10 }, // Fetch 10 contacts per page
        });
        console.log("API Response:", response.data);
        // setContacts(response.data.contacts);
        setContacts(response.data || []);
        setFilteredContacts(response.data.contacts || response.data || []);

        setTotalPages(response.data.totalPages); // Update total pages
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
        setFilteredContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [page]);




  // Function to identify duplicates
  const getDuplicateContacts = () => {
    const duplicates = {};
    contacts.forEach(contact => {
      const key = `${contact.firstName}-${contact.lastName}-${contact.email}`; // Adjust the key based on your criteria
      duplicates[key] = (duplicates[key] || 0) + 1;
    });
    return Object.keys(duplicates).filter(key => duplicates[key] > 1);
  };

  const duplicateKeys = getDuplicateContacts();




  // This function handles the filtering logic
  const handleFilterChange = () => {
    let filtered = contacts;

    if (stateFilter) {
      filtered = filtered.filter((contact) =>
        contact.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filtered = filtered.filter((contact) =>
        contact.companyName?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  };

  // Call the filter function every time the state or company filters change
  useEffect(() => {
    handleFilterChange();
  }, [stateFilter, companyFilter, contacts]);

  if (loading) {
    return <p>Loading contacts...</p>; // Display a loading message
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Contact Dashboard</h2>
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="stateFilter">Filter by State:</label>
          <input
            type="text"
            id="stateFilter"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)} // Update state filter
            placeholder="Enter State"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="companyFilter">Filter by Company:</label>
          <input
            type="text"
            id="companyFilter"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)} // Update company filter
            placeholder="Enter Company Name"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <div className="dashboard-actions">
            <Link to="/upload" className="upload-link">
              <button className="upload-button">Upload Contacts</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table  */}
      {/* <table className="dashboard-table">
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
      </table> */}

      {/* Contact Table */}
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
        {/* <tbody>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.clientName}</td>
                <td>{contact.firstName}</td>
                <td>{contact.lastName}</td>
                <td>{contact.email}</td>
                <td>{contact.state}</td>
                <td>{contact.companyName}</td>
                <td>{contact.designation}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No contacts found</td>
            </tr>
          )}
        </tbody> */}

        {contacts
          .filter(contact =>
            (stateFilter === '' || contact.state.toLowerCase().includes(stateFilter.toLowerCase())) &&
            (companyFilter === '' || contact.companyName.toLowerCase().includes(companyFilter.toLowerCase()))
          )
          .map(contact => {
            // Create a key for each contact based on the criteria used for duplicates
            const key = `${contact.firstName}-${contact.lastName}-${contact.email}`;
            const isDuplicate = duplicateKeys.includes(key);

            return (
              <tr key={contact.id} className={isDuplicate ? 'duplicate' : ''}>
                <td>{contact.clientName}</td>
                <td>{contact.firstName}</td>
                <td>{contact.lastName}</td>
                <td>{contact.email}</td>
                <td>{contact.state}</td>
                <td>{contact.companyName}</td>
                <td>{contact.designation}</td>
              </tr>
            );
          })}
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

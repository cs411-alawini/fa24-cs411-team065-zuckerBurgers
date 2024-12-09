"use client";
import React, { useState } from 'react';

function SearchVendors() {
  const [category, setCategory] = useState<string>('');
  const [budget, setBudget] = useState<number | string>('');
  const [name, setName] = useState<string>('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Styles for the component
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#2C2C2C',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    color: '#E0E0E0',
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.5em',
    color: '#FFFFFF',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#D1D1D1',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#3A3A3A',
    color: '#E0E0E0',
    fontSize: '1em',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonLoadingStyle: React.CSSProperties = {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  };

  const errorMessageStyle: React.CSSProperties = {
    color: '#FF4C4C',
    textAlign: 'center',
    marginTop: '10px',
  };

  const resultsContainerStyle: React.CSSProperties = {
    marginTop: '20px',
  };

  const vendorItemStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid #444',
    marginBottom: '10px',
  };

  const vendorNameStyle: React.CSSProperties = {
    fontSize: '1.2em',
    color: '#00BFFF',
  };

  const vendorCategoryStyle: React.CSSProperties = {
    fontStyle: 'italic',
    color: '#D1D1D1',
  };

  // Function to handle the search request
  const fetchVendors = async () => {
    if (!category && !name && !budget) {
      setError('Please provide at least one search criterion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (name) params.append('name', name);
      if (budget) params.append('budget', budget.toString());

      const response = await fetch(`http://127.0.0.1:5000/vendors/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }

      const data = await response.json();
      if (data.vendors) {
        setVendors(data.vendors);
      } else {
        setError('No vendors found matching your criteria');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Search Vendors</h2>
      <div style={formGroupStyle}>
        <label htmlFor="name" style={labelStyle}>Vendor Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter vendor name"
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="category" style={labelStyle}>Service Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Decor">Decor</option>
          <option value="Music">Music</option>
          <option value="Photography">Photography</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="budget" style={labelStyle}>Budget:</label>
        <input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter max budget"
          style={inputStyle}
        />
      </div>
      <button
        style={{ ...buttonStyle, ...(loading ? buttonLoadingStyle : {}) }}
        onClick={fetchVendors}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search Vendors'}
      </button>

      {error && <p style={errorMessageStyle}>{error}</p>}

      {vendors.length > 0 && (
        <div style={resultsContainerStyle}>
          <h3 style={{ color: '#FFFFFF' }}>Results:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {vendors.map((vendor, index) => (
              <li key={index} style={vendorItemStyle}>
                <strong style={vendorNameStyle}>{vendor.name}</strong> - <span style={vendorCategoryStyle}>{vendor.service_category}</span>
                <p><em>Description:</em> {vendor.description}</p>
                <p><em>Base Price:</em> ${vendor.base_price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchVendors;

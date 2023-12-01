import React, { useState } from 'react';

function ManifestUpload() {
    const [tenant, setTenant] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        // ... (Copy the code inside fetchFiles function from your previous code)
    };

    const handleTenantChange = (event) => {
        setTenant(event.target.value);
    };

    const handleSearchClick = () => {
        fetchFiles();
    };

    return (
        <div>
            <div className="tenant-input-container">
                <input
                    type="text"
                    value={tenant}
                    onChange={handleTenantChange}
                    placeholder="Enter Your Name"
                />
                <button onClick={handleSearchClick} disabled={loading}>
                    {loading ? 'Loading...' : 'Load My Files'}
                </button>
                {error && <p className="error">{error}</p>}
            </div>
            <div className="file-gallery">
                {/* ... (Copy the code inside files.map() from your previous code) */}
            </div>
        </div>
    );
}

export default ManifestUpload;

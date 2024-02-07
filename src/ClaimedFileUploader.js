import React, { useState } from 'react';

const ClaimedFileUploader = ({ userName }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedToFileBaby, setSavedToFileBaby] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSaveToFileBaby = async () => {
        if (!file || !userName) {
            setError('No file selected or user name is not defined.');
            return;
        }

        setIsLoading(true);
        setError('');

        const containerUrl = 'https://filebaby.blob.core.windows.net/filebabyblob';
        const sasToken = process.env.REACT_APP_SAS_TOKEN;
        const filePath = `${containerUrl}/${userName}/${file.name}?${sasToken}`;

        try {
            const response = await fetch(filePath, {
                method: 'PUT',
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (!response.ok) {
                throw new Error(`Failed to save to File Baby with status: ${response.status}`);
            }

            setSavedToFileBaby(true);
            setTimeout(() => setSavedToFileBaby(false), 3000); // Reset after 3 seconds
        } catch (error) {
            console.error('Error saving to File Baby:', error);
            setError(`Error saving to File Baby: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const manifestResponse = await fetch('https://paybots-claim-engine.azurewebsites.net/api/manifest', {
                method: 'POST',
                body: formData,
            });

            if (manifestResponse.status === 500) {
                throw new Error("No Manifest Found");
            }

            if (!manifestResponse.ok) {
                throw new Error(`Manifest retrieval failed with status: ${manifestResponse.status}`);
            }

            const manifestData = await manifestResponse.json();

            if (manifestData) {
                await handleSaveToFileBaby();
            } else {
                throw new Error("No Manifest Found.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="claimedFileUploader">
            <h1>Upload Claimed File</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !file}>Upload File</button>
                </div>
            </form>

            {isLoading && <p>Checking for manifest and uploading...</p>}
            {error && <p className="error">{error}</p>}
            {savedToFileBaby && <p>File saved to File Baby successfully!</p>}
        </div>
    );
};

export default ClaimedFileUploader;


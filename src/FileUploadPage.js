import React, { useState } from 'react';

function FileUploadPage({ userName }) {
    const [manifestFile, setManifestFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [error, setError] = useState('');
    const [savedToFileBaby, setSavedToFileBaby] = useState(false);

    const handleManifestFileChange = (event) => {
        setManifestFile(event.target.files[0]);
    };

    const handleImageFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        if (manifestFile) {
            formData.append('file', manifestFile);
        }
        if (imageFile) {
            formData.append('file', imageFile);
        }

        try {
            const response = await fetch('https://paybots-claim-engine.azurewebsites.net/api/http_example', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`File upload failed with status: ${response.status}`);
            }

            const responseData = await response.arrayBuffer();
            setUploadResponse(responseData);
        } catch (error) {
            console.error('Error uploading files:', error);
            setError(`Error uploading files: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToFileBaby = async () => {
        if (!userName) {
            setError('User name is not defined. Cannot save to specific folder.');
            return;
        }

        setIsLoading(true);
        try {
            const containerUrl = 'https://filebaby.blob.core.windows.net/filebabyblob';
            const sasToken = process.env.REACT_APP_SAS_TOKEN;
            const filePath = `${containerUrl}/${userName}/${imageFile.name}?${sasToken}`;
            const response = await fetch(filePath, {
                method: 'PUT',
                headers: { 'x-ms-blob-type': 'BlockBlob' },
                body: new Blob([uploadResponse]),
            });

            if (!response.ok) {
                throw new Error(`Failed to save to File Baby with status: ${response.status}`);
            }

            setSavedToFileBaby(true);
        } catch (error) {
            console.error('Error saving to File Baby:', error);
            setError(`Error saving to File Baby: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>2. Upload Manifest and Image</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="manifestFile">Manifest File:</label>
                    <input
                        id="manifestFile"
                        type="file"
                        onChange={handleManifestFileChange}
                        accept=".json"
                    />
                </div>
                <div>
                    <label htmlFor="imageFile">Image File:</label>
                    <input
                        id="imageFile"
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/jpeg,image/png"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !manifestFile || !imageFile}>
                    Upload Files
                </button>
            </form>

            {isLoading && <p>Uploading...</p>}
            {error && <p className="error">{error}</p>}
            {uploadResponse && !savedToFileBaby && (
                <div>
                    <img src={URL.createObjectURL(new Blob([uploadResponse]))} alt="Processed" />
                    <button onClick={handleSaveToFileBaby} disabled={isLoading}>
                        Save to File Baby
                    </button>
                </div>
            )}

            {savedToFileBaby && <p>Image saved to File Baby successfully!</p>}
        </div>
    );
}

export default FileUploadPage;

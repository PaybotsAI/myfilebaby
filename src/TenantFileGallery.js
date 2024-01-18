import React, { useState, useEffect, useCallback } from 'react';
import './TenantFileGallery.css';

import { Button } from '@material-tailwind/react';
import { GoShare } from "react-icons/go";
import { MdOutlineVerified } from "react-icons/md";

function TenantFileGallery({ userName }) {
  const [tenant, setTenant] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerUrl = `https://claimed.at.file.baby/filebabyblob`;

  const fetchFiles = useCallback(async () => {
    if (!tenant) {
      setError('Please enter a tenant name.');
      return;
    }

    setError('');
    setLoading(true);
    setFiles([]);

    try {
      const response = await fetch(`${containerUrl}?restype=container&comp=list&prefix=${encodeURIComponent(tenant)}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const blobs = Array.from(xml.querySelectorAll('Blob'));
      const filesData = blobs.map(blob => {
        const fullPath = blob.querySelector('Name').textContent;
        const fileName = fullPath.split('/').pop();
        const fileExtension = fileName.split('.').pop();
        const encodedFilePath = encodeURIComponent(fullPath.split(`.${fileExtension}`)[0]);
        const url = `${containerUrl}/${encodedFilePath}.${fileExtension}`;
        const verifyUrl = `https://contentcredentials.org/verify?source=${encodeURIComponent(url)}`;
        return { name: fileName, url, verifyUrl };
      }).filter(file => !file.name.endsWith('.c2pa') && !file.name.endsWith('_thumbnail.png'));

      setFiles(filesData);
    } catch (e) {
      console.error('Error fetching files:', e);
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  }, [containerUrl, tenant]);

  useEffect(() => {
    if (userName) {
      setTenant(userName);
      fetchFiles();
    }
  }, [userName, fetchFiles]);

  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };

  const handleSearchClick = () => {
    fetchFiles();
  };

  const handleShareClick = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL Copied to Clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const handleVerify = (url) => {
    window.open(url);
  }

  const audioPlaceholder = './audio_placeholder.png'; // Path to your audio placeholder image

  const getFileThumbnail = (file) => {
    if (file.name.endsWith('.mp3')) {
      return audioPlaceholder;
    }
    return file.url;
  };

  return (
      <div>
        <h1>My Files</h1>
        <div className="tenant-input-container">
          <input
              type="text"
              value={tenant}
              onChange={handleTenantChange}
              placeholder="Enter Your Name"
              disabled={!!userName}
          />
          <button onClick={handleSearchClick} disabled={loading}>
            {loading ? 'Loading...' : 'Load My Files'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="file-gallery">
        {files.map((file, index) => (
          <div
            key={index}
            className="file-item relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setHoveredIndex(index)}
          >
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center no-underline">
              <img className="w-full h-full object-cover" src={getFileThumbnail(file)} alt={file.name} />
              <p>{file.name.substring(0, 20) + '...'}</p>
            </a>
            {hoveredIndex === index && (
              <div className="buttons-container absolute bottom-0 left-0 right-0 flex justify-center ">
                <div className="bg-gray-200 w-full flex justify-center p-2 rounded-t-lg">
                  <Button onClick={() => handleVerify(file.verifyUrl)} className="mr-1 p-2 bg-blue-300 flex items-center">
                    <MdOutlineVerified className="mr-1" size={20}/>
                    Verify
                  </Button>
                  <Button onClick={() => handleShareClick(file.url)} className="ml-1 p-2 bg-red-400 flex items-center">
                    <GoShare className="mr-1" size={20}/>
                    <span className='text-sm'>Share</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    
      </div>
  );
}

export default TenantFileGallery;

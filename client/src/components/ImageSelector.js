// src/components/ImageSelector.js
import React, { useState, useEffect } from 'react';

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = "72KL0bCjNhn_sswwnFQ-kBdVH718gU7W1MGZkpKtQzA"; // Replace with your API key

// Helper function to return a search query based on category and vibe keywords.
const getQueryForEvent = (category, vibeKeywords) => {
  const defaultQueries = {
    BIRTHDAY: 'birthday celebration',
    WEDDING: 'romantic wedding',
    ANNIVERSARY: 'anniversary elegant',
    DINNER: 'dinner party',
    CHECKIN: 'casual meetup',
    GIFT_REMINDER: 'gift ideas',
    OTHER: 'social event'
  };
  let query = defaultQueries[category] || 'social event';
  if (vibeKeywords && vibeKeywords.trim().length > 0) {
    query += ' ' + vibeKeywords;
  }
  return query;
};

const ImageSelector = ({ category, vibeKeywords, onImageSelect }) => {
  const [curatedImages, setCuratedImages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("curated");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  useEffect(() => {
    // Fetch curated images from Unsplash when in gallery mode.
    const fetchImages = async () => {
      try {
        const query = getQueryForEvent(category, vibeKeywords);
        const response = await fetch(
          `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const data = await response.json();
        setCuratedImages(data.results);
      } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
      }
    };
    if (selectedTab === "curated") {
      fetchImages();
    }
  }, [selectedTab, category, vibeKeywords]);

  const handleSelectCuratedImage = (url) => {
    setSelectedImageUrl(url);
    onImageSelect(url);
  };

  // New file upload function that calls your backend /api/upload endpoint
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          setSelectedImageUrl(data.url);
          onImageSelect(data.url);
        } else {
          console.error("Upload failed:", data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="container mt-3">
      <div className="btn-group mb-3">
        <button 
          type="button"
          className={`btn btn-${selectedTab === "curated" ? "primary" : "secondary"}`}
          onClick={() => setSelectedTab("curated")}
        >
          Choose from Gallery
        </button>
        <button 
          type="button"
          className={`btn btn-${selectedTab === "upload" ? "primary" : "secondary"}`}
          onClick={() => setSelectedTab("upload")}
        >
          Upload Your Own
        </button>
      </div>

      {selectedTab === "curated" && (
        <div className="row">
          {curatedImages.map((img) => (
            <div key={img.id} className="col-md-4 mb-3">
              <img 
                src={img.urls.small} 
                alt={img.alt_description || "Gallery Image"} 
                className="img-thumbnail"
                style={{
                  cursor: "pointer",
                  border: selectedImageUrl === img.urls.regular ? "3px solid blue" : "none"
                }}
                onClick={() => handleSelectCuratedImage(img.urls.regular)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedTab === "upload" && (
        <div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="mb-2"
          />
          {selectedImageUrl && (
            <div className="mt-2">
              <p className="text-sm text-paynes-gray">Upload Preview:</p>
              <img 
                src={selectedImageUrl} 
                alt="Upload Preview" 
                className="img-thumbnail" 
                style={{ maxWidth: "300px" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSelector;

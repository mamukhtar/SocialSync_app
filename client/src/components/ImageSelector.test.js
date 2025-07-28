import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ImageSelector from './ImageSelector';

global.URL.createObjectURL = jest.fn(() => 'test-url');

// Mock Unsplash API response data
const mockUnsplashResults = {
  results: [
    { 
      id: '1', 
      alt_description: 'Test Image 1', 
      urls: { 
        small: 'https://example.com/img1-small.jpg', 
        regular: 'https://example.com/img1-regular.jpg' 
      } 
    },
    { 
      id: '2', 
      alt_description: 'Test Image 2', 
      urls: { 
        small: 'https://example.com/img2-small.jpg', 
        regular: 'https://example.com/img2-regular.jpg' 
      } 
    },
  ]
};

// Mock the global fetch so it returns our mock data
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('unsplash.com')) {
      // Mock Unsplash image fetch
      return Promise.resolve({
        json: () => Promise.resolve(mockUnsplashResults)
      });
    }

    if (url.includes('/upload')) {
      // Mock your backend upload response
      return Promise.resolve({
        json: () => Promise.resolve({ url: 'https://example.com/uploaded-image.jpg' })
      });
    }

    return Promise.reject(new Error('Unhandled fetch URL: ' + url));
  });
});


afterEach(() => {
  global.fetch.mockClear();
});

describe('ImageSelector Component', () => {
  test('renders gallery mode and displays fetched images', async () => {
    const onImageSelectMock = jest.fn();

    render(
      <ImageSelector 
        category="WEDDING" 
        vibeKeywords="romantic" 
        onImageSelect={onImageSelectMock} 
      />
    );

    // Check for the "Choose from Gallery" button.
    expect(screen.getByText(/choose from gallery/i)).toBeInTheDocument();

    // Wait for the mock images to be rendered via their alt text.
    await waitFor(() => {
      expect(screen.getByAltText(/Test Image 1/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Test Image 2/i)).toBeInTheDocument();
    });
  });

  test('calls onImageSelect with the correct URL when an image is clicked', async () => {
    const onImageSelectMock = jest.fn();

    render(
      <ImageSelector 
        category="WEDDING" 
        vibeKeywords="romantic" 
        onImageSelect={onImageSelectMock} 
      />
    );

    // Wait for at least one image to be rendered
    await waitFor(() => screen.getByAltText(/Test Image 1/i));

    // Simulate clicking on the first image
    const image = screen.getByAltText(/Test Image 1/i);
    fireEvent.click(image);

    // Expect the onImageSelect to have been called with the "regular" URL from the mock data
    expect(onImageSelectMock).toHaveBeenCalledWith('https://example.com/img1-regular.jpg');
  });

  test('renders upload mode and calls onImageSelect when a file is selected', async () => {
    const onImageSelectMock = jest.fn();

    render(
      <ImageSelector 
        category="WEDDING" 
        vibeKeywords="romantic" 
        onImageSelect={onImageSelectMock} 
      />
    );

    // Switch to "upload" mode by clicking the "Upload Your Own" button
    const uploadButton = screen.getByText(/upload your own/i);
    fireEvent.click(uploadButton);

    // Expect the file input to be in the document
    const fileInput = document.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();

    // Create a dummy file for testing upload
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the onImageSelect callback to be called
    await waitFor(() => {
      expect(onImageSelectMock).toHaveBeenCalled();
    });
  });
});

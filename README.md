# Real-Time Image Annotation Tool 🎨✨

[![Node.js](https://img.shields.io/badge/node.js-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Screenshot Alt Text
- **Home Page**: A dark-themed interface with a list of images and options to upload, view, annotate, and export images.
- **Image Detail Page**: An image displayed in a glassmorphic card with annotation tools and a history section.

## Features
- Real-time collaborative image annotation for designers, artists, and project managers.
- Upload new images for annotation.
- Update annotations on an image in real-time.
- Retrieve annotation history for specific images.
- Export annotated images as downloadable files.

## Quick Start

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/real-time-image-annotation.git
    cd real-time-image-annotation
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## API Documentation

### GET /api/images
- **Purpose**: Retrieve list of images for annotation.
- **Response**:
    ```json
    {
        "success": true,
        "data": [
            {
                "id": "1",
                "url": "https://example.com/image1.jpg",
                "annotations": [
                    {
                        "user": "user1",
                        "timestamp": "2023-04-01T12:00:00Z",
                        "data": { /* annotation data */ }
                    }
                ]
            },
            // more images
        ]
    }
    ```

### POST /api/images/upload
- **Purpose**: Upload a new image for annotation.
- **Request Body**:
    ```json
    {
        "url": "https://example.com/new-image.jpg"
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "data": {
            "id": "2",
            "url": "https://example.com/new-image.jpg",
            "annotations": []
        }
    }
    ```

### PATCH /api/images/:id/annotate
- **Purpose**: Update annotations on an image in real-time.
- **Request Body**:
    ```json
    {
        "user": "user2",
        "data": { /* new annotation data */ }
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "data": {
            "id": "1",
            "url": "https://example.com/image1.jpg",
            "annotations": [
                // updated annotations
            ]
        }
    }
    ```

### GET /api/images/:id/history
- **Purpose**: Retrieve annotation history for a specific image.
- **Response**:
    ```json
    {
        "success": true,
        "data": [
            {
                "id": "1",
                "imageData": "base64-encoded-image-data",
                "timestamp": "2023-04-01T12:00:00Z"
            },
            // more versions
        ]
    }
    ```

### POST /api/images/:id/export
- **Purpose**: Export annotated image.
- **Response**:
    - Downloadable file.

## Tech Stack

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: HTML, CSS (Inter font), JavaScript (ES6+)
- **Styling**: Dark theme with glassmorphism and animations
- **Storage**: In-memory data structure for simplicity

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
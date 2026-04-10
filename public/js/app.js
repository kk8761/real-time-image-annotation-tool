// app.js

document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://' + window.location.host);
    let currentImageId = null;
    let annotations = [];

    const imageContainer = document.getElementById('image-container');
    const annotationForm = document.getElementById('annotation-form');
    const annotationInput = document.getElementById('annotation-input');
    const exportButton = document.getElementById('export-button');

    socket.onopen = () => {
        console.log('Connected to server');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.imageId === currentImageId) {
            annotations = data.annotations;
            renderAnnotations();
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('Disconnected from server');
    };

    function uploadImage() {
        const fileInput = document.getElementById('image-upload');
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('url', URL.createObjectURL(file));

        fetch('/api/images/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            currentImageId = data.id;
            annotations = [];
            renderAnnotations();
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
    }

    function addAnnotation() {
        const user = 'User';
        const timestamp = new Date().toISOString();
        const data = annotationInput.value.trim();

        if (!data) return;

        annotations.push({ user, timestamp, data });

        socket.send(JSON.stringify({
            method: 'PATCH',
            path: `/api/images/${currentImageId}/annotate`,
            body: { annotations }
        }));

        annotationInput.value = '';
    }

    function renderAnnotations() {
        imageContainer.innerHTML = `<img src="${images.find(img => img.id === currentImageId).url}" alt="Annotation Image">`;
        const annotationsList = document.createElement('ul');
        annotations.forEach(annotation => {
            const li = document.createElement('li');
            li.textContent = `${annotation.user} - ${annotation.timestamp}: ${annotation.data}`;
            annotationsList.appendChild(li);
        });
        imageContainer.appendChild(annotationsList);
    }

    function exportImage() {
        if (!currentImageId) return;

        fetch(`/api/images/${currentImageId}/export`, {
            method: 'POST'
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image_${currentImageId}.png`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error exporting image:', error);
        });
    }

    annotationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addAnnotation();
    });

    exportButton.addEventListener('click', () => {
        exportImage();
    });

    document.getElementById('upload-button').addEventListener('click', uploadImage);
});
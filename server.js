const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let images = [];

app.get('/api/images', (req, res) => {
    try {
        res.status(200).json({ success: true, data: images });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/api/images/upload', (req, res) => {
    try {
        const { url } = req.body;
        if (!url) throw new Error('URL is required');
        images.push({ id: Date.now(), url, annotations: [] });
        res.status(201).json({ success: true, data: images[images.length - 1] });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.patch('/api/images/:id/annotate', (req, res) => {
    try {
        const { id } = req.params;
        const { user, data } = req.body;
        if (!user || !data) throw new Error('User and data are required');
        const image = images.find(img => img.id === parseInt(id));
        if (!image) throw new Error('Image not found');
        image.annotations.push({ user, timestamp: new Date(), data });
        res.status(200).json({ success: true, data: image });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/images/:id/history', (req, res) => {
    try {
        const { id } = req.params;
        const image = images.find(img => img.id === parseInt(id));
        if (!image) throw new Error('Image not found');
        res.status(200).json({ success: true, data: image.annotations });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/images/:id/export', (req, res) => {
    try {
        const { id } = req.params;
        const image = images.find(img => img.id === parseInt(id));
        if (!image) throw new Error('Image not found');
        // Simulate exporting the image
        res.status(200).json({ success: true, data: image.url });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.use(express.static('public'));

const wss = new WebSocket.Server({ server: app });

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'annotation') {
            images.forEach(img => {
                if (img.id === parseInt(data.imageId)) {
                    img.annotations.push({
                        user: data.user,
                        timestamp: new Date(),
                        data: data.data
                    });
                }
            });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'annotation', imageId: data.imageId, annotation: data.annotation }));
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
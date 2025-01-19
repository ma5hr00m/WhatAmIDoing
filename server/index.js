const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

let applicationValue = "Hello";
let lastUpdateTimestamp = null;

app.post('/status/update', (req, res) => {
    const { application, timestamp } = req.body;
    if (application !== undefined && timestamp !== undefined) {
        applicationValue = application;
        lastUpdateTimestamp = new Date(timestamp);
        return res.status(200).json({ message: 'Application value updated successfully.' });
    }
    return res.status(400).json({ error: 'Application and timestamp keys are required.' });
});

app.get('/status/', (req, res) => {
    const currentTime = new Date();
    let timeDifference = null;

    if (lastUpdateTimestamp) {
        const diffInSeconds = Math.floor((currentTime - lastUpdateTimestamp) / 1000);
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        timeDifference = `${hours}h ${minutes}m ${seconds}s`;
    }

    return res.status(200).json({
        application: applicationValue,
        lastUpdateTime: timeDifference || 'Never updated'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

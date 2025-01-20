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
let appInfoMap = new Map([
    ['msedge', {
        'name': 'Edge',
        'description': '网上冲浪~',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
    ['Code', {
        'name': 'VSCode',
        'description': '敲代码中',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
    ['devenv', {
        'name': 'Visual Studio',
        'description': '敲代码中',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
    ['WeChat', {
        'name': '微信',
        'description': '聊天~',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
    ['QQ', {
        'name': 'QQ',
        'description': '聊天~',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
    ['*', {
        'name': '未知',
        'description': '鼓捣些新奇玩意儿',
        'icon': 'https://img.ma5hr00m.top/2025/avatar.jpg',
    }],
]);

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
    try {
        const currentTime = new Date();
        let timeDifference = null;

        if (lastUpdateTimestamp) {
            const diffInSeconds = Math.floor((currentTime - lastUpdateTimestamp) / 1000);
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;
            timeDifference = `${hours}h ${minutes}m ${seconds}s`;
        }

        const appInfo = appInfoMap.get(applicationValue) || appInfoMap.get('*');

        return res.status(200).json({
            message: "OK",
            code: "1",
            data: {
                application: applicationValue,
                lastUpdateTime: timeDifference || 'Never updated',
                appInfo: appInfo
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/settings/appinfomap/update', (req, res) => {
    const newAppInfoMap = req.body;

    if (typeof newAppInfoMap !== 'object' || newAppInfoMap === null) {
        return res.status(400).json({ error: 'Invalid format: Expected an object.' });
    }

    for (const [key, value] of Object.entries(newAppInfoMap)) {
        if (typeof key !== 'string' || !key) {
            return res.status(400).json({ error: 'Invalid format: Keys must be non-empty strings.' });
        }
        if (typeof value !== 'object' || value === null || !value.name || !value.description || !value.icon) {
            return res.status(400).json({ error: 'Invalid format: Each value must be an object with non-empty name, description, and icon.' });
        }
    }

    appInfoMap = new Map(Object.entries(newAppInfoMap));
    return res.status(200).json({ message: 'appInfoMap updated successfully.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

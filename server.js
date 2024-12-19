const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
const leaderboardFile = path.join(__dirname, 'leaderboard.json');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Get leaderboard data
app.get('/leaderboard', (req, res) => {
    if (fs.existsSync(leaderboardFile)) {
        const data = fs.readFileSync(leaderboardFile, 'utf-8');
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

// Save leaderboard data
app.post('/leaderboard', (req, res) => {
    const { name, score } = req.body;
    let leaderboard = [];

    // Read the existing leaderboard from file
    if (fs.existsSync(leaderboardFile)) {
        leaderboard = JSON.parse(fs.readFileSync(leaderboardFile, 'utf-8'));
    }

    // Check if the user is already in the leaderboard
    const existingUserIndex = leaderboard.findIndex(entry => entry.name === name);
    if (existingUserIndex !== -1) {
        // If user exists, update their score
        leaderboard[existingUserIndex].score += 1;
    } else {
        // If user doesn't exist, add them with the current score
        leaderboard.push({ name, score });
    }

    // Save updated leaderboard to file
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard, null, 2));
    res.json({ message: 'Leaderboard updated successfully!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// File: src/modules/faculty/controllers/facultyStellaController.js
// Serves MUJ Stella faculty data (photo, phone, linkedin, etc.) matched by email

const path = require('path');
const fs = require('fs');

// Cache the faculty data in memory on first load
let stellaCache = null;
let stellaByEmail = null;

function loadStellaData() {
    if (stellaCache) return;
    try {
        const dataPath = path.join(__dirname, '../../../data/muj_faculty_data.json');
        stellaCache = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        stellaByEmail = {};
        stellaCache.forEach(f => {
            if (f.email) {
                stellaByEmail[f.email.toLowerCase().trim()] = f;
            }
        });
        console.log(`📋 Loaded ${stellaCache.length} MUJ Stella faculty profiles (${Object.keys(stellaByEmail).length} with email)`);
    } catch (err) {
        console.error('❌ Failed to load MUJ Stella data:', err.message);
        stellaCache = [];
        stellaByEmail = {};
    }
}

/**
 * Look up a faculty member's MUJ Stella profile by email
 * Returns the full stella profile or null
 */
function findByEmail(email) {
    loadStellaData();
    if (!email) return null;
    return stellaByEmail[email.toLowerCase().trim()] || null;
}

/**
 * GET /api/faculty/stella-profile/:email
 * Returns stella profile data for a given faculty email
 */
exports.getStellaProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const profile = findByEmail(email);

        if (!profile) {
            return res.status(200).json({ found: false, stellaProfile: null });
        }

        res.status(200).json({
            found: true,
            stellaProfile: {
                name: profile.name,
                designation: profile.designation,
                department: profile.department,
                email: profile.email,
                phone: profile.phone,
                photo_url: profile.photo_url,
                detail_url: profile.detail_url,
                linkedin: profile.linkedin
            }
        });
    } catch (error) {
        console.error('Stella profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Export the lookup function for use in authController
exports.findByEmail = findByEmail;

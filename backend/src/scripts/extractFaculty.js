/**
 * Extract Faculty Data from MUJ Stella website
 * Downloads the JS bundle and extracts embedded faculty JSON data.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function main() {
    try {
        console.log('Fetching MUJ Stella main page...');
        const html = await fetchUrl('https://www.mujstella.in/');

        const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (!jsMatch) { console.error('No JS bundle found'); return; }

        const jsUrl = `https://www.mujstella.in${jsMatch[1]}`;
        console.log(`Fetching JS bundle...`);
        const jsContent = await fetchUrl(jsUrl);
        console.log(`Bundle size: ${(jsContent.length / 1024 / 1024).toFixed(2)} MB`);

        // Find the faculty data - it starts inside JSON.parse('...')
        const startMarker = '{"name":"Dr Madhura Yadav"';
        const pos = jsContent.indexOf(startMarker);
        if (pos === -1) { console.error('Faculty marker not found'); return; }
        console.log(`Found faculty data at position ${pos}`);

        // Go backwards to find the opening [
        let openBracket = pos;
        while (openBracket > 0 && jsContent[openBracket] !== '[') openBracket--;

        // Check if we're inside JSON.parse('...')
        const prefix = jsContent.substring(Math.max(0, openBracket - 20), openBracket);
        const isInJsonParse = prefix.includes("JSON.parse('") || prefix.includes("parse('");
        console.log(`In JSON.parse: ${isInJsonParse}`);
        console.log(`Prefix: ${JSON.stringify(prefix)}`);

        // Scan forward to find the end of the array
        // We need to handle being inside a JSON.parse('...') string
        // In this case, we look for ]') as the closing

        let jsonStr;
        if (isInJsonParse) {
            // We're inside JSON.parse('[...]')
            // The content starts at openBracket and ends at the ']' before ')  
            // But we need to handle the escaping properly
            // Scan until we find ]' followed by )
            let i = openBracket + 1;
            let depth = 1;
            while (i < jsContent.length && depth > 0) {
                if (jsContent[i] === '\\' && jsContent[i + 1] === '\\') {
                    i += 2; // skip escaped backslash
                    continue;
                }
                if (jsContent[i] === '\\' && (jsContent[i + 1] === "'" || jsContent[i + 1] === '"')) {
                    i += 2; // skip escaped quote
                    continue;
                }
                // Check for end: ]')
                if (jsContent[i] === ']' && jsContent[i + 1] === "'" && jsContent[i + 2] === ')') {
                    jsonStr = jsContent.substring(openBracket, i + 1);
                    break;
                }
                i++;
            }
        }

        if (!jsonStr) {
            // Try direct bracket matching
            let depth = 0;
            let endIdx = openBracket;
            for (let i = openBracket; i < jsContent.length; i++) {
                if (jsContent[i] === '[') depth++;
                if (jsContent[i] === ']') {
                    depth--;
                    if (depth === 0) { endIdx = i; break; }
                }
            }
            jsonStr = jsContent.substring(openBracket, endIdx + 1);
        }

        console.log(`Extracted ${jsonStr.length} chars`);

        // The string contains \\t sequences (escaped tab in JS source)
        // Replace \\t with space or nothing
        jsonStr = jsonStr.replace(/\\\\t/g, '');

        // Also handle any other common escape issues
        // Replace \\' with ' (shouldn't be in JSON but might appear)
        jsonStr = jsonStr.replace(/\\'/g, "'");

        try {
            const facultyData = JSON.parse(jsonStr);
            saveFacultyData(facultyData);
        } catch (e) {
            console.error('Parse error:', e.message);

            // Try to show context around error
            const posMatch = e.message.match(/position (\d+)/);
            if (posMatch) {
                const errPos = parseInt(posMatch[1]);
                console.log(`\nContext at error pos ${errPos}:`);
                console.log(JSON.stringify(jsonStr.substring(Math.max(0, errPos - 100), errPos + 100)));
            }

            // Save debug
            const dataDir = path.join(__dirname, '..', 'data');
            fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(path.join(dataDir, 'faculty_debug.txt'), jsonStr.substring(0, 3000));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

function saveFacultyData(facultyData) {
    console.log(`\nSuccessfully extracted ${facultyData.length} faculty members!\n`);

    const dataDir = path.join(__dirname, '..', 'data');
    fs.mkdirSync(dataDir, { recursive: true });

    const cleanedData = facultyData.map(f => ({
        name: (f.name || '').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim(),
        designation: (f.designation || '').replace(/\s+/g, ' ').trim(),
        department: (f.department || '').trim(),
        email: (f.email || '').trim(),
        phone: (f.phone || '').trim(),
        photo_url: (f.photo_url || '').trim(),
        detail_url: (f.detail_url || '').trim(),
        linkedin: (f.linkedin || '').replace(/\t/g, '').replace(/\s+/g, ' ').trim()
    }));

    // Save JSON
    const jsonPath = path.join(dataDir, 'muj_faculty_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf-8');
    console.log(`Saved JSON: ${jsonPath}`);

    // Save CSV
    const csvPath = path.join(dataDir, 'muj_faculty_data.csv');
    const esc = (s) => `"${(s || '').replace(/"/g, '""')}"`;
    const csvLines = ['Name,Designation,Department,Email,Phone,Photo URL,Detail URL,LinkedIn'];
    cleanedData.forEach(f => {
        csvLines.push([esc(f.name), esc(f.designation), esc(f.department), esc(f.email), esc(f.phone), esc(f.photo_url), esc(f.detail_url), esc(f.linkedin)].join(','));
    });
    fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
    console.log(`Saved CSV: ${csvPath}`);

    // Summary
    const depts = {};
    cleanedData.forEach(f => { depts[f.department || 'Unknown'] = (depts[f.department || 'Unknown'] || 0) + 1; });

    console.log(`\nDepartments:`);
    Object.entries(depts).sort((a, b) => b[1] - a[1]).forEach(([d, c]) => console.log(`  ${d}: ${c}`));

    console.log(`\nStats:`);
    console.log(`  Total: ${cleanedData.length}`);
    console.log(`  With email: ${cleanedData.filter(f => f.email).length}`);
    console.log(`  With phone: ${cleanedData.filter(f => f.phone && f.phone.length > 3).length}`);
    console.log(`  With LinkedIn: ${cleanedData.filter(f => f.linkedin).length}`);

    console.log('\nFirst 5:');
    cleanedData.slice(0, 5).forEach((f, i) => {
        console.log(`  ${i + 1}. ${f.name} | ${f.designation}`);
        console.log(`     ${f.department} | ${f.email || 'N/A'}`);
    });
}

main();

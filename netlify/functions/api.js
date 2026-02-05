const fs = require('fs');
const path = require('path');

// NOTE: In a real Netlify production environment, this file path is read-only or ephemeral.
// For a college project running locally ('netlify dev'), this works perfectly.
// For live persistence without a database, you would typically use an external API (Google Sheets/Airtable).
const DATA_FILE = path.resolve(__dirname, '../../registrations.csv');

exports.handler = async (event, context) => {

    // --- POST: Handle New Registration ---
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);

            // Clean data to prevent CSV injection
            const clean = (str) => String(str).replace(/,/g, ' ').replace(/\n/g, ' ');

            const csvLine = `\n${clean(data.name)},${clean(data.college)},${clean(data.dept)},${clean(data.year)},${clean(data.email)},${clean(data.mobile)},${clean(data.gender)},${clean(data.events)}`;

            // Append to file
            // Note: On Netlify Live, this only writes to the ephemeral lambda instance.
            // It will disappear after the function goes cold. Works fine on Localhost.
            fs.appendFileSync(DATA_FILE, csvLine);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Saved" })
            };
        } catch (error) {
            return { statusCode: 500, body: "Error writing data" };
        }
    }

    // --- GET: Fetch Participants ---
    if (event.httpMethod === 'GET') {
        try {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
            const lines = fileContent.trim().split('\n');
            const headers = lines[0].split(',');

            const participants = lines.slice(1).map(line => {
                const values = line.split(',');
                // CSV Columns: Name(0), College(1), Dept(2), Year(3), Email(4), Mobile(5), Gender(6), Events(7)
                // Returning ALL data as requested (Admin View protected by Client-Side Password)
                return {
                    name: values[0],
                    college: values[1],
                    dept: values[2],
                    year: values[3],
                    email: values[4],
                    mobile: values[5],
                    gender: values[6],
                    events: values[7]
                };
            });

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(participants)
            };
        } catch (error) {
            return { statusCode: 500, body: "Error reading data" };
        }
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
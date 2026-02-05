const SUPABASE_URL = "https://bruskkdetbatigteudqr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydXNra2RldGJhdGlndGV1ZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTc0MTYsImV4cCI6MjA4NTg3MzQxNn0.hQNQjfGkU-ueCzmg8jiJeLAWjzlbfiAzzW5zhDzLXNw";

exports.handler = async (event, context) => {

    // --- POST: Handle New Registration ---
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);

            const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: data.name,
                    college: data.college,
                    dept: data.dept,
                    year: data.year,
                    email: data.email,
                    mobile: data.mobile,
                    gender: data.gender,
                    events: data.events
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Supabase Error:", error);
                throw new Error("Failed to save to Supabase");
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Saved Successfully" })
            };
        } catch (error) {
            console.error("Function Error:", error);
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    // --- GET: Fetch Participants ---
    if (event.httpMethod === 'GET') {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?select=*`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to fetch from Supabase");

            const participants = await response.json();

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(participants)
            };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
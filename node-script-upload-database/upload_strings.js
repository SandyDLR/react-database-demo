const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const axios = require('axios');

// Get Transifex API token from environment variable
const TX_API_TOKEN = process.env.TRANSIFEX_API_TOKEN_REACT_DATABASE_DEMO;
if (!TX_API_TOKEN) {
    console.error('Error: TRANSIFEX_API_TOKEN_REACT_DATABASE_DEMO environment variable is not set.');
    process.exit(1);
}

// Transifex API Configuration
const TX_RESOURCE_ID = 'o:sandydlr:p:react-database:r:react-database'; // Replace with your resource ID from Transifex

// SQLite Database File Path
const db = new sqlite3.Database('../server/questions.db'); // Adjust as needed

// Fetch strings from the database
db.all('SELECT id, question FROM questions', [], async (err, rows) => {
    if (err) {
        console.error('Error fetching questions:', err.message);
        return;
    }

    const transifexStrings = rows.map((row) => ({
        type: 'resource_strings',
        attributes: {
            key: `${row.id}.question`, // Identifier for Transifex
            strings: {
                other: row.question, // Source string
            },
            context: 'from database', // Generic context
        },
        relationships: {
            resource: {
                data: {
                    type: 'resources',
                    id: TX_RESOURCE_ID, // Resource ID in Transifex
                },
            },
        },
    }));

    // Write the strings to a JSON file for backup (optional)
    fs.writeFileSync('strings_to_upload.json', JSON.stringify(transifexStrings, null, 2));
    console.log('Strings exported to strings_to_upload.json');

    // Prepare Transifex API Payload
    const payload = {
        data: transifexStrings,
    };

    try {
        // Push strings to Transifex
        const response = await axios.post(
            'https://rest.api.transifex.com/resource_strings',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${TX_API_TOKEN}`,
                    'Content-Type': 'application/vnd.api+json;profile="bulk"',
                    Accept: 'application/vnd.api+json',
                },
            }
        );

        console.log('Strings successfully uploaded to Transifex:', response.data);
    } catch (error) {
        console.error(
            'Error uploading strings to Transifex:',
            error.response?.data || error.message
        );
    }
});

// Close the database connection
db.close();

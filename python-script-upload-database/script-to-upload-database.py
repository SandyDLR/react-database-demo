import json
import requests
import os

# Define constants for API endpoint and headers
API_URL = "https://rest.api.transifex.com/resource_strings"
BEARER_TOKEN = os.getenv("TRANSIFEX_API_TOKEN_REACT_DATABASE_DEMO")  # Retrieve the token from environment variables
if not BEARER_TOKEN:
    raise ValueError("The API token is not set. Please set the 'TRANSIFEX_API_TOKEN_REACT_DATABASE_DEMO' environment variable.")

HEADERS = {
    "accept": "application/vnd.api+json",
    "authorization": f"Bearer {BEARER_TOKEN}",
    "content-type": 'application/vnd.api+json;profile="bulk"'
}

# Define the resource ID (update this to match your resource)
RESOURCE_ID = "o:sandydlr:p:react-database:r:react-database"

# Load the JSON file
json_file_path = "questions.json"  # Update with your JSON file path
with open(json_file_path, "r") as file:
    data = json.load(file)

# Prepare the payload
payload = {
    "data": []  # This will hold all the strings to upload
}

# Add each string as an item in the "data" array
for entry in data:
    payload["data"].append({
        "attributes": {
            "strings": {
                "other": entry["question"]
            },
            "key": f"{entry['id']}.question",
            "context": "questions"
        },
        "relationships": {
            "resource": {
                "data": {
                    "type": "resources",
                    "id": RESOURCE_ID
                }
            }
        },
        "type": "resource_strings"
    })

# Send the payload to the Transifex API
response = requests.post(API_URL, headers=HEADERS, json=payload)

# Print the response from the server
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

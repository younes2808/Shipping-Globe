import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request

app = Flask(__name__)

# Function to generate URL for the search page based on MMSI
def generate_search_url(mmsi):
    return f"https://www.marinevesseltraffic.com/2013/06/imo-number-search.html?imo={mmsi}"

# Function to scrape vessel info from the final redirected page
def scrape_vessel_info(url):
    # Send GET request to the URL (after redirection)
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the <div> with the ship history info by its ID
        ship_history_div = soup.find("div", id="ship-history-info")

        # Extract vessel information from the div attributes
        if ship_history_div:
            vessel_info = {
                "Name": ship_history_div.get("data-name", "Not found"),
                "IMO": ship_history_div.get("data-imo", "Not found"),
                "MMSI": ship_history_div.get("data-mmsi", "Not found"),
                "Flag": ship_history_div.get("data-flag-code", "Not found"),
                "Country": ship_history_div.get("data-country", "Not found"),
                "Company": ship_history_div.get("data-company", "Not found")
            }
            return vessel_info
        else:
            return {"error": "Ship history info not found on the page."}
    else:
        return {"error": f"Error: {response.status_code}"}

@app.route('/get_vessel_info', methods=['POST'])
def get_vessel_info():
    # Get the MMSI from the request
    data = request.json
    mmsi_number = data.get('mmsi', None)

    if not mmsi_number:
        return jsonify({"error": "MMSI number is required."}), 400

    # Step 1: Generate the search URL with the MMSI number
    search_url = generate_search_url(mmsi_number)

    # Step 2: Make a request to the search URL
    response = requests.get(search_url)

    # Step 3: Follow the redirection and scrape the final page
    if response.status_code == 200:
        final_url = response.url  # This will give you the final redirected URL
        vessel_info = scrape_vessel_info(final_url)
        return jsonify(vessel_info)
    else:
        return jsonify({"error": f"Error: {response.status_code}"}), 400

if __name__ == '__main__':
    app.run(debug=True)

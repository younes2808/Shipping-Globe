import WebSocket from "ws";
import fs from "fs";  // To write the JSON file

const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

// Replace process.env.AISSTREAM_API_KEY with your actual API key
const API_KEY = "";

// To store the ship position data
let shipPositions = [];
let messageCount = 0;  // To keep track of the number of messages received
const maxMessages = 2000;  // Stop after 500 messages

socket.addEventListener("open", () => {
  const subscriptionMessage = {
    APIkey: API_KEY,
    BoundingBoxes: [
      // Atlantic Ocean
      [[-80, -40], [-20, 40]],
      // Pacific Ocean (North)
      [[120, -10], [180, 60]],
      // Pacific Ocean (South)
      [[-180, -60], [-80, 0]],
      // Indian Ocean
      [[20, -40], [120, 30]],
      // Southern Ocean
      [[-180, -90], [180, -60]],
    ],
  };
  console.log("Sending subscription message...");
  socket.send(JSON.stringify(subscriptionMessage));
});

socket.addEventListener("error", (event) => {
  console.log("WebSocket error:", event);
});

socket.addEventListener("message", (event) => {
  let aisMessage = JSON.parse(event.data);

  // Check if the message type is a Position Report
  if (aisMessage["MessageType"] === "PositionReport") {
    let positionReport = aisMessage["Message"]["PositionReport"];

    // Log the ship position
    console.log(
      `ShipId: ${positionReport["UserID"]} Latitude: ${positionReport["Latitude"]} Longitude: ${positionReport["Longitude"]}`
    );

    // Store the position in the array
    shipPositions.push({
      ShipId: positionReport["UserID"],
      Latitude: positionReport["Latitude"],
      Longitude: positionReport["Longitude"]
    });

    messageCount++;

    // Check if 500 messages have been received
    if (messageCount >= maxMessages) {
      console.log("Received 500 messages. Stopping the WebSocket connection.");

      // Close the WebSocket connection
      socket.close();

      // Save the ship positions data to a JSON file
      fs.writeFile("ship_positions.json", JSON.stringify(shipPositions, null, 2), (err) => {
        if (err) {
          console.error("Error saving data to file:", err);
        } else {
          console.log("Data saved to ship_positions.json");
        }
      });
    }
  }
});

import WebSocket from "ws";

const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

// Replace process.env.AISSTREAM_API_KEY with your actual API key
const API_KEY = "9ae7ab0f44f03c778ea82454b5887ae3c115c14f";

socket.addEventListener("open", () => {
  const subscriptionMessage = {
    APIkey: API_KEY,
    BoundingBoxes: [
    // Bounding Box from 180°W to 120°W (Ocean region)
[[-180, -90], [-120, 90]]
      // Atlantic Ocean
    //[[-80, -40], [-20, 40]],
    // Pacific Ocean (North)
    //[[120, -10], [180, 60]],
    // Pacific Ocean (South)
    //[[-180, -60], [-80, 0]],
    // Indian Ocean
    //[[20, -40], [120, 30]],
    // Southern Ocean
    //[[-180, -90], [180, -60]],
    ],
  };
  console.log(JSON.stringify(subscriptionMessage));
  socket.send(JSON.stringify(subscriptionMessage));
});

socket.addEventListener("error", (event) => {
  console.log(event);
});

socket.addEventListener("message", (event) => {
  let aisMessage = JSON.parse(event.data);
  if (aisMessage["MessageType"] === "PositionReport") {
    let positionReport = aisMessage["Message"]["PositionReport"];
    console.log(
      `ShipId: ${positionReport["UserID"]} Latitude: ${positionReport["Latitude"]} Longitude: ${positionReport["Longitude"]}`
    );
  }
});

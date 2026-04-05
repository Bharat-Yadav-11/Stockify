const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./db/dbconn.js');

const Watchlist = require('./models/Watchlist.js');
const Scrip = require('./models/Scrip.js');
const routes = require('./routes/routes.js');
const WebSocket = require("ws");

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome to MarketPulse APIs');
});

// WEBSOCKET SERVER 
const WebSocketServer = new WebSocket.Server({ server: server });

WebSocketServer.on('connection', function connection(ws, req) {
  ws.on('message', async function message(data, isBinary) {
    try {
      const payload = JSON.parse(data.toString());
      const userId = payload.userId || payload;
      console.log("WS User Connected: ", userId);

      for await (const client of WebSocketServer.clients) {
        if (client == ws) {
          client.userId = userId;
        }
        if (client == ws && client.readyState === WebSocket.OPEN) {
          const userWatchlist = await Watchlist.find({ userId: client.userId?.userId || client.userId }).populate("scriptId");

          let resp = {
            active: WebSocketServer.clients.size,
            belongs: "connection",
            watchlistSize: userWatchlist.length,
            scrips: userWatchlist
          };
          client.send(JSON.stringify(resp));
        }
      }
    } catch (err) {
      console.error("WS Message Error:", err);
    }
  });

  ws.on('close', () => console.log('Client has disconnected!'));
});

// REAL-TIME PRICE SIMULATOR
const simulateMarket = async () => {
  try {
    const scrips = await Scrip.find();
    
    // Batch update scrips with small random fluctuations
    const updates = scrips.map(scrip => {
      const changePercent = (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
      const newPrice = Math.max(1, scrip.lastPrice * (1 + changePercent / 100)); // Prevent price from going below 1
      const newChange = parseFloat(scrip.percentageChange || 0) + changePercent;

      return Scrip.updateOne(
        { _id: scrip._id },
        { 
          $set: { 
            lastPrice: newPrice.toFixed(2),
            percentageChange: newChange.toFixed(2)
          } 
        }
      );
    });

    await Promise.all(updates);

    // Broadcast updates to all connected clients
    for (const client of WebSocketServer.clients) {
      if (client.readyState === WebSocket.OPEN && client.userId) {
        const userWatchlist = await Watchlist.find({ userId: client.userId?.userId || client.userId }).populate("scriptId");
        client.send(JSON.stringify({
          active: WebSocketServer.clients.size,
          belongs: "update",
          watchlistSize: userWatchlist.length,
          scrips: userWatchlist
        }));
      }
    }
  } catch (err) {
    console.error("Market Simulation Error:", err);
  }
};

// Run simulation every 5 seconds
setInterval(simulateMarket, 5000);

server.listen(port, () => console.log(`Server is running at ${port}`));

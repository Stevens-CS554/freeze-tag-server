const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http);

const port = process.env.PORT || 8080;
const freezeTag = io.of("/freeze-tag");
const players = {};

app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/current-users", (req, res) => {
  res.json(Object.values(players).filter(x => x));
});

freezeTag.on("connection", socket => {
  let socketPlayer = null;

  socket.on("join", player => {
    freezeTag.emit("player-joined", player);
    players[player.id] = player;
    socketPlayer = player;
  });

  socket.on("disconnect", () => {
    if (socketPlayer) {
      freezeTag.emit("player-left", socketPlayer);
      players[socketPlayer.id] = null;
    }
  });
});

http.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

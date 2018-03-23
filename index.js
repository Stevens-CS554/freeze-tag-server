const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http);

const port = process.env.PORT || 8080;
const freezeTag = io.of("/freeze-tag");
const players = {};

const positions = {
  1: [false, false, false, false, false, false, false, false, false, false],
  2: [false, false, false, false, false, false, false, false, false, false],
  3: [false, false, false, false, false, false, false, false, false, false],
  4: [false, false, false, false, false, false, false, false, false, false],
  5: [false, false, false, false, false, false, false, false, false, false],
  6: [false, false, false, false, false, false, false, false, false, false],
  7: [false, false, false, false, false, false, false, false, false, false],
  8: [false, false, false, false, false, false, false, false, false, false],
  9: [false, false, false, false, false, false, false, false, false, false],
  10: [false, false, false, false, false, false, false, false, false, false]
};

const getRandomPosition = () => Math.ceil(Math.random() * 10);

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
    const x = getRandomPosition();
    const y = getRandomPosition();

    player.x = x;
    player.y = y;

    socketPlayer = player;

    players[player.id] = player;

    freezeTag.emit("player-joined", player);
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

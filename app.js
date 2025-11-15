import http from "http";
import { WebSocketServer } from "ws";

const server = http.createServer();
server.listen(8080, "0.0.0.0", () =>
  console.log("Servidor listo en puerto 8080")
);

const wss = new WebSocketServer({ server });

function broadcast(msg) {
  for (const c of wss.clients) {
    if (c.readyState === 1) c.send(msg);
  }
}

wss.on("connection", (socket) => {
  socket.nickname = "Anon-" + Math.floor(Math.random() * 1000);

  socket.send("Bienvenido al chat!");

  broadcast(`${socket.nickname} se conectó`);

  socket.on("message", (raw) => {
    const msg = raw.toString();

    if (msg.startsWith("JOIN:")) {
      const name = msg.replace("JOIN:", "").trim();
      const old = socket.nickname;
      socket.nickname = name || old;
      broadcast(`${old} ahora se llama ${socket.nickname}`);
      return;
    }

    broadcast(`${socket.nickname}: ${msg}`);
  });

  socket.on("close", () => {
    broadcast(`${socket.nickname} se desconectó`);
  });
});

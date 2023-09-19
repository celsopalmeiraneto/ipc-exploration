import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { error, log } from "./util.mjs";

const SOCKET_FILE = "/tmp/ipc-exploration.sock";

const handleConnection = (connection) => {
  log("Client connected");
  connection.on("end", () => {
    log("Connection ended");
  });

  connection.on("data", (data) => {
    log(data.toString());
  });
}

const bootServer = async () => {
  const server = createServer((connection) => {
    handleConnection(connection);
  });

  await new Promise((resolve, reject) => {
    server.listen(SOCKET_FILE, (err, success) => {
      if (err) {
        error("Failed to listen to socket.");
        return reject(err);
      }

      resolve(success);
    });
  });

  return server;
}

const main = async () => {
  const server = await bootServer();

  process.on("SIGINT", () => {
    log('Received SIGINT');
    server.close();
  });

  log("Listening for connections.");

  Array(10).fill(null).forEach(() => {
    const child = spawn(process.argv0, [
      path.join(new URL("sensor.mjs", import.meta.url).pathname),
      SOCKET_FILE,
    ]);
  
    child.stdout.pipe(process.stdin);  
  })
};

main();

import { randomInt } from "node:crypto";
import { createConnection } from "node:net";
import { log, error } from "./util.mjs";

const sleep = (timeToSleepInMs) =>
  new Promise((resolve) => setTimeout(resolve, timeToSleepInMs));

/**
 * This is a fake sensor. It's going to receive as an argument a Unix socket to connect to and send readings.
 */
const main = async () => {
  const [, , socketAddress] = process.argv;

  if (!socketAddress) {
    error("Invalid socket address to connect to.");
    return process.exit(4000);
  }

  const socket = createConnection(socketAddress, () => {
    log("Connected to server on ", socketAddress);
  });

  socket.on("end", () => {
    log("Disconnected from server");
  });

  socket.on("data", (data) => {
    log("Received data: ", data.toString());
  });

  socket.on("error", (err) => {
    error(err);
    process.exit(4010);
  });

  while (true) {
    await sleep(randomInt(1200, 2000));
    const randomReading = randomInt(0, 42);
    socket.write(
      JSON.stringify({ sensor: process.pid, reading: randomReading })
    );
  }
};

main();

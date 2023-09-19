export const log = console.log.bind(this, `PID: ${process.pid}`);
export const error = console.error.bind(this, `PID: ${process.pid}`);

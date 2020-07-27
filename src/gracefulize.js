let inited = false;
let sigintCalledTimes = 0;
let lastSigintCalledTS = 0;

module.exports = function gracefulize(nodeServer, opts) {

  if (inited) {
    return;
  }
  inited = true;

  if (opts == null) {
    opts = {};
  }
  const log = opts.log || console.log;

  process.on('SIGINT', () => {

    lastSigintCalledTS = Date.now();
    sigintCalledTimes++;

    if (sigintCalledTimes === 1) {
      log(`${Date.now()} :: gracefully shutting down Node.js http server`);
      nodeServer.close();
      return;
    }

    if (sigintCalledTimes >= 2) {
      const now = Date.now();
      if (now - lastSigintCalledTS >= 5000) {
        log(`${Date.now()} :: force process exiting...`);
        process.exit(1);
      }
    }

  });

  nodeServer.on('close', () => {
    if (sigintCalledTimes >= 1) {
      if (opts.autoExitProcessAfterHttpServerClosed === true) {
        process.exit();
      }
    }
  });

}

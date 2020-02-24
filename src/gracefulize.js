let inited = false;
let sigintCalledTimes = 0;
let lastSigintCalledTS = 0;

module.exports = function gracefulize(nodeServer) {

  if (inited) {
    return;
  }
  inited = true;

  process.on('SIGINT', () => {

    lastSigintCalledTS = Date.now();
    sigintCalledTimes++;

    if (sigintCalledTimes === 1) {
      console.log('gracefully shutting down Node.js server');
      nodeServer.close();
      return;
    }

    if (sigintCalledTimes >= 2) {
      const now = Date.now();
      if (now - lastSigintCalledTS >= 5000) {
        console.log('force process exiting...');
        process.exit(1);
      }
    }

  });

  nodeServer.on('close', () => {
    if (sigintCalledTimes >= 1) {
      process.exit();
    }
  });

}

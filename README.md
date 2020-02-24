# gracefulize

# Why

Node.js HTTP server objects, once listening on a handle (e.g. a port number),
is expected to take that 'handle resource' for itself until it is closed.

Unless when it doesn't.

If you start a Node.js HTTP server in your `server.js` file, then start it, then
stop it (i.e. with `Ctrl + C`), the HTTP server can be killed together with the
host process (the `server.js` process itself), but sometimes it doesn't cleanly
release the aforementioned 'handle resource'. In my experience, most times it
does, but it's plain annoying when it doesn't.

While there are "scientific" explanations for all this (when it does, and when
not), they are beyond the scope of this document, the purpose of which is to
explain why this module exists & how it should be used.

# How

If you already have done something like this before:
```
let express = require('express');
let myServer = express.listen(3000, () => {
  console.log('server started at port 3000');
});
```

Then you only need to add 1 additional line now:
```
let express = require('express');
let myServer = express.listen(3000, () => {
  console.log('server started at port 3000');
});
// the following line is new
require('gracefulize')(myServer);
```

Please note that the above example uses `ExpressJS`, but it is essentially the same for `Koa` or any other `Node.js-based` HTTP server.

# Do I need this?

- If you have _never_ implemented anything to ensure a graceful shutdown of your Node.js HTTP server for your server app before, then yes
- Otherwise, probably not

const http = require('http');

// config port number running the script as: 
// node example_node_sse_server.js 4000
const port = process.argv[2] || process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(req.url);

  // Server-sent events endpoint
  if (req.url === '/subscribe') {
    // set response
    // header
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // body
    /*
    Example response:
      event: notify\n
      id: 123\n
      data: { "title": "Notification Title",
        "text": "Lorem ipsum.",
        "priority": 2,
        "id": "1345f488-5aaa-4c4b-9076-f3eb12905556",
        "unread": true,
        "time": "Fri, 15 Dec 2017 08:53:12 GMT"
      }\n\n
    */
    let event = 'event: notify';
    let id = `id: ${Date.now()}`;
    let data = `data: ${JSON.stringify({
      'title': 'Notification Title',
      'text': 'A new wonderful task!',
      'priority': 2,
      'id': '1345f488-5aaa-4c4b-9076-f3eb12905556',
      'unread': true,
      'time': 'Fri, 15 Dec 2017 08:53:12 GMT'
    })}`;

    res.end(`${event}\n${id}\n${data}\n\n`);
  }
  if (req.url.indexOf('/notifications') >= 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url.indexOf('/readAll') >= 0) {
      res.end();
    } else if (req.url.indexOf('/read') >= 0) {
      res.end();
    }
  }
});

server.listen(port);

server.on('error', (err) => {
  console.log(err);
  process.exit(1);
});

server.on('listening', () => {
  console.log(`Listening on port ${port}`);
});

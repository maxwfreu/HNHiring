const next = require('next')
const express = require('express')

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const Data = require('./data');

app.prepare().then(() => {
  const server = express()

  // Return the generated file for download
  server.get("/id", function (req, res) {
    // Resolve the file path etc...
    const { id } = req.query;
    if (!id) {
      res.status(400).send('Not found.');
      return;
    }
    const data = Data[id];
    if(!data) {
      res.status(400).send('Not found.');
      return;
    }
    res.json(data);
  });

  server.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname + '/robots.txt'));
    return;
  });

  server.get('/status', (req, res) => {
    res.json({
      status: 'ok',
      env: process.env.NODE_ENV,
    });
    return;
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
});

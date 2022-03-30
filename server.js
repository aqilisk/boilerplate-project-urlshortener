require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns')
const url = require('url')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let data = [
  {
    original_url: 'https://aqilisk-project-headerparser.herokuapp.com/',
    short_url: '1'
  }
]

app.post('/api/shorturl', (req, res) => {
  const host = new url.URL(req.body.url);
  dns.lookup(host.hostname, {}, (err, addr) => {
    console.log(err, addr);
    if (err) return res.json({ error: 'invalid url' });

    const shortId = data.length + 1
    const shortData = {
      original_url: host.href,
      short_url: shortId
    }
  
    data.push(shortData)
    res.json(data[shortId - 1])
  })
})

app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id;
  res.redirect(data[id - 1]['original_url'])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

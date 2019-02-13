const http = require('http');

const interval = Number(process.argv[2]) || 1000;
const timeLimit = Number(process.argv[3]) || 10000;

const getCurrentTime = () => new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');

const server = http.createServer((req, res) => {
  let timeLog = 0;
  function makeTimer () {
    setTimeout(() => {
      timeLog += interval;
      console.log(getCurrentTime());
      if (timeLog < timeLimit) {
        makeTimer();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(getCurrentTime());
      }
    }, interval);
  }

  if (req.url === '/') {
    makeTimer();
  }
});

server.listen(3000);

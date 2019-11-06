const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const request = require('request');
const constants = require('./constants.js');
const app = express();

let targetHost = 'http://www.hsbc.ca/1/PA_ABSL-JSR168/ABSLFCServlet';
let targetParam = '?event=cmd_ajax&cLat=49.243976&cLng=-123.108091&LOCALE=en&rand=123';
let targetHost2 = 'http://demo5051584.mockable.io/getATMInfo'
let port = 9000;
let sslPort = 9443;
let host = '0.0.0.0';
let staticPath = 'static';
let environment = process.env.ENV || "production";
let resetFeature = false;
let privateKeyFile = null;
let publicKeyFile = null;
let caKeyFile = null;
let serverConfig = './server-config/config.json'
let apiKey = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(('/env'), (req, res) => {
  console.log("env:", environment);
  res.send({
    environment: environment,
    resetFeature: resetFeature ,
    apiKey: config.apiKey,
    defaultLat: config.defaultLat,
    defaultLng: config.defaultLng,
  });
});

app.get('/atm-locator', (req,res) => {
  let atmInfo = null;
  console.log("====",req.params);
  //const targetUrl = `${targetHost}{req.parameters}`;
  const targetUrl = `${targetHost}${targetParam}`
  console.log("GET targetUrl:", targetUrl);
  var options = {
    url: targetUrl,
    method: req.method
  };
  request(options, (error,response,body)=> {
       let locations = {};
       JSON.parse(body).results.map(item => {
        if ( item.location.addInfo.institution==="HSBC Bank Canada") {
          locations[item.location.locationId] = item;
        }
       });
      atmStatus(res, locations);
  });
});
const atmStatus = (resp, locations) => {
  let bodyArr = [];
  Object.keys(locations).map(param => {
      bodyArr.push(param);
  });

  const options = {
    url: `${targetHost2}?locations=${bodyArr.join('&')}`,
    method: "GET"
  };
  request(options, (error,response,body)=> {
    let stat;
    const status = JSON.parse(body);
    Object.keys(locations).map(locationKey => {
      if ( (stat=status[locationKey]) ) {
        locations[locationKey].status = stat;
      }
    });
    resp.send(locations);
  });
};
const prepareFormData = (data) => {
  let bodyArr = [];
  Object.keys(data).map(param => {
      bodyArr.push(`${param}=${encodeURIComponent(data[param])}`);
  });
  return bodyArr.join('&');
};

const prepareBody = (bodyObject, headers) => {
  const contentTypeKey = Object.keys(headers).filter(key => (
    key.toLowerCase() == 'content-type'));
  const contentType = contentTypeKey && headers[contentTypeKey[0]];
  return (contentType && contentType.startsWith('application/json')) ?
      JSON.stringify(bodyObject) :
      prepareFormData(bodyObject);

};

processArguments = (args) => {
  for (let j = 0; j < args.length; ) {
    switch(args[j++]) {
      case '--target-host':
        if (j<args.length) {
          targetHost = args[j++];
          if (targetHost.endsWith('/')) {
            targetHost = targetHost.substr(0, targetHost.length-1);
          }
        }
        break;
      case '--port':
        if (j<args.length) {
          let newPort = parseInt(args[j++]);
          port = isNaN(newPort) ? port : newPort;
        }
        break;
      case '--ssl-port':
        if (j<args.length) {
          let newSSLPort = parseInt(args[j++]);
          sslPort = isNaN(newSSLPort) ? sslPort : newSSLPort;
        }
        break;
      case '--host':
        if (j<args.length) {
          host = args[j++];
        }
        break;
      case '--static-path':
        if (j<args.length) {
          staticPath = args[j++];
        }
        break;
      case '--private-key':
        if (j<args.length) {
          privateKeyFile = args[j++];
        }
        break;
      case '--public-key':
        if (j<args.length) {
          publicKeyFile = args[j++];
        }
        break;
      case '--ca-key':
          if (j<args.length) {
            caKeyFile = args[j++];
          }
          break;
      case '--reset-feature':
        resetFeature = true;
        break;
      case '--server-config':
        if (j<args.length) {
          serverConfig = args[j++];
        }
        break;
    }
  }
  console.log(`Environment: \x1b[32m${environment}\x1b[0m`);
  console.log(`Bound to: \x1b[32m${host}:${port}\x1b[0m`);
  console.log(`Target host: \x1b[32m${targetHost}\x1b[0m`);
  console.log(`Static path: \x1b[32m${staticPath}\x1b[0m`);
}

processArguments(process.argv);
app.use(express.static(staticPath));

const httpServer = http.createServer(app);
httpServer.listen(port, host, () => {
    console.log('Listening on port %d...', httpServer.address().port);
});

const configFile = fs.readFileSync(serverConfig, 'utf8');
config = JSON.parse(configFile);

if (privateKeyFile && publicKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, 'utf8');
  const certificate = fs.readFileSync(publicKeyFile, 'utf8');

  const credentials = {key: privateKey, cert: certificate};
  if (caKeyFile) {
    const ca = fs.readFileSync(caKeyFile, 'utf8');
    credentials.ca = ca;
  }
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(sslPort, host, () => {
    console.log('Listening on SSL port %d...', httpsServer.address().port);
  });
}

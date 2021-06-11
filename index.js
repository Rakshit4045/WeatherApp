/* require('dotenv').config(); */
const http = require("http");
const fs = require("fs");
var requests = require("requests");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}))

app.post('/',(req,res)=>{
  let locName = req.body.text;
})


const homeFile = fs.readFileSync("home.html", "utf-8");

//var locName = document.getElementById("location").value;

//var url = "http://api.openweathermap.org/data/2.5/weather?q="+locName+"&appid=3bfb8e35e002451ce1832c4e2f36a195";

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Pune&units&appid=3bfb8e35e002451ce1832c4e2f36a195"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(3000, "127.0.0.1");
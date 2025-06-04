const http = require("http");
const app = require("./app");
const port = process.env.PORT ?? 3000;


const normalizedPort = val => {
    let port = parseInt(val,10);
    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
}


app.set("port",port);




const server = http.createServer(app);


server.listen(port);




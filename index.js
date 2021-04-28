const https = require('https');
const fs = require('fs');

const host = 'css.loc'; // настройка доменного имени
const port = 443; // настройка порта

const options = {
  key: fs.readFileSync('./_ssl/css.loc.key'),
  cert: fs.readFileSync('./_ssl/css.loc.crt')
};

https.createServer(options, function (request, response) {
    // проверка, к нашему ли хосту идёт обращение
    const receivedHost = request.headers.host.split(':')[0];
    // console.log(receivedHost);
    if (receivedHost != host){
        return false;
    }

    // билдим дату + время для консоли
    const time = new Date();
    const readableDate = `${time.getDate()}-${time.getMonth()}-${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    // вывод адреса запрошенного ресурса в консоль
    console.log(`${readableDate} : запрошенный адрес: ${request.url}`);
    
    // получаем путь к файлу после слэша и без get-параметров
    var filePath = request.url.substr(1).split('?')[0];

    // проверка длины пути - может, мы вообще обращаемся к корню?
    if (!filePath.length){
        response.statusCode = 404;
        response.end("Resourse not found!");
        return false;
    }

    // если искомый отсутствует, пытаемся создать, затем отдаём
    if (!fs.existsSync(filePath, fs.constants.R_OK)){
        fs.writeFileSync(filePath, "");
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    fs.createReadStream(filePath).pipe(response);

}).listen(port, host);

console.log('listen');
console.log(`Use https://${host}:${port}/css/*.css !`);
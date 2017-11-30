var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var template = require('./modules/template');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(require('./routes/register'));
app.use(require('./routes/login'));
app.use(require('./routes/user'));
app.use(require('./routes/class'));
app.use(require('./routes/student'));

app.listen(3000, function () {
    console.log('服务已启动，等待请求...\n请访问：http://localhost:3000/发起请求');
});



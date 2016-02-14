import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as pmx from 'pmx';
import { ErrorView } from './views/error';

// declare variables from the webpack config
declare var __dirname_webpack: string;

import * as routes from './routes/index';

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname_webpack, 'dist')));

app.use('/', routes);

class ServerError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new ServerError('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err: ServerError, req: express.Request, res: express.Response, next) {
        err.status = err.status || 500;
        res.status(err.status);
        console.log(err.stack);
        res.send(ErrorView.render({
            message: err.message,
            error: err
        }));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: ServerError, req: express.Request, res: express.Response, next) {
    err.status = err.status || 500;
    res.status(err.status);
    res.send(ErrorView.render({
        message: err.message,
        error: {}   
    }));
});

// attach more data from express errors:
app.use(pmx.expressErrorHandler());

module.exports = app;

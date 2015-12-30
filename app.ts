import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as pmx from 'pmx';

import * as routes from './routes/index';

var app = express();

// view engine setup
import * as hb from 'handlebars';
import { handlebars } from 'consolidate';
app.engine('hbs', handlebars);

hb.registerHelper('section', function(name, options) {
    if(!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
});

app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: ServerError, req: express.Request, res: express.Response, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// attach more data from express errors:
app.use(pmx.expressErrorHandler());

module.exports = app;

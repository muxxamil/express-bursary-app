// index.js

/**
 * Required External Modules
 */
 require('dotenv').config();

 const express = require('express');
 const path = require('path');
 const exphbs  = require('express-handlebars');
 const bodyParser = require('body-parser')
 const session = require('express-session')
 const { v4: uuidv4 } = require('uuid');
 const flash = require('connect-flash');
 const i18n = require('i18n')

 i18n.configure({
  locales: ['en', 'fr'],
  cookie: 'locale',
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
});

 const { sessionRedisStore } = require('./utils/redisHelper')

 const sessionConfigs = {
  store: sessionRedisStore,
  secret: process.env.APP_SECRET,
  cookie: {},
  resave: false,
  maxAge: 1000 * 3600 * 24,
  saveUninitialized: false,
  unset: 'destroy',
  genid: function(req) {
    return uuidv4() // use UUIDs for session IDs
  },
}

const admin = require('./applications/admin/routes');
const api = require('./applications/api/routes');
const web = require('./applications/web/routes');
require('./models');

/**
 * App Variables
 */

 const app = express();
 const port = process.env.PORT || '8000';

 if (process.env.ENVIRONMENT === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionConfigs.cookie.secure = true // serve secure cookies
}

app.use(session(sessionConfigs))
app.use(flash());

 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(i18n.init)

 app.engine('handlebars', exphbs.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: [
    {dir: __dirname + '/views/web/partials', namespace: 'webPartials'},
    {dir: __dirname + '/views/admin/partials', namespace: 'adminPartials'},
  ],
  helpers: {
   i18n: function(){
     // eslint-disable-next-line prefer-rest-params
    return i18n.__.apply(this,arguments);
   },
   __n: function(){
     // eslint-disable-next-line prefer-rest-params
    return i18n.__n.apply(this, arguments);
   },
  }
  }));
 app.set('view engine', 'handlebars');


/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */

app.use('/', web);
app.use('/admin', admin);
app.use('/api', api);

app.use('/static', express.static('public'));
app.use('/template', express.static('./node_modules/admin-lte'));

/**
 * Server Activation
 */

  app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
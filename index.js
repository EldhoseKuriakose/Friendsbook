const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port  = 8000;
const db = require('./config/mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//mongo store is used to store session cookie in db
app.use(session({
  name: 'friendsbook',
  secret: 'Az3rKvwQ1P',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: (1000 * 60 * 100)
  },
  store: MongoStore.create({
    client: db.getClient(),
    autoRemove: 'disabled'
  })
}));

//use express router
app.use('/api', require('./routes/index.router'));

app.listen(port, (err) => {
  if(err){
    console.log(`Error:, ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
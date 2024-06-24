const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Middleware setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 300 }
}));

// View engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Routes setup
const registrationRouter = require('./routes/registration-route');
const loginRouter = require('./routes/login-route');
const dashboardRouter = require('./routes/dashboard-route');
const logoutRouter = require('./routes/logout-route');
const mainRouter = require('./routes/main');
const adminLoginRouter = require('./routes/admin_login');
const tableViewRouter = require('./routes/table_view');
const adminRegisterRouter = require('./routes/admin_register');

app.use('/', registrationRouter);
app.use('/', loginRouter);
app.use('/', dashboardRouter);
app.use('/', logoutRouter);
app.use('/', mainRouter);
app.use('/', adminLoginRouter);
app.use('/', tableViewRouter);
app.use('/', adminRegisterRouter); // Mount admin_register router under /admin

// Static file routes
app.get('/vote_area', (req, res) => {
   res.sendFile(__dirname  + "/src/vote_area.html");
});

app.get('/candidateDetails', (req, res) => {
  res.sendFile(__dirname + "/src/adminCandidateDetails.html");
});

app.get('/userInfo', (req, res) => {
  res.sendFile(__dirname + "/src/userInfo.html");
});

app.get('/result', (req, res) => {
  res.sendFile(__dirname + "/src/result.html");
});

app.get('/addCandidate', (req, res) => {
  res.sendFile(__dirname + "/src/adminAddCandidate.html");
});

app.get('/changePhase', (req, res) => {
  res.sendFile(__dirname + "/src/adminChangePhase.html");
});

app.get('/voting', (req, res) => {
  res.sendFile(__dirname + "/src/voting.html");
});

app.get('/hello', (req, res) => {
   res.send('Hello');
});
app.get('/adregister', (req, res) => {
  res.send('admin_register.ejs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

// destructring env for ease
let { PORT, NODE_ENV, MONGO_URI } = process.env;

require("./config/passport")(passport);

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//helpers
const {
  formatDate,
  truncate,
  stripTags,
  select,
  editIcon,
} = require("./helpers/hbs");

//Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, truncate, stripTags, select, editIcon },
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");

//Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

// global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// statics
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(PORT || 5001, () => {
  console.log(`Server running in ${NODE_ENV} mode on port:${PORT}`);
});

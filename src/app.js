import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import pgSession from "connect-pg-simple";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { PORT, DB_CONFIG } from "./config.js";
import sequelize from "./database.js";

// Import models to ensure they're initialized
import "./models/User.js";
import "./models/Note.js";

// Routes
import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/auth.routes.js";
import "./config/passport.js";

// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PgStore = pgSession(session);

// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  // Add this option to fix prototype access warnings
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}); 
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    store: new PgStore({
      conObject: {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        user: DB_CONFIG.username,
        password: DB_CONFIG.password,
        database: DB_CONFIG.database,
      },
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);

// static files
app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});

export default app;

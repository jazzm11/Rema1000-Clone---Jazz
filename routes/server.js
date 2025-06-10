import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { backendHandler } from "../api/backend.js";
import { produktHandler } from '../api/produkt_api.js';
import { stockHandler } from '../api/stocks.js';

const allowedOrigins = [
  'https://rema1000-clone-jazz.vercel.app',
  'https://rema1000-clone-jazz.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow main and preview Vercel deployments
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/rema1000-clone-jazz.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/backend", backendHandler);
app.get("/api/produkter", produktHandler);
app.post("/api/checkout", stockHandler);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/rema", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "rema.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "cart.html"));
});

app.get("/account", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "account.html"));
});

app.listen(3000, () => console.log("Server kjører på http://localhost:3000"));

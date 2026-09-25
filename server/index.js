import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import { onUserSignup } from "./inngest/functions/OnSignup.js";
import {onTicketCreated} from "./inngest/functions/on-ticket-create.js";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { getCorsOrigins, requireEnv } from "./utils/env.js";


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

requireEnv();

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = getCorsOrigins();
      // allow non-browser clients & same-origin/no-origin (curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);

      // Dev convenience: allow localhost/127.0.0.1 on any port unless explicitly restricted.
      if (process.env.NODE_ENV !== "production") {
        if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return cb(null, true);
      }

      // Do not throw (would become a 500); simply omit CORS headers.
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "200kb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);

app.use(
    "/api/inngest",serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated]
        
    })
)

app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log("🚀 Server at http://localhost:3000"));
  })
  .catch((err) => console.error("❌ MongoDB error: ", err));
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// allow your local frontend origins (from .env)
const allowed = (process.env.FRONTEND_ORIGINS || "http://localhost:8081").split(",");
app.use(cors({ origin: allowed }));

const RENDER_URL = process.env.RENDER_URL;
if (!RENDER_URL) {
  console.error("RENDER_URL not set in .env");
  process.exit(1);
}

app.get("/health", (req, res) => res.json({ ok: true, target: RENDER_URL }));

app.post("/api/chat", async (req, res) => {
  try {
    const payload = req.body;

    // Validate: frontend MUST send { message: string }
    if (!payload || typeof payload.message !== "string") {
      return res.status(400).json({
        reply: "",
        meta: { error: "Frontend must send { message: string }" }
      });
    }

    // 👉 Transform frontend payload into what Render needs
    const forwardPayload = {
      symptoms: payload.message
    };

    // Forward to Render model
    const r = await fetch(RENDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardPayload)
    });

    const text = await r.text();
    const ct = r.headers.get("content-type") || "";

    if (!r.ok) {
      return res.status(r.status).send(text);
    }

    if (ct.includes("application/json")) {
      return res.json(JSON.parse(text));
    } else {
      return res.send(text);
    }

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({
      reply: "",
      meta: { error: String(err) }
    });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT} -> ${RENDER_URL}`));

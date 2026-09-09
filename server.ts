import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Check if server has an active API key
  app.get("/api/gemini/status", (_req, res) => {
    res.json({ hasServerKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Generation proxy supporting Server Key and BYOK (Bring Your Own Key)
  app.post("/api/gemini/generate", async (req, res) => {
    const userApiKey = (req.headers["x-gemini-api-key"] as string)?.trim();
    const serverApiKey = process.env.GEMINI_API_KEY?.trim();
    const apiKey = userApiKey || serverApiKey;

    if (!apiKey) {
      return res.status(400).json({
        error: "NO_API_KEY",
        message: "API key belum dikonfigurasi. Masukkan API key Gemini Anda di Pengaturan atau konfigurasi GEMINI_API_KEY di environment."
      });
    }

    const { prompt, systemInstruction, model = "gemini-2.5-flash", responseMimeType } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "INVALID_REQUEST", message: "Prompt is required." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error?.message || error);
      return res.status(500).json({
        error: "GEMINI_ERROR",
        message: error?.message || "Gagal memproses permintaan AI."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

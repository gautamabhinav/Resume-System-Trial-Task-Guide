import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";

// Try to initialize OpenAI (Responses API) and/or Google Gemini clients if keys are present
let genAI;
let openaiClient;
try {
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import("openai")).default;
      openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log("✅ OpenAI client initialized");
    } catch (e) {
      console.warn("⚠️ OpenAI SDK not available or failed to init:", e?.message || e);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log("✅ Gemini client initialized");
    } catch (e) {
      console.warn("⚠️ Gemini client failed to initialize:", e?.message || e);
    }
  } else {
    console.log("⚠️ GEMINI_API_KEY not set, using local summarizer or OpenAI if available.");
  }
} catch (e) {
  console.warn("Generative clients initialization error:", e?.message || e);
}

/**
 * ✨ Local fallback summarizer
 * Converts structured resume data into a professional 2–4 sentence paragraph.
 */
const localSummarizeResume = (data) => {
  if (!data) return "No data provided.";

  if (typeof data === "string") {
    const sentences = data.match(/[^.!?]+[.!?]?/g) || [data];
    return sentences.slice(0, 3).join(" ");
  }

  const pick = (arr, n = 3) => (Array.isArray(arr) ? arr.slice(0, n) : []);

  const name = data.name || "This individual";
  const skills = pick(data.skills, 6).join(", ");
  const projects = pick(data.projects, 2)
    .map((p) => (typeof p === "string" ? p : p.title || p.name))
    .join(", ");
  const internships = pick(data.internships, 2)
    .map((i) => (typeof i === "string" ? i : i.role || i.company))
    .join(", ");
  const courses = pick(data.courses, 2).join(", ");
  const hackathons = pick(data.hackathons, 2).join(", ");

  let summary = `${name} is a motivated professional with expertise in ${skills || "various technical and analytical skills"}.`;

  if (projects) summary += ` They have worked on notable projects such as ${projects}.`;
  if (internships) summary += ` Their hands-on experience includes internships at ${internships}.`;
  if (courses) summary += ` They have also completed relevant courses in ${courses}.`;
  if (hackathons) summary += ` Additionally, they have participated in hackathons like ${hackathons}.`;

  summary += " This blend of skills and experiences demonstrates strong potential for growth and impact.";

  return summary.trim();
};

/**
 * 🔹 Generate professional resume summary
 * Prefers Gemini AI → falls back to local summarizer if unavailable.
 */
export const getsummary = asyncHandler(async (req, res, next) => {
  try {
    const { data } = req.body;
    if (!data) return next(new AppError("No data provided for summarization", 400));

    // Prefer OpenAI Responses API when available
    if (openaiClient) {
      try {
        const prompt = `Create a concise, professional 2-3 sentence resume summary from the following JSON resume data. Prefer action verbs and quantifiable achievements when available. Output only the summary text.\n\n${JSON.stringify(data).slice(0,20000)}`;
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const response = await openaiClient.responses.create({ model, input: prompt });

        let summary = response.output_text || "";
        if (!summary && Array.isArray(response.output)) {
          summary = response.output
            .map((o) => {
              if (o.content) return o.content.map((c) => c.text || c.content || "").join("");
              return "";
            })
            .join(" \n");
        }

        if (summary?.trim()) return res.json({ summary: String(summary).trim() });
      } catch (oaErr) {
        console.warn("OpenAI summarization failed, will try Gemini/local fallback:", oaErr?.message || oaErr);
      }
    }

    // If OpenAI not available or failed, try Gemini
    if (genAI) {
      try {
        const prompt = `
        Write a professional 3–4 sentence resume summary using this JSON data.
        Focus on technical skills, achievements, and career goals.
        Output only the summary paragraph.

        Resume Data:
        ${JSON.stringify(data).slice(0, 15000)}
        `;

        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const text = typeof result?.response?.text === "function" ? await result.response.text() : String(result?.response?.text || result?.text || result);

        if (text?.trim()) return res.json({ summary: text.trim() });
      } catch (err) {
        console.warn("Gemini summarization failed, using local fallback:", err?.message || err);
      }
    }

    // Fallback: local summarizer
    const summary = localSummarizeResume(data);
    return res.json({ summary });
  } catch (error) {
    console.error("💥 Summary generation error:", error);
    return next(new AppError(error.message || "Error generating summary", 500));
  }
});

/**
 * 🔹 Summarize arbitrary text (for blogs, etc.)
 */
export const getsummaryText = asyncHandler(async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return next(new AppError("No text provided for summary", 400));

    if (genAI) {
      try {
        const prompt = `
        Summarize this text into 3 short bullet points and a 1-sentence TL;DR:
        ${String(text).slice(0, 10000)}
        `;

        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
        });

        const result = await model.generateContent(prompt);
        const textOut =
          typeof result?.response?.text === "function"
            ? await result.response.text()
            : String(result?.response?.text || result?.text || result);

        if (textOut?.trim()) return res.json({ summary: textOut.trim() });
      } catch (err) {
        console.warn("Gemini text summary failed:", err?.message || err);
      }
    }

    // Local fallback
    const sentences = String(text).replace(/\s+/g, " ").match(/[^.!?]+[.!?]?/g) || [text];
    const bullets = sentences.slice(0, 3).map((s) => `• ${s.trim()}`);
    const tldr = sentences[0]?.trim().slice(0, 150) + "...";
    const summary = bullets.join("\n") + `\n\n**TL;DR:** ${tldr}`;
    res.json({ summary });
  } catch (error) {
    console.error("Text summary error:", error);
    return next(new AppError(error.message || "Error generating summary", 500));
  }
});

# AI Summary Endpoints

This file documents the AI summarization endpoints added to the server.

## Endpoints

- POST /api/v1/ai/summary

  - Body: { data: <resume JSON object or array> }
  - Response: { summary: <string> } (If Gemini is configured, a string; otherwise a local heuristic string)

- POST /api/v1/ai/summary/text
  - Body: { text: <string> }
  - Response: { summary: <object|string> } (Local fallback returns { bullets: [...], tldr: '...' })

## Examples (Windows PowerShell)

# Send structured resume JSON to get a generated summary

curl -Method POST -Uri http://localhost:10000/api/v1/ai/summary -ContentType "application/json" -Body (
@{
data = @{
name = "Jane Doe";
skills = @("JavaScript","React","Node.js");
projects = @( @{ title = "Project A"; description = "Built X" } )
}
} | ConvertTo-Json -Depth 5
)

# Summarize long text

curl -Method POST -Uri http://localhost:10000/api/v1/ai/summary/text -ContentType "application/json" -Body (
@{
text = "Long article text..."
} | ConvertTo-Json -Depth 2
)

## Notes

- If you set the environment variable GEMINI_API_KEY and install `@google/generative-ai`, the server will attempt to use Gemini. If Gemini is unavailable or fails, the server always falls back to a local summarizer so the frontend can function without external AI keys.

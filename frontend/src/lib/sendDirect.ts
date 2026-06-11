// src/lib/sendDirect.ts
export type ChatHistoryItem = { role: "user" | "bot"; content: string };

type SendDirectResult = {
  reply: string;
  meta?: any;
};

export async function sendDirect(
  message: string,
  history: ChatHistoryItem[],
  opts?: { timeoutMs?: number }
): Promise<SendDirectResult> {
  const RENDER_URL = import.meta.env.VITE_RENDER_URL as string | undefined;
  if (!RENDER_URL) throw new Error("VITE_RENDER_URL is not set in your .env");

  const timeoutMs = opts?.timeoutMs ?? 60_000; // default 60s
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(RENDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Render returned ${res.status}: ${text}`);
    }

    // Try parse JSON, but be tolerant if response is plain text
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      // Expecting something like { reply: "...", meta: {...} } or plain string
      if (typeof data === "string") return { reply: data, meta: null };
      if (data?.reply) return { reply: data.reply, meta: data.meta ?? null };
      // fallback: try to infer
      return { reply: JSON.stringify(data), meta: null };
    } else {
      const text = await res.text();
      return { reply: text, meta: null };
    }
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

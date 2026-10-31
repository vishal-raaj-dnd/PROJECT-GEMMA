// Dynamic API base: uses VITE_API_URL if configured, otherwise falls back to empty string for relative proxy
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const signal = options.signal ? options.signal : controller.signal;

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

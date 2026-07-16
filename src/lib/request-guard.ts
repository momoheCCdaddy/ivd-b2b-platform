import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & { cobioerRateLimits?: Map<string, Bucket> };
const buckets = globalStore.cobioerRateLimits || new Map<string, Bucket>();
globalStore.cobioerRateLimits = buckets;

export class JsonRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function readJsonRequest<T>(request: NextRequest, maxBytes = 32_768): Promise<T> {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("application/json")) throw new JsonRequestError(415, "Content-Type must be application/json.");
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) throw new JsonRequestError(413, "Request body is too large.");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new JsonRequestError(413, "Request body is too large.");
  try { return JSON.parse(text) as T; }
  catch { throw new JsonRequestError(400, "Invalid request body."); }
}

export function jsonRequestError(error: unknown) {
  if (error instanceof JsonRequestError) {
    return NextResponse.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ error: "Invalid request body." }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

export function rateLimit(request: NextRequest, scope: string, limit: number, windowMs: number) {
  const forwarded = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const address = forwarded.split(",")[0].trim();
  const key = createHash("sha256").update(`${scope}:${address}`).digest("hex").slice(0, 24);
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    prune(now);
    return null;
  }
  if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(retryAfter) } },
    );
  }
  current.count += 1;
  return null;
}

function prune(now: number) {
  if (buckets.size < 2_000) return;
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  while (buckets.size > 5_000) buckets.delete(buckets.keys().next().value as string);
}

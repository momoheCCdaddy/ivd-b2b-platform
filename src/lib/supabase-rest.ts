const getConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");
  return { url: url.replace(/\/$/, ""), key };
};

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase REST request failed", response.status, detail.slice(0, 500));
    throw new Error("SUPABASE_REQUEST_FAILED");
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function supabaseInsert(path: string, body: unknown, returnRecord = false) {
  return supabaseRequest(path, {
    method: "POST",
    headers: { Prefer: returnRecord ? "return=representation" : "return=minimal" },
    body: JSON.stringify(body),
  });
}

export async function supabaseUpsert(path: string, body: unknown, conflictColumn: string, returnRecord = false) {
  const separator = path.includes("?") ? "&" : "?";
  return supabaseRequest(`${path}${separator}on_conflict=${encodeURIComponent(conflictColumn)}`, {
    method: "POST",
    headers: { Prefer: `resolution=merge-duplicates,${returnRecord ? "return=representation" : "return=minimal"}` },
    body: JSON.stringify(body),
  });
}

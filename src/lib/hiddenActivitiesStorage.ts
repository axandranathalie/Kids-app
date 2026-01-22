// LocalStorage key for hidden activities (kids mode visibility)
const HIDDEN_KEY = "kidsapp_hidden_activity_ids";

export function readHiddenActivityIds(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return new Set();

    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();

    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function writeHiddenActivityIds(ids: Set<string>) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(ids)));
}

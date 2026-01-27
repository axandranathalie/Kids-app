const PIN_KEY = "kidsapp_parent_pin";

/**
 * Parent mode PIN helpers.
 */
export function getParentPin(): string | null {
  const pin = localStorage.getItem(PIN_KEY);
  if (!pin) return null;
  return /^\d{4}$/.test(pin) ? pin : null;
}

export function setParentPin(pin: string): void {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error("PIN must be exactly 4 digits");
  }
  localStorage.setItem(PIN_KEY, pin);
}

export function clearParentPin(): void {
  localStorage.removeItem(PIN_KEY);
}

export function hasParentPin(): boolean {
  return Boolean(getParentPin());
}

export function verifyParentPin(input: string): boolean {
  const stored = getParentPin();
  if (!stored) return false;
  return stored === input;
}

export function createId(prefix: string) {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
  return `${prefix}_${rand.replaceAll("-", "")}`
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}



export function areEqual(a, b) {
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  // Same prop count
  if (aProps.length !== bProps.length) return false

  // Same prop values
  for (const prop of aProps) {
    if (a[prop] !== b[prop]) return false
  }

  return true
}
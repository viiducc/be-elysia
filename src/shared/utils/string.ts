export function slugify(text: string): string {
  return text.toLowerCase().replace(/ /g, '-');
}

// UUIDv7 - shorter (length 22) and sortable version of UUID v4 but still is collision resistant
export function newShortId(): string {
  return Bun.randomUUIDv7('base64url');
}

// Standard UUID v4 (length 36)
export function newId(): string {
  return crypto.randomUUID();
}

function randomString(length: number, characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

export function randomNumberString(length: number): string {
  return randomString(length, '0123456789');
}

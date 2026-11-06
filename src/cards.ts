export type ChristmasCard = { v: 1; id: string; sender: string; message: string }

export function encodeCard(card: ChristmasCard): string {
  const bytes = new TextEncoder().encode(JSON.stringify(card))
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export function decodeCard(hash: string): ChristmasCard | null {
  try {
    if (!hash.startsWith('#cartao=') || hash.length > 12000) return null
    const encoded = hash.slice(8)
    if (!/^[\w-]+$/.test(encoded)) return null
    const raw = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'))
    const card = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(raw, char => char.charCodeAt(0))))
    if (card?.v !== 1 || typeof card.id !== 'string' || !/^[a-f0-9-]{36}$/.test(card.id)
      || typeof card.sender !== 'string' || !card.sender.trim() || card.sender.length > 80
      || typeof card.message !== 'string' || !card.message.trim() || card.message.length > 800) return null
    return { v: 1, id: card.id, sender: card.sender, message: card.message }
  } catch { return null }
}

export const openedKey = (id: string) => `natal:opened:${id}`

// Nome e cidade abreviados para os limites de 25 e 15 caracteres do BR Code.
// Titular: Luiz Denyson Soares da Silva — Palmeira dos Índios.
export const pixConfig = {
  key: '10146389417',
  receiverName: 'LUIZ DENYSON SOARES SILVA',
  receiverCity: 'PALMEIRA INDIOS',
  // Sem valor: o doador informa a quantia no aplicativo do banco.
  amount: '',
  bankPayload: '',
}

function field(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

export function crc16(value: string) {
  let crc = 0xffff
  for (const byte of new TextEncoder().encode(value)) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = ((crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0)) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9 .-]/g, '').trim()
}

export function createPixPayload(config: typeof pixConfig): string | null {
  if (config.bankPayload.trim()) return config.bankPayload.trim()
  const name = normalize(config.receiverName)
  const city = normalize(config.receiverCity)
  if (!name || !city) return null
  if (name.length > 25 || city.length > 15 || !/^\d{11}$/.test(config.key) || (config.amount !== '' && !/^\d{1,10}\.\d{2}$/.test(config.amount))) {
    throw new Error('Configuração Pix inválida. Confira chave, valor, nome (25 caracteres) e cidade (15 caracteres).')
  }
  const payload = field('00', '01')
    + field('26', field('00', 'br.gov.bcb.pix') + field('01', config.key))
    + field('52', '0000') + field('53', '986')
    + (config.amount ? field('54', config.amount) : '')
    + field('58', 'BR') + field('59', name) + field('60', city)
    + field('62', field('05', '***')) + '6304'
  return payload + crc16(payload)
}

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { createPixPayload, pixConfig } from './pix'

export default function PixSupport() {
  const [notice, setNotice] = useState('')
  const payload = createPixPayload(pixConfig)

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(payload ?? pixConfig.key)
      setNotice(payload ? 'Pix Copia e Cola copiado. Cole no aplicativo do seu banco e escolha quanto contribuir.' : 'Chave Pix copiada. No seu banco, escolha pagar por chave e informe o valor desejado.')
    } catch {
      setNotice('Não foi possível copiar automaticamente. Selecione e copie o código abaixo.')
    }
  }

  return <aside className="pix-support" aria-labelledby="pix-heading">
    <span className="card-kicker">UM GESTO DE CARINHO</span>
    <h3 id="pix-heading">Ajude a manter essa magia ✧</h3>
    <p>Gostou desse cantinho de Natal? Se quiser, apoie o projeto pelo Pix com o valor que desejar.</p>
    <p className="card-hint">Seu cartão já está pronto. Contribuir é opcional e não altera o envio da mensagem.</p>
    {payload && <div className="pix-qr"><QRCodeSVG value={payload} size={208} level="M" marginSize={4} title="QR Code Pix para contribuição voluntária de valor livre" /><span>Escolha o valor no aplicativo do seu banco</span></div>}
    <label htmlFor="pix-code">{payload ? 'Pix Copia e Cola' : 'Chave Pix (CPF)'}<textarea id="pix-code" rows={payload ? 3 : 1} readOnly value={payload ?? pixConfig.key} onFocus={event => event.target.select()} /></label>
    <button type="button" className="card-primary" onClick={copyPix}>{payload ? 'Copiar Pix' : 'Copiar chave Pix'}</button>
    <p className="card-hint">Confira o nome do destinatário no seu banco antes de confirmar. O site não verifica pagamentos.</p>
    <p className="card-notice" role="status">{notice}</p>
  </aside>
}

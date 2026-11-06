# Natal Frontend

Projeto React com TypeScript e Vite.

## Desenvolvimento

A trilha instrumental natalina é uma composição em loop sintetizada localmente
pela Web Audio API. Tenta começar ao carregar a página; se o navegador bloquear
o áudio automático, começa na primeira interação. Pode ser pausada ou retomada pelo controle fixo de
música. Não usa downloads de áudio. O jogo dos presentes tem efeitos distintos
para acerto e erro, respeitando a preferência de movimento reduzido.

Requer Node.js 22.12+ ou uma versão mais recente compatível com o Vite.

```sh
npm install
npm run dev
```

## Build de produção

```sh
npm run build
npm run preview
```

O build é gerado em `dist/`. A página inicial está em `src/App.tsx` e os estilos em `src/index.css`.

## Cartões de Natal

Preencha o nome de quem envia e a mensagem para gerar um link compartilhável.
O cartão é codificado em UTF-8/Base64URL no fragmento `#cartao=...`, sem banco,
autenticação ou API. O endereço mantém o caminho atual, inclusive em hospedagens
estáticas em subdiretórios. Para compartilhar com outras pessoas, use a URL do
site publicado, pois links localhost só funcionam no próprio computador.

A pessoa precisa clicar em “Abrir meu presente” para registrar a leitura no
localStorage. Depois de fechar ou recarregar, a mensagem não é exibida novamente
nesse navegador. Outros navegadores ou a limpeza do armazenamento permitem nova
leitura. Se o armazenamento estiver indisponível, a leitura funciona com aviso.
O conteúdo está codificado, sem criptografia: qualquer pessoa com o link pode
ler ou modificar o cartão. Nome e mensagem são renderizados como texto.

## Contribuição Pix opcional

Após gerar um cartão, aparece uma contribuição voluntária de valor livre, sem bloquear
o compartilhamento. A chave está configurada em `src/pix.ts`. Para ativar o QR
Code e o Pix Copia e Cola, preencha `receiverName` e `receiverCity` com os dados
do titular, ou `bankPayload` com um código sem valor fixo gerado pelo banco. Enquanto os
dados não estiverem preenchidos, o site oferece somente a cópia da chave Pix.

O QR Code é gerado localmente com `qrcode.react`, sem serviços externos. O
payload estático usa BR Code e CRC16/CCITT-FALSE. Com `amount` vazio, o campo de
valor é omitido e o doador escolhe a quantia no banco. Não há confirmação de pagamento.
Antes de disponibilizar, leia o QR no banco e confira destinatário e valor,
sem necessidade de concluir uma transferência. A chave Pix fica pública no site.

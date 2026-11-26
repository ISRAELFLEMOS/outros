# Feliz 72 anos, Paizão!

Uma carta de Israel Faria de Lemos para José Randolfo de Lemos, em 26 de novembro de 2026.

**Site:** https://israelflemos.github.io/outros/Niver_papai/

## Conteúdo

- Texto integral da versão HTML escolhida por Israel, mantido conforme sua confirmação de 26/11/2026.
- Envelope com abertura suave e carta em leitura contínua.
- Tipografia local, sem dependência de Google Fonts ou de um framework em CDN.
- Jingle instrumental original e discreto, iniciado ao abrir a carta.
- Controles de pausa, volume, silenciar e fechar. O som pausa ao voltar ao envelope ou ao sair da aba.
- Aumento de texto, foco de teclado, redução de movimento e compartilhamento.
- Nenhuma identificação de ferramentas de criação na página.

## Abrir e publicar

O GitHub Pages do repositório `ISRAELFLEMOS/outros` hospeda esta pasta em `/outros/Niver_papai/`.

Não há compilação, chaves, cadastro ou backend. Os arquivos estáticos são publicados com seus caminhos relativos. Para testar localmente, use um servidor HTTP, por exemplo `python -m http.server 8000`, e abra `http://localhost:8000/`. O duplo clique em `index.html` pode bloquear os módulos JavaScript pelo protocolo `file:`; a carta continua disponível como texto.

## Roberto Carlos sem YouTube

A gravação de **Meu Querido, Meu Velho, Meu Amigo** não acompanha o projeto: nenhum arquivo de áudio foi fornecido. Não há incorporação de YouTube nem abertura de outra página para tocar música.

Para ativar a segunda opção, adicione uma gravação que você tenha autorização para disponibilizar em `assets/audio/roberto-carlos.mp3`. Em `assets/app.js`, altere somente:

```js
const ROBERTO_CARLOS_AUDIO = './assets/audio/roberto-carlos.mp3';
```

A aplicação verifica a disponibilidade do arquivo e então exibe, no painel **Som**, as opções **Jingle do cartão** e **Roberto Carlos**. Ambas usam controles na própria página. Sem o arquivo, apenas o jingle aparece; o visitante não recebe botões de faixas ausentes.

O jingle é uma composição instrumental independente feita com Web Audio; não é uma versão ou imitação da música de Roberto Carlos.

## Estrutura

- `index.html`: conteúdo e metadados.
- `assets/style.css`: visual e responsividade.
- `assets/app.js`: abertura, leitura, controles e compartilhamento.
- `assets/music.js`: jingle e reprodução de gravação local opcional.
- `assets/fonts/`: Cormorant Garamond e Lora, com suas licenças OFL.
- `assets/compartilhamento.jpg`: prévia de compartilhamento de 1200 × 630.
- `assets/favicon.png`: ícone do cartão.

## Dados e autoria

Autoria da homenagem: Israel Faria de Lemos. O site não usa rastreadores nem exige login. Nenhuma fotografia foi acrescentada, pois o HTML anexado apenas mencionava um arquivo opcional que não estava incluído.

O botão de compartilhar abre o compartilhamento nativo quando disponível; em outros navegadores, prepara o texto no WhatsApp. Nenhuma mensagem é enviada automaticamente. A imagem de prévia depende também do processamento/cache do aplicativo que recebe o link.

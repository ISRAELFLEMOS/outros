# Mapa do Projeto - Outros Versionados

Atualizado em: 2026-05-20 12:10:42

## Resumo executivo

- Pasta: `outros`
- Tipo: Repositorio auxiliar pequeno para materiais avulsos
- Objetivo: Manter materiais legados ou avulsos que foram versionados separadamente.
- Responsavel operacional: IFL / Israel
- Controle Git: sim, tratar este projeto com status/diff/commit independentes.
- Arquivos mapeados: 2
- Arquivos raiz principais: Nenhum arquivo raiz principal listado ou nomes omitidos por seguranca.

## Fluxo profissional

1. Conteudo avulso entra para triagem.
2. Material util e mantido ou migrado para projeto correto.
3. Material obsoleto e removido com registro.
4. Repo so deve receber commits focados.

## Variacoes do fluxo

- Pode conter subprojetos pequenos, como cartoes.
- Se crescer, deve virar pasta propria em #PROJETOS.

## Mapa das subpastas

| Pasta | Funcao | Conteudo encontrado | Uso correto |
|---|---|---|---|
| `namora` | Subarea do projeto; usar conforme conteudo interno e manter finalidade registrada. | cartao | Manter coeso; mover conteudo fora de contexto para a pasta correta. |

## Entradas e saidas

- Entradas tipicas: demandas do negocio, arquivos recebidos, briefing, dados, scripts ou evidencias relacionados ao objetivo do projeto.
- Saidas tipicas: entrega validada, relatorio, site, arquivo operacional, automacao, produto, campanha ou documento final.
- Entregas finais devem ficar em pasta clara, com nome compreensivel e sem depender de temporarios.

## Relacao com demais projetos

- Consulte `..\MAPA_GERAL_DOS_PROJETOS.md` para entender como este projeto se conecta aos demais.
- Nao mover conteudo entre projetos sem confirmar qual pasta e a fonte canonica.
- Se uma demanda crescer alem deste escopo, criar ou indicar projeto proprio em vez de misturar responsabilidades.

## Cuidados operacionais

- Revisar git status antes de qualquer commit.
- Evitar duplicar o papel de 99_OUTROS.
- Aplicar a Politica de Limpeza Definitiva Controlada: apagar definitivamente apenas temporarios/lixo tecnico inequivoco; arquivos desatualizados exigem substituto validado e registro.
- Nao salvar senhas, tokens, certificados ou credenciais reais neste mapa.

## Manutencao obrigatoria do mapa

- Atualizar este arquivo no mesmo fechamento de qualquer tarefa que criar/remover subpasta, mudar fluxo, mudar finalidade, criar ferramenta, alterar publicacao ou adicionar variacao operacional.
- Se a tarefa nao mudar estrutura, fluxo ou finalidade, registrar na resposta final que este mapa foi revisado e permaneceu valido.
- Atualizar `..\MAPA_GERAL_DOS_PROJETOS.md` quando a mudanca afetar a relacao deste projeto com outros projetos.

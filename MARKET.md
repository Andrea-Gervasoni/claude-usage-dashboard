# Mercato e lancio

Ricerca del 26 novembre 2026. **[V]** = pagina aperta o registro interrogato; **[S]** = solo anteprima di ricerca; **[I]** = deduzione. Le stelle cambiano: ricontrollale prima di citarle.

## Chi c'è già

| Strumento | Stelle | Cosa fa | Cosa gli manca |
|---|---|---|---|
| [ccusage](https://github.com/ryoppippi/ccusage) | 19,6k [V] | CLI: tabelle e JSON per 20 agenti, statusline | Niente grafica, gioco o card |
| [Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor) | 8,8k [V] | Monitor dei limiti nel terminale, con previsioni | Niente da condividere |
| [tokscale](https://github.com/junhoyeo/tokscale) | 5,9k [V] | TUI, grafico 3D, classifica globale, profili pubblici, «Wrapped 2025» | Per condividere serve il login GitHub; niente livelli né mascotte |
| [phuryn/claude-usage](https://github.com/phuryn/claude-usage) | 2,3k [V] | Dashboard locale [S] | Non aperta: da verificare |
| [AgentPet](https://github.com/ntd4996/agentpet) | 409 [V] | Animaletto da scrivania con XP, 5 evoluzioni, 14 trofei | Niente card né recap. È il rivale più vicino sul gioco |
| [vibe-log-cli](https://github.com/vibe-log/vibe-log-cli) | 341 [V] | Report di produttività e standup, cloud facoltativo | Non è un gioco |
| [splitrail](https://github.com/Piebald-AI/splitrail) | 229 [V] | Dashboard web locale, cloud privato | Non è un gioco |
| [viberank](https://github.com/sculptdotfun/viberank) | 121 [V] | Classifica settimanale costruita su ccusage, badge per il README, card del lunedì | Il suo «Wrapped 2026» apre il 10 dicembre |
| Cloni «claude wrapped» | 40 repo, il primo a 22 [V] | Recap di fine anno | Un recap da solo non ha raccolto stelle |

Di casa: Claude Code ha `/stats` con le serie [S]; Cursor ha fatto «Year in Code 2025» [S].

**Lo spazio libero [I]:** nessuno mette insieme tutto in locale, una mascotte, i livelli e una card in formato storia. È la posizione di questo progetto.

## Due decisioni da prendere prima di pubblicare

### 1. Il nome

Il nome di lavoro «vibelog» era occupato [V]: esisteva un pacchetto npm con quel nome, uno strumento di analisi per Claude Code chiamato Vibe-Log, e 89 repo GitHub con «vibelog» nel nome.

Il progetto si chiama ora **vibecrab**. Il 26 novembre risultava libero su npm e PyPI e la ricerca dei repo GitHub dava 0 risultati. Marchi, domini e nomi utente non sono stati verificati. Alternative libere nello stesso controllo: `tokencrab`, `crabaura`.

Da evitare tutto ciò che contiene «claw» o «Claude». Anche «molt» porta con sé l'associazione con Moltbot. Il repo, prima chiamato `claude-usage-dashboard`, è stato rinominato `vibecrab` il 28 novembre: GitHub reindirizza il vecchio indirizzo.

### 2. La mascotte

Le linee guida sui marchi di Anthropic [V] coprono «nomi, loghi, elementi di marca», ammettono l'uso «solo come specificamente consentito», vietano le alterazioni e non prevedono eccezioni per l'open source. C'è un precedente: Clawdbot ha dovuto cambiare nome due volte dopo una richiesta di Anthropic a gennaio 2026 [V].

Per l'uso personale sul tuo Mac non cambia niente. Per un progetto pubblico che cerca visibilità, una mascotte che ricalca quella di Claude Code con accessori sopra è il rischio più concreto. La via prudente:

- un granchio originale, con forma e colore diversi;
- niente «Claude» nel nome, nel pacchetto e nel dominio (fatto: il repo si chiama `vibecrab`);
- la dicitura «for Claude Code» e una riga «unofficial, not affiliated with Anthropic».

Non è un parere legale.

## Cosa fa girare questi prodotti

In ordine di effetto atteso [I, con fonti dove indicate]. La colonna di destra dice dove siamo.

| Meccanica | Stato |
|---|---|
| Card da storia in un tocco, con l'utente come soggetto. Wrapped è esploso quando è diventato un'immagine da condividere ([TechCrunch](https://techcrunch.com/?p=2449677) [S]) | Fatto: carta da collezione 1080×1920, salvataggio e condivisione di sistema |
| Un'etichetta d'identità al posto dei numeri nudi ([Fortune](https://fortune.com/2025/12/03/why-spotify-wrapped-marketing-genius-individuality-uniqueness-belonging-psychology/) [S]) | Fatto: sette livelli con nome, battuta e rarità |
| Serie con la paura di perderla, più card ai traguardi 7/30/100 ([Duolingo](https://blog.duolingo.com/how-duolingo-streak-builds-habit) [S]) | In parte: serie in corso e avviso «a rischio» nella prima vista, trofei a 7, 30 e 100. Manca il «congelamento» |
| Uscite a calendario: recap settimanale, mensile, «Wrapped» di dicembre | Da fare: oggi il recap segue il periodo scelto |
| Confronto senza server: soglie pubblicate, badge SVG per il README, card «contro» codificata nell'URL | Da fare |
| Conversioni assurde («169 romanzi») come frase da screenshot | Fatto: The flex |
| Equipaggiamento bloccato ma visibile | Fatto: scala dei livelli e carte in sagoma |
| Il comando d'installazione su ogni card | In parte: c'è il repo, manca il comando breve (dipende dal nome) |

## Lancio

- **Ordine** [S, aneddotico]: r/ClaudeCode e r/ClaudeAI, poi Show HN a metà settimana, poi X. Product Hunt è facoltativo.
- **Tempi** [I]: uscire con il «Wrapped» prima del 10 dicembre, quando apre quello di viberank.
- **Show HN** [V]: deve essere provabile senza registrazione, niente richieste di voti, e i «progetti generati in fretta» non sono ammessi.
- **r/ClaudeCode** [V, analisi di terzi]: flair «Built with Claude», post di testo, dichiarare di essere l'autore, non ripubblicare. Circa il 14% dei post campionati è stato rimosso.
- **awesome-claude-code** (58,8k stelle) [V]: solo modulo web, niente PR; la segnalazione deve farla una persona; il repo deve avere almeno 14 giorni o 100 stelle.
- **In cima al README** [S/I, nessuna prova solida]: GIF della mascotte e della card, una riga che dice cos'è, il comando `npx`, «100% local», una galleria di card vere.

## Cosa non posso fare io

Le stelle, i post e la tendenza dipendono da te e da come reagisce la comunità. Qui c'è il prodotto e un piano; nessuna di queste fonti garantisce un risultato.

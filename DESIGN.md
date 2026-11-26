# Vibelog: design

Tipo: progetto proprio / tech. Direzione scelta da Andrea (non sorteggiata): palette «Cielo», serif elegante, calore in stile Anthropic, tono da vibe coder. Lingua dell'interfaccia: inglese.

## Idea centrale

La mascotte di Claude Code programma al portatile seduta su una nuvola. Dal portatile salgono cubetti di token nel cielo. Sotto, i numeri del diario stanno in lastre di vetro mentre il cielo passa dal mattino al tramonto con lo scroll.

## Token

| Nome | Valore | Ruolo |
|---|---|---|
| cielo | `#E9F1F5` | luce alta del cielo, nuvole |
| azzurro polveroso | `#C3D7E2` → `#6192B4` | cielo: più profondo scendendo nella pagina |
| inchiostro | `#0F1B24` | testo, linea del totale |
| arancione | `#DC6A32` | la mascotte, ciò che scrive Claude, i picchi; orizzonte al tramonto |
| blu dei dati | `#C9DAE3` → `#1F4A66` | cinque passi per l'intensità |

Testi: inchiostro, secondario `#2C3D4F`, attenuato `#3B4D5F`, accento `#9A3D14`. Il testo corrente sta sempre dentro il vetro; sul cielo nudo ci sono solo il titolo e la riga finale, in inchiostro.

Tipografia: Instrument Serif 400 per titoli e cifre; Instrument Sans 400/500/600 per il resto. Titoli a −0,02 em, interlinea 0,94–1.

Movimento: `--ease-out`, `--ease-io`, `--spring` per ciò che scatta in posa; molle vere (smorzamento critico) per indicatori, bordi luminosi e mascotte.

## Tre principi

1. **Un personaggio, non un'illustrazione.** Il granchio scrive, si ferma, ti guarda, sbatte gli occhi, segue il puntatore. Se lo tocchi salta, strizza gli occhi e risponde nel fumetto.
2. **Vetro sopra un cielo vivo.** Ogni sezione è una lastra di vetro: bordo luminoso che gira verso il puntatore, riflesso che lo segue, leggera inclinazione. Le capsule dei comandi hanno la rifrazione vera ai bordi (Chromium).
3. **Ogni grafico si anima al suo posto.** Celle che scattano a onda, colonne che crescono, linea che si disegna, tubi che si riempiono, righe che entrano a cascata. Niente oggetti che viaggiano fra le sezioni.

## Struttura

| Sezione | Cifra grande | Grafico |
|---|---|---|
| Prima vista | `184 days. 1.83B tokens. Zero regrets.` | mascotte 3D |
| The streak | giorni di fila | calendario a tessere |
| Where it all goes | token letti per ogni token scritto | barra di composizione, colonne a strati, voci premibili |
| The bill | costo stimato | colonne giornaliere, linea del totale, tubi dei mesi |
| The crew | numero di modelli | un tubo per modello |
| The receipts | | tabella dei mesi con totale |

Apertura: il logo saltella su fondo inchiostro mentre conta i giorni letti, poi il buio si chiude sul punto in cui atterra la mascotte; il portatile si apre e parte la prima sbuffata di cubetti.

## Aura

Il livello si calcola su tutta la storia, con una formula dichiarata nella pagina: +1 per milione di token, +50 per ogni giorno della serie più lunga, +10 per ogni giorno attivo. Niente percentili né confronti inventati.

| Livello | Nome | Da | Sblocca |
|---|---|---|---|
| 1 | NPC | 0 | niente |
| 2 | Vibe Rookie | 250 | fascia |
| 3 | Vibe Coder | 1.000 | occhiali a pixel |
| 4 | Ship Machine | 2.500 | cuffie |
| 5 | Context Lord | 5.000 | corona |
| 6 | Token Whale | 12.000 | catena d'oro |
| 7 | Final Boss | 30.000 | aureola |

- La mascotte 3D della prima vista indossa l'equipaggiamento del livello. Gli occhiali stanno sulla fronte e calano sugli occhi quando la tocchi.
- I livelli non raggiunti si vedono in sagoma, con la soglia e cosa sbloccano.
- **The flex**: quattro tessere di misura diversa (romanzi scritti, quota nei weekend, picco contro giorno normale, contesto riletto). Le conversioni sono dichiarate come stime.
- **Card da storie**: manifesto 1080×1920 con un'idea sola. Cielo profondo con raggi e alone nel colore del livello, granchio grande con i piedi nella nuvola, poi una frase: «andrea is a / Context Lord / +5,535 aura», un pulsante «What's your aura?» e il repo. Niente barre, righe di numeri o cornici. Il nickname viene da `VIBELOG_NAME`, poi dal nome dell'account Claude Code locale, poi dall'utente del computer; l'email non si usa mai. Nella pagina la card si inclina con un riflesso olografico e dalla scala dei livelli si guardano anche le altre carte, quelle bloccate in sagoma.
- **Trofei**: dodici, con forma diversa per famiglia (serie, giorni, volume, spesa, varietà). L'anello è il progresso reale.
- **Recap**: sette storie a tutto schermo con cielo e granchio, tocco per avanzare, pressione per fermare; l'ultima è la card.
- **Aura in 3D**: una fiamma morbida dietro la mascotte, colore e forza dal livello, che si accende quando la tocchi.
- **Easter egg «huss huss huss»**: tre tocchi di fila sulla mascotte, o la parola `huss` (vale anche `huz`) sulla tastiera. Riprende la struttura del meme: la frase «In this town, everybody goes out partying except me» come didascalia, stacco, tre palleggi con un «huss» ciascuno, stacco, il risultato (nickname, livello, aura, repo) con gli occhiali che calano. Tre inquadrature 3D con stacco netto. Il fiato e il rimbalzo sono sintetizzati nel browser; `sounds/huss.mp3` è nel repo e la build lo incorpora; se manca, la clip usa un suono sintetizzato. Provenienza e licenza non sono verificate: vedi `sounds/README.md`. L'audio parte da 0,47 s per togliere il click iniziale e sfuma piano negli ultimi 2,6 s. Video verticale 1080×1920 a 60 fotogrammi (720×1280 sui computer meno potenti e sui telefoni).
- **Aggancio quotidiano**: la prima vista dice a che giorno è la serie in corso, o che è a rischio se oggi non hai ancora scritto.
- Unico colore fuori palette: oro `#E9B44C`, solo per corona, catena e aureola.

## Tecnica

- Cielo: shader WebGL scritto a mano, a metà risoluzione, circa 25 fotogrammi al secondo.
- Mascotte: three.js r149 incluso nel file (`vendor/three.min.js`, licenza MIT), oggetti generati in codice, tre luci più la luce dello schermo, ombre morbide. In pausa quando la prima vista esce dallo schermo.
- Senza WebGL: resta il logo grande al posto della scena.
- Un solo ciclo `requestAnimationFrame`.

## Vietato

- Oggetti che volano da un grafico all'altro.
- Numeri romani, etichette maiuscole spaziate, puntini separatori, frecce decorative.
- Tooltip che segue il puntatore: ogni grafico ha una riga di lettura fissa.
- Titoli lunghi: massimo tre battute nella prima vista, due o tre parole nelle sezioni.
- Gradienti blu-viola, card uguali in fila, puntini che brillano.

## Impronta per `registro.json`

```json
{
  "nome": "Vibelog (dashboard locale Claude Code)",
  "data": "2026-11",
  "percorso": "~/claude-usage-dashboard",
  "idea": "La mascotte di Claude Code programma su una nuvola; i numeri del diario stanno in lastre di vetro sopra un cielo che va dal mattino al tramonto.",
  "direzione": "cielo (scelta da Andrea, fuori catalogo)",
  "font_display": "Instrument Serif",
  "font_testo": "Instrument Sans",
  "palette": ["#E9F1F5", "#C3D7E2", "#0F1B24", "#DC6A32", "#1F4A66"],
  "palette_tipo": "cielo azzurro polveroso + inchiostro, arancione per mascotte e picchi",
  "hero": "avatar-personaggio (mascotte di argilla al portatile su una nuvola) + titolo in tre battute",
  "firma_3d": "clay-morbido",
  "scroll": "libero; il cielo cambia ora del giorno con lo scroll",
  "menu": "dock in basso in liquid glass con goccia a due molle + capsula del periodo in alto",
  "loader": "logo che saltella e conta i giorni, poi iride che si chiude sulla mascotte",
  "cursore": "nativo + pulsanti magnetici",
  "transizioni": "lastre di vetro che entrano una alla volta, grafici animati sul posto",
  "sfondo": "gradiente-shader-lento (cielo con nuvole)",
  "momenti": ["la mascotte cade sulla nuvola e apre il portatile", "tocchi la mascotte: salta, strizza gli occhi, risponde nel fumetto", "cubetti di token che salgono dalla tastiera", "il cielo arriva al tramonto in fondo alla pagina"],
  "vietato_riusare": ["mascotte di argilla al portatile su una nuvola", "cielo-shader dal mattino al tramonto come sfondo unico", "titolo in tre battute con 'Zero regrets'", "fumetto di vetro che risponde al tocco"]
}
```

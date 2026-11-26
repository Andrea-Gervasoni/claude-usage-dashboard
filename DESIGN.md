# Diario d'uso: design

Tipo: progetto proprio / tech. Direzione scelta da Andrea (non sorteggiata): palette «Cielo», serif elegante, calore in stile Anthropic.

## Idea centrale

Ogni giorno con Claude è un raggio. Sei mesi fanno una scintilla. Scorrendo, gli stessi giorni si aprono in calendario, diventano le colonne dei token, quelle dei costi, le barre dei mesi, e in fondo si richiudono nella scintilla.

I giorni sono un solo insieme di oggetti disegnati su un canvas fisso: non esistono cinque grafici, esiste un grafico che cambia posa. È il momento firma.

## Token

| Nome | Valore | Ruolo |
|---|---|---|
| cielo | `#E9F1F5` | campo chiaro: prima vista, costi, chiusura |
| azzurro polveroso | `#C3D7E2` | campo del calendario, fine della prima vista |
| inchiostro | `#0F1B24` | testo; campo scuro di token e registro |
| arancione | `#DC6A32` | ciò che scrive Claude, i picchi; campo dei modelli |
| blu dei dati | `#B7CAD5` → `#173F59` | scala a cinque passi per l'intensità dei giorni |

Testi: inchiostro `#0F1B24`, secondario `#33455A`, attenuato `#425466`, accento su chiaro `#9A3D14`; su inchiostro `#EAF1F5`, `#A9BCC9`, `#F08A56`. Contrasto minimo 4,5:1 su ogni campo.

Tipografia: Instrument Serif 400 per titoli e cifre grandi; Instrument Sans 400/500/600 per tutto il resto. Scala: 13, 14, 15, 17, 20, 28, `clamp(32,4.1vw,60)`, `clamp(40,5.7vw,88)`. Titoli a −0,02 em, interlinea 1,05; testo 1,5.

Movimento: `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-io: cubic-bezier(.65,0,.35,1)`, molle a smorzamento critico per ciò che si tocca. Microinterazioni 100–200 ms, scene 0,9–1,3 s.

Forme: fogli con raggio 36 px che salgono uno sull'altro, capsule per i comandi, celle e colonne con raggio 2–6 px.

## Tre principi

1. **Un solo materiale.** I giorni sono sempre gli stessi oggetti: cambiano posa, mai identità. Ogni passaggio è legato allo scroll, continuo e reversibile.
2. **Un campo per sezione.** Cielo, azzurro, inchiostro, cielo, arancione, inchiostro, cielo. Ogni sezione ha il suo colore pieno e la sua entrata; restano uguali le curve e le durate.
3. **Vetro solo dove si preme.** Liquid glass per marchio, periodo e menu: rifrazione ai bordi (Chromium), bordo luminoso che gira verso il puntatore, indicatore a goccia con due molle, vetro che cede con la velocità dello scroll, tinta che si adatta al campo sotto.

## Entrate

| Sezione | Giorni (canvas) | Titolo |
|---|---|---|
| Apertura | i raggi si compongono mentre un contatore legge i giorni; il buio si chiude nel centro della scintilla | parole che salgono da una maschera |
| Calendario | i raggi volano nelle celle | tendina orizzontale |
| Token | le celle cadono in colonne a strati | tendina dall'alto |
| Costi | le colonne si riordinano; la linea del totale si disegna con lo scroll | parole che si ribaltano |
| Mesi | i giorni si allineano dentro la barra del loro mese | (sottotitolo fermo) |
| Modelli | barre che si allungano | parole da sinistra |
| Registro | righe che si aprono a cascata | tendina dall'alto |
| Chiusura | i giorni tornano scintilla | parole che salgono |

## Vietato

- Numeri romani, etichette maiuscole spaziate, stringhe con il puntino centrale, frecce decorative.
- Card uguali in fila, pillole e badge decorativi, puntini che brillano, gradienti blu-viola.
- Tooltip che segue il puntatore: ogni grafico ha una riga di lettura a posto fisso.
- Vetro su pannelli di contenuto.
- Decorazioni senza dati: ogni forma in movimento è un giorno vero di `history.json`.
- Dal registro: lente che rivela un secondo strato, punto che rimbalza nel logo, firma che si scrive, low-poly, linee di livello.

## Impronta per `registro.json`

```json
{
  "nome": "Diario d'uso (dashboard locale Claude Code)",
  "data": "2026-11",
  "percorso": "~/claude-usage-dashboard",
  "idea": "Ogni giorno è un raggio: la scintilla dei sei mesi si apre in calendario, colonne e barre con lo scroll, e si richiude in fondo.",
  "direzione": "cielo (scelta da Andrea, fuori catalogo)",
  "font_display": "Instrument Serif",
  "font_testo": "Instrument Sans",
  "palette": ["#E9F1F5", "#C3D7E2", "#0F1B24", "#DC6A32", "#173F59"],
  "palette_tipo": "cielo chiaro + azzurro polveroso + inchiostro, arancione per ciò che scrive Claude",
  "hero": "scintilla di dati inclinata nello spazio (un raggio per giorno) accanto a una frase",
  "firma_3d": "nessuna libreria: canvas 2D con proiezione prospettica",
  "scroll": "libero, con un solo palcoscenico fisso i cui oggetti cambiano posa fra le sezioni",
  "menu": "dock in basso in liquid glass con goccia a due molle + capsula del periodo in alto",
  "loader": "contatore dei giorni letti mentre la scintilla si compone, poi iride che si chiude nel suo centro",
  "cursore": "nativo + pulsanti magnetici",
  "transizioni": "campi pieni che salgono come fogli, giorni che volano da un grafico al successivo",
  "sfondo": "campi di colore pieni, uno per sezione",
  "momenti": ["i raggi della scintilla diventano le celle del calendario", "le celle cadono in colonne a strati", "i giorni si allineano nelle barre dei mesi", "la scintilla si ricompone in chiusura"],
  "vietato_riusare": ["scintilla radiale di dati come hero", "stessi oggetti che cambiano posa fra i grafici", "iride che si chiude nel centro dell'oggetto firma", "campi cielo / inchiostro / arancione alternati"]
}
```

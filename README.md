# Livada 🌿

**Mirna igra za male ruke.** Aplikacija za decu od 1,5 do 3 godine — bez reklama,
bez naloga, bez interneta i bez prestimulacije.

Inspirisana je idejom "telefon za bebe" (Billy Bo i slične), ali ide u drugom
pravcu: umesto jarkih boja, brzih animacija i stalnih nagrada, sve ovde je
usporeno, utišano i svedeno na jednu jasnu poruku — *ti si dodirnuo, i nešto se
desilo.*

---

## Šta dete može da radi

| Ekran | Šta se dešava |
| --- | --- |
| **Telefon** | Bira jednu od osam životinja, čuje zvono, i životinja se javi. Dodir na lik → odgovori ponovo. Veliko dugme „Gotovo" prekida poziv. |
| **Poruke** | Piše životinjama sličicama (srce, sunce, lopta, jabuka…). Svaka poslata sličica dobije odgovor koji ima smisla: kiša → sunce, jabuka → kolač, ruka → srce. |
| **Moj glas** | Jedan ogroman krug. Dodir → snima do 5 sekundi (prsten se puni, oreol pulsira na glas deteta) → odmah se pušta **pištavo**. Tri dugmeta za ponavljanje: pištavo, normalno, duboko. |
| **Dugmići** | Šest velikih dugmadi i šest različitih odgovora: zvono zazvoni, svetlo osvetli ceo ekran, balon odleti, bubanj tupne, voda kapne, zvezda zasvetluca. Nijedno se ne ponaša isto. |
| **Skrivalice** | Četiri brežuljka. Dodir → drug iskoči, pozdravi se, pa se sam sakrije. Ne postoji pogrešan brežuljak. |

## Kako je pravljeno da ne prestimuliše

- **Prigušena paleta.** Nema čiste bele, čiste crne ni zasićenih „igračkastih"
  boja. Ništa ne blinka i ništa ne svetli.
- **Zvuk se sintetiše, ne pušta iz snimaka.** Svaki ton ima mek napad i mek
  kraj, a ceo audio prolazi kroz limiter — ne postoji način da nešto iznenada
  prasne u uho detetu koje drži tablet uz lice.
- **Jedna radnja → jedan odgovor.** Nema bodova, nema tajmera koji juri, nema
  gubljenja, nema ekrana sa kojeg se ne može nazad.
- **Sporo.** Animacije traju 300–700 ms i imaju razlog. „Još mirnije" u
  roditeljskom delu usporava sve dodatno i stišava zvuk.
- **Poštuje se `prefers-reduced-motion`** sa nivoa operativnog sistema.
- **Velike mete.** Ništa što dete treba da pogodi nije manje od ~104 px.

## Za roditelje

Roditeljski deo se otvara **držanjem lista u gornjem desnom uglu 2 sekunde**.
Dete tapka — ne drži prst mirno dve sekunde — pa ovo funkcioniše kao brava bez
PIN-a koji se zaboravlja.

Unutra: jačina zvuka, govor uključen/isključen, „još mirnije", podsetnik za
pauzu (isključen / 10 / 20 / 30 min), jezik (srpski / English) i dugme za
instalaciju na početni ekran.

Podsetnik za pauzu ne odbrojava pred detetom: igra se jednostavno zaustavi na
tihoj slici, a nastavlja je samo odrasla osoba držanjem prsta.

### Privatnost

Nema reklama, nema naloga, nema analitike, nema mrežnih poziva. Snimak glasa
postoji **samo u memoriji uređaja** dok traje igra i briše se čim se izađe sa
ekrana „Moj glas" — nikada ne postaje fajl i nikuda se ne šalje. Jedino što se
čuva je `localStorage` zapis sa roditeljskim podešavanjima.

---

## Pokretanje

```bash
npm install
npm run dev        # razvojni server
npm run build      # produkcijski build u dist/
npm run preview    # posluži build lokalno (--host za telefon na istoj mreži)
npm run typecheck
```

Zahteva Node 18+.

## Kao aplikacija

Livada je PWA: `manifest.webmanifest`, service worker koji kešira sve što je
jednom učitano, `display: fullscreen`, wake lock (ekran se ne gasi), i
zaključan zoom i scroll.

**Na telefonu/tabletu:** otvoriti build i izabrati „Dodaj na početni ekran"
(dugme postoji i u roditeljskom delu na Androidu/Chromeu). Posle toga radi i u
avionskom režimu.

**Kao nativna aplikacija (Google Play / App Store)** — `base: './'` u
`vite.config.ts` znači da build radi i iz WebView-a bez ijedne izmene:

```bash
npm i -D @capacitor/cli
npm i @capacitor/core @capacitor/android @capacitor/ios
npx cap init Livada rs.livada.app --web-dir=dist
npm run build && npx cap add android && npx cap sync
npx cap open android
```

Za nativni build treba dodati dozvolu za mikrofon: `RECORD_AUDIO` u
`AndroidManifest.xml`, odnosno `NSMicrophoneUsageDescription` u `Info.plist`.

---

## Struktura

```
src/
  audio/
    engine.ts      Web Audio: limiter, meki tonovi, šum, zajednički zvuci
    voices.ts      glasovi životinja (sintetisani, ne snimci)
    speech.ts      izgovor kroz sistemski sintetizator (opciono)
    recorder.ts    mikrofon → AudioBuffer → reprodukcija sa promenom visine
  components/
    art/Animal.tsx  osam likova kao inline SVG (trepću, mrdaju ustima)
    art/Pictos.tsx  dvanaest sličica — "azbuka" za decu koja ne čitaju
    art/Icons.tsx   ikone interfejsa
    ui/             zaglavlje, roditeljska vrata, podešavanja, pauza, start
  screens/          pet aktivnosti
  data/animals.ts   likovi, imena, boje
  i18n/strings.ts   sav tekst, sr + en
  state/settings.tsx roditeljska podešavanja (localStorage)
  styles/global.css  paleta, ritam animacija, rasporedi
public/
  sw.js, manifest.webmanifest, icons/
```

### Dodavanje nove životinje

1. Dopuniti `AnimalId` i listu u `src/data/animals.ts` (ime, boje, scena).
2. Nacrtati lice u `src/components/art/Animal.tsx` (viewBox 100×100) i upisati
   ga u `FACES`.
3. Dodati glas u `src/audio/voices.ts`.

Time se lik automatski pojavljuje u Telefonu, Porukama i Skrivalicama.

### Dodavanje nove sličice u Poruke

Dopuniti `PictoId`, `PICTOS` i `SHAPES` u `src/components/art/Pictos.tsx`, pa
dodati red u `REPLIES` u `src/screens/Messages.tsx` — tako sličica dobija
odgovor koji ima smisla, umesto nasumičnog.

---

## In English, briefly

Livada is a calm, offline-first play app for toddlers aged 1.5–3: pretend phone
calls with animals, picture messaging, a record-your-voice-and-hear-it-squeaky
toy, six big buttons that each do something different, and peekaboo. Muted
palette, synthesised audio behind a limiter, slow motion, no scores, no ads, no
network. Serbian and English. Built with React + TypeScript + Vite, ships as a
PWA and drops straight into Capacitor for the stores.

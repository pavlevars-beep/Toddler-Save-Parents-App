/**
 * Every word in the app, in Serbian (default) and English.
 *
 * Children this age cannot read, so the UI text exists for two audiences:
 * the parent (menus, settings) and the speech synthesiser (short, spoken
 * phrases). Both languages are kept deliberately short and concrete.
 */

export type Lang = 'sr' | 'en'

export interface Strings {
  appName: string
  tagline: string
  screens: {
    phone: string
    messages: string
    voice: string
    buttons: string
    peekaboo: string
  }
  screenHints: {
    phone: string
    messages: string
    voice: string
    buttons: string
    peekaboo: string
  }
  common: {
    back: string
    home: string
    forParents: string
    holdToOpen: string
    holding: string
    close: string
    tapToStart: string
  }
  phone: {
    whoToCall: string
    calling: string
    ringing: string
    hangUp: string
    callAgain: string
    talkPrompt: string
  }
  messages: {
    title: string
    pickFriend: string
    tapPicture: string
    sent: string
  }
  voice: {
    title: string
    tapToRecord: string
    listening: string
    playing: string
    again: string
    squeaky: string
    deep: string
    normal: string
    micBlocked: string
    micBlockedHelp: string
    micMissing: string
  }
  buttons: {
    bell: string
    lamp: string
    balloon: string
    drum: string
    water: string
    star: string
  }
  peekaboo: {
    title: string
    here: string
    where: string
  }
  parents: {
    title: string
    volume: string
    speech: string
    speechOn: string
    speechOff: string
    calmMode: string
    calmModeHelp: string
    language: string
    playTime: string
    playTimeOff: string
    minutes: string
    about: string
    aboutText: string
    privacy: string
    privacyText: string
    exit: string
    version: string
    install: string
    installHelp: string
  }
  pause: {
    title: string
    body: string
    continue: string
    holdToContinue: string
  }
  /** Short lines the animals say. {name} is replaced with the animal name. */
  animalLines: {
    greeting: string[]
    chat: string[]
    bye: string[]
  }
}

const sr: Strings = {
  appName: 'Livada',
  tagline: 'Mirna igra za male ruke',
  screens: {
    phone: 'Telefon',
    messages: 'Poruke',
    voice: 'Moj glas',
    buttons: 'Dugmići',
    peekaboo: 'Skrivalice',
  },
  screenHints: {
    phone: 'Pozovi životinju',
    messages: 'Šalji sličice',
    voice: 'Snimi i slušaj',
    buttons: 'Pritisni i slušaj',
    peekaboo: 'Ko se krije?',
  },
  common: {
    back: 'Nazad',
    home: 'Početak',
    forParents: 'Za roditelje',
    holdToOpen: 'Drži prstom',
    holding: 'Još malo…',
    close: 'Zatvori',
    tapToStart: 'Dodirni da počnemo',
  },
  phone: {
    whoToCall: 'Koga zoveš?',
    calling: 'Zovem…',
    ringing: 'Zvoni…',
    hangUp: 'Gotovo',
    callAgain: 'Zovi ponovo',
    talkPrompt: 'Dodirni druga da odgovori',
  },
  messages: {
    title: 'Poruke',
    pickFriend: 'Kome pišeš?',
    tapPicture: 'Dodirni sličicu',
    sent: 'Poslato',
  },
  voice: {
    title: 'Moj glas',
    tapToRecord: 'Dodirni i pričaj',
    listening: 'Slušam te…',
    playing: 'Evo te!',
    again: 'Još jednom',
    squeaky: 'Pištavo',
    deep: 'Duboko',
    normal: 'Moj glas',
    micBlocked: 'Mikrofon nije dozvoljen',
    micBlockedHelp: 'Dozvolite pristup mikrofonu u podešavanjima pregledača, pa se vratite na ovaj ekran.',
    micMissing: 'Ovaj uređaj nema mikrofon koji možemo da koristimo.',
  },
  buttons: {
    bell: 'Zvono',
    lamp: 'Svetlo',
    balloon: 'Balon',
    drum: 'Bubanj',
    water: 'Voda',
    star: 'Zvezda',
  },
  peekaboo: {
    title: 'Skrivalice',
    here: 'Tu sam!',
    where: 'Gde si?',
  },
  parents: {
    title: 'Za roditelje',
    volume: 'Jačina zvuka',
    speech: 'Govor',
    speechOn: 'Uključen',
    speechOff: 'Isključen',
    calmMode: 'Još mirnije',
    calmModeHelp: 'Sporiji pokreti, manje animacije, tiši zvuk.',
    language: 'Jezik',
    playTime: 'Podsetnik za pauzu',
    playTimeOff: 'Isključen',
    minutes: 'min',
    about: 'O aplikaciji',
    aboutText:
      'Livada je napravljena za decu od 1,5 do 3 godine. Jedna radnja — jedan jasan odgovor. Bez bodova, bez gubljenja, bez žurbe, bez iznenadnih glasnih zvukova.',
    privacy: 'Privatnost',
    privacyText:
      'Nema reklama, nema naloga, nema interneta. Snimak glasa ostaje u memoriji uređaja dok traje igra i briše se kada izađete sa ekrana. Ništa se nikuda ne šalje.',
    exit: 'Nazad na igru',
    version: 'Verzija',
    install: 'Dodaj na početni ekran',
    installHelp: 'Tako se Livada otvara preko celog ekrana i radi bez interneta.',
  },
  pause: {
    title: 'Vreme je za pauzu',
    body: 'Protegnimo se, popijmo vodu i pogledajmo kroz prozor.',
    continue: 'Nastavi igru',
    holdToContinue: 'Roditelj drži prstom 2 sekunde',
  },
  animalLines: {
    greeting: ['Halo! Ovde {name}.', 'Zdravo! Ja sam {name}.', 'Ćao! {name} te sluša.'],
    chat: ['Baš lepo!', 'Volim te!', 'Hvala ti!', 'Igramo se!', 'Vidimo se!', 'Tako je!'],
    bye: ['Ćao ćao!', 'Vidimo se!', 'Laku noć!'],
  },
}

const en: Strings = {
  appName: 'Livada',
  tagline: 'Calm play for little hands',
  screens: {
    phone: 'Phone',
    messages: 'Messages',
    voice: 'My voice',
    buttons: 'Buttons',
    peekaboo: 'Peekaboo',
  },
  screenHints: {
    phone: 'Call an animal',
    messages: 'Send little pictures',
    voice: 'Record and listen',
    buttons: 'Press and listen',
    peekaboo: 'Who is hiding?',
  },
  common: {
    back: 'Back',
    home: 'Home',
    forParents: 'For parents',
    holdToOpen: 'Hold your finger',
    holding: 'Almost…',
    close: 'Close',
    tapToStart: 'Tap to start',
  },
  phone: {
    whoToCall: 'Who are you calling?',
    calling: 'Calling…',
    ringing: 'Ringing…',
    hangUp: 'Done',
    callAgain: 'Call again',
    talkPrompt: 'Tap your friend to hear them',
  },
  messages: {
    title: 'Messages',
    pickFriend: 'Who are you writing to?',
    tapPicture: 'Tap a picture',
    sent: 'Sent',
  },
  voice: {
    title: 'My voice',
    tapToRecord: 'Tap and talk',
    listening: 'Listening…',
    playing: 'That is you!',
    again: 'Again',
    squeaky: 'Squeaky',
    deep: 'Deep',
    normal: 'My voice',
    micBlocked: 'Microphone is blocked',
    micBlockedHelp: 'Allow microphone access in your browser settings, then come back to this screen.',
    micMissing: 'This device has no microphone we can use.',
  },
  buttons: {
    bell: 'Bell',
    lamp: 'Light',
    balloon: 'Balloon',
    drum: 'Drum',
    water: 'Water',
    star: 'Star',
  },
  peekaboo: {
    title: 'Peekaboo',
    here: 'Here I am!',
    where: 'Where are you?',
  },
  parents: {
    title: 'For parents',
    volume: 'Volume',
    speech: 'Speech',
    speechOn: 'On',
    speechOff: 'Off',
    calmMode: 'Extra calm',
    calmModeHelp: 'Slower motion, less animation, quieter sound.',
    language: 'Language',
    playTime: 'Break reminder',
    playTimeOff: 'Off',
    minutes: 'min',
    about: 'About',
    aboutText:
      'Livada is made for children aged 1.5 to 3. One action — one clear answer. No points, no losing, no hurry, no sudden loud sounds.',
    privacy: 'Privacy',
    privacyText:
      'No ads, no accounts, no internet. A voice recording stays in the device memory while you play and is erased when you leave the screen. Nothing is ever sent anywhere.',
    exit: 'Back to play',
    version: 'Version',
    install: 'Add to home screen',
    installHelp: 'Livada then opens full screen and works without internet.',
  },
  pause: {
    title: 'Time for a break',
    body: 'Let us stretch, drink some water and look out of the window.',
    continue: 'Keep playing',
    holdToContinue: 'A grown-up holds for 2 seconds',
  },
  animalLines: {
    greeting: ['Hello! This is {name}.', 'Hi! I am {name}.', 'Hey! {name} is listening.'],
    chat: ['So nice!', 'I like that!', 'Thank you!', 'We are playing!', 'See you!', 'That is right!'],
    bye: ['Bye bye!', 'See you!', 'Good night!'],
  },
}

export const STRINGS: Record<Lang, Strings> = { sr, en }

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}

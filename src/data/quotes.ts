export interface Quote {
  text: string;
  author: string;
  source: string;
}

export const quotes: Quote[] = [
  {
    text: "Warum do we do theater?",
    author: "Peter Brook",
    source: "interview (KUNC), 6 Oct 2019",
  },
  {
    text: "…als ich dich fragte, warum du zu uns ins Theater kommst.",
    author: "Bertolt Brecht",
    source: "Messingkauf, zitiert auf volksbuehne.berlin",
  },
  {
    text: "Den Vorhang zu und alle Fragen offen.",
    author: "Bertolt Brecht",
    source: "Der gute Mensch von Sezuan (Schluss), zitiert bei fluter.de",
  },
  {
    text: "Is the point of a rehearsal to be comfortable?",
    author: "Anne Bogart",
    source: "A Director Prepares (PDF-Auszug „Resistance")",
  },
  {
    text: "less interested in the way people move, as to what moves them",
    author: "Pina Bausch",
    source: "Interview zu NELKEN (Pina Bausch Foundation Archive PDF), 31 Aug 1995",
  },
  {
    text: "Dramaturgy is for me learning to handle complexity.",
    author: "Marianne Van Kerkhoven",
    source: "What Is Dramaturgy? (Essay online)",
  },
  {
    text: "feeding the ongoing conversation on the work",
    author: "Marianne Van Kerkhoven",
    source: "zitiert in „Dramaturgy and artistic research: Methods and frictions"",
  },
  {
    text: "a production of problems",
    author: "Bojana Cvejić",
    source: "zugeschrieben in Didaskalia („Dramaturgy Like a Ghost?")",
  },
  {
    text: "Why do we sacrifice so much energy to our art?",
    author: "Jerzy Grotowski",
    source: "Statement of Principles (Textauszug online)",
  },
  {
    text: "Was ist Theater und was ist Leben? Wir wissen es nicht …",
    author: "Heiner Müller",
    source: "zugeschrieben, in Liebes Publikum, ETA Hoffmann Theater Bamberg (PDF), 2022",
  },
  {
    text: "ask timely, salient, challenging, productive questions",
    author: "Jonathan Meth",
    source: "Interview/Podcast-Transkript (thendobetter.com), 13 May 2021",
  },
  {
    text: "Warum sind wir bereits am Ende des Stückes?",
    author: "René Pollesch",
    source: "Ich weiss nicht, was ein Ort ist, ich kenne nur seinen Preis, Schauspielhaus Zürich (2018)",
  },
  {
    text: "Macht man Theater für die auf der Bühne oder fürs Publikum?",
    author: "René Pollesch",
    source: "Interview in taz („Meine Texte sind Sehhilfen für die Wirklichkeit"), 15.01.2014",
  },
];

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

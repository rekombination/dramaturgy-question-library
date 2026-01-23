export interface Quote {
  text: string;
  author: string;
  source?: string; // Optional source field for reference only
}

export const quotes: Quote[] = [
  {
    text: "Why do we do theater?",
    author: "Peter Brook",
    source: "The Empty Space",
  },
  {
    text: "What is it all about?",
    author: "Peter Brook",
    source: "The Empty Space",
  },
  {
    text: "Is the point of a rehearsal to be comfortable?",
    author: "Anne Bogart",
    source: "A Director Prepares",
  },
  {
    text: "Du hast noch kein Wort dazu gesagt, als ich dich fragte, warum du zu uns ins Theater kommst.",
    author: "Bertolt Brecht",
    source: "Der Messingkauf",
  },
  {
    text: "Warum sind wir bereits am Ende des Stückes?",
    author: "René Pollesch",
    source: "Various Productions",
  },
  {
    text: "Macht man Theater für die auf der Bühne oder fürs Publikum?",
    author: "René Pollesch",
    source: "Various Productions",
  },
  {
    text: "Meine Frage ist jetzt, wie kann man … eine Kommunikation aufbauen?",
    author: "René Pollesch",
    source: "Various Productions",
  },
  {
    text: "Dramaturgy is for me learning to handle complexity.",
    author: "Marianne Van Kerkhoven",
    source: "On Dramaturgy",
  },
  {
    text: "I defined 'dramaturgy' … [as] the work of the actions.",
    author: "Eugenio Barba",
    source: "The Paper Canoe",
  },
  {
    text: "What is performance? What is Performance Studies (PS)?",
    author: "Richard Schechner",
    source: "Performance Studies: An Introduction",
  },
  {
    text: "What do you do when you are alone, when you are tender?",
    author: "Pina Bausch",
    source: "Various Interviews",
  },
];

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

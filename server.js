const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const namesList = [
   "Mr. Albornoz","Ms. Andrews","Mr. Baier","Mr. Barker","Ms. Biron",
   "Mrs. Blackburn","Mr. Bridges","Mr. Brown","Mr. Burns","Mr. Bahamon",
   "Dr. Barbera","Mr. Chiapetta","Mr. Cohen","Dr. Conderacci","Mr. Cucuzzella",
   "Mr. DelGaudio","Dr. Donovan","Ms. Elmore","Dr. Fastuca","Ms. Field",
   "Mr. Flanigan","Mr. Fusco","Ms. Guiglio Bonilla","Ms. Hart","Mr. Hattrup",
   "Mr. Hoehler","Dr. Hufford","Ms. Jefferson","Mr. Jung","Mr. Knapp",
   "Ms. La Canfora","Mr. Lehr","Ms. Love","Mr. Medina","Mrs. Noyola-Gonzalez",
   "Mr. O'Dwyer","Mr. Paniccia","Ms. Pearson","Mrs. Philipp","Mr. Pierce",
   "Mrs. Pipkin","Mr. Poppiti","Mr. Prieto-Alonso","Mr. Pyzik","Ms. Reed",
   "Mrs. Roberts","Mrs. Smith","Ms. Stone","Mrs. Tisdale","Mr. Trzcinski",
   "Mr. Vella-Camilleri","Mrs. Volpe","Ms. Wallace","Ms. Warfield","Mr. Weber",
   "Mrs. Wise","Mrs. Yancisin"
];

// game state
let totalPlayers = 0;
let imposterIndex = null;
let sharedName = null;
let currentIndex = 0;

function startGame(n) {
  n = Math.max(3, Math.min(parseInt(n) || 5, namesList.length));
  totalPlayers = n;
  imposterIndex = Math.floor(Math.random() * n);
  sharedName = namesList[Math.floor(Math.random() * namesList.length)];
  currentIndex = 0;
}

// serve static client from public/
app.use(express.static(path.join(__dirname, 'public')));

app.post('/new_game', (req, res) => {
  let n = req.body && req.body.numberOfPlayers !== undefined ? req.body.numberOfPlayers : req.query.numberOfPlayers;
  try { n = parseInt(n); } catch (e) { n = 5; }
  if (isNaN(n)) n = 5;
  startGame(n);
  res.json({ success: true, players: totalPlayers });
});

app.get('/show_name', (req, res) => {
  if (totalPlayers === 0) return res.status(400).json({ error: 'No game created' });
  const name = (currentIndex === imposterIndex) ? 'Imposter' : sharedName;
  const returnedIndex = currentIndex;
  currentIndex = (currentIndex + 1) % totalPlayers;
  res.json({ name, index: returnedIndex, isImposter: (name === 'Imposter') });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Imposter server listening on http://localhost:${PORT}`));

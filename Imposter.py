from flask import Flask, render_template, request, jsonify
import random

namesList = [
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
]

app = Flask(__name__)

# game state
total_players = 0
imposter_index = None
shared_name = None
current_index = 0


def start_game(n):
   global total_players, imposter_index, shared_name, current_index
   n = max(3, min(int(n), len(namesList)))  # clamp to valid range
   total_players = n
   imposter_index = random.randrange(n)
   shared_name = random.choice(namesList)
   current_index = 0


@app.route('/')
def index():
   return render_template('format.html')


@app.route('/new_game', methods=['POST'])
def new_game_route():
   data = request.get_json() or request.form
   try:
      n = int(data.get('numberOfPlayers', 5))
   except Exception:
      n = 5
   start_game(n)
   return jsonify(success=True, players=total_players)


@app.route('/show_name', methods=['GET'])
def show_name_route():
   global current_index
   if total_players == 0:
      return jsonify(error="No game created"), 400
   # determine what this player should see
   if current_index == imposter_index:
      name = "Imposter"
   else:
      name = shared_name
   returned_index = current_index
   current_index = (current_index + 1) % total_players
   return jsonify(name=name, index=returned_index, isImposter=(name == "Imposter"))


if __name__ == '__main__':
   app.run(debug=True)

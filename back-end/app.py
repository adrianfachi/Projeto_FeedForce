from flask import Flask, request, jsonify
from flask_cors import CORS  # Adicionado
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Supabase config (mantenha chave secreta segura em produção)
SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A"  # mantenha privada

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/buscar_usuario')
def buscar_usuario():
    nome = request.args.get("nome")
    if not nome:
        return jsonify({"error": "Parâmetro nome é obrigatório"}), 400

    resposta = supabase.table("users").select("id").ilike("user_name", f"%{nome}%").limit(1).execute()
    
    if resposta.error or len(resposta.data) == 0:
        return jsonify({"error": "Usuário não encontrado"}), 404

    return jsonify({"id": resposta.data[0]["id"]})


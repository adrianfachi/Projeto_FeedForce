import json
import re
from transformers import pipeline
from supabase import create_client, Client
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Essencial para permitir o acesso do frontend

# --- CONFIGURAÇÕES DA SUPABASE ---
SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Inicializar modelo de classificação ---
classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

def preprocess_text(text: str) -> str:
    """Limpeza do texto: remove links e caracteres especiais."""
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-ZÀ-ÿ\s]", "", text)
    return text.strip()

def sentiment_to_score(label: str) -> int:
    """Converte o rótulo de sentimento para um score numérico."""
    if label in ["1 star", "2 stars"]:
        return 0  # Negativo
    elif label == "3 stars":
        return 1  # Neutro
    else:
        return 2  # Positivo

def detect_entity(text: str) -> str:
    """Detecta entidade mencionada no texto."""
    empresas = ["empresa A", "empresa B", "produto X"]
    for entidade in empresas:
        if entidade.lower() in text.lower():
            return entidade
    return "Desconhecido"

def process_feedback_item(item: dict) -> dict:
    """Processa um item de feedback bruto em um dicionário formatado."""
    numero = item['numero']
    datetime = item['datetime']
    raw_text = item['text']
    clean_text = preprocess_text(raw_text)

    result = classifier(clean_text)[0]
    nota = sentiment_to_score(result['label'])
    entidade = detect_entity(clean_text)

    return {
        "id_evaluator": numero,  # Nome do usuário
        "feedback": clean_text,   # Texto do feedback
        "score": nota,           # Sentimento convertido em score
        "id_user": entidade      # Entidade detectada no texto
    }

@app.route("/processar-feedback", methods=["POST"])
def processar_feedback():
    # Obtém os dados do request
    data = request.json
    print("DADOS RECEBIDOS:", data)

    nome = data.get("nome")
    texto = data.get("mensagem")  # Alterei para 'mensagem', conforme o nome enviado no JSON
    datahora = data.get("datetime")

    # Verificação se os campos estão presentes
    if not nome or not texto or not datahora:
        return jsonify({"status": "erro", "detalhes": "Dados incompletos: nome, mensagem ou datetime faltando"}), 400

    # Criação do item a ser processado
    item = {
        "numero": nome,
        "datetime": datahora,
        "text": texto
    }

    try:
        # Processa o feedback com as funções definidas
        processado = process_feedback_item(item)
        
        # Envia os dados processados para o Supabase
        response = supabase.table("feedbacks").insert(processado).execute()
        
        # Verificando a resposta do Supabase
        if response.data:
            return jsonify({"status": "ok", "feedback": processado}), 200
        else:
            print(f"Erro na inserção: {response.error}")  # Log do erro
            return jsonify({"status": "erro", "detalhes": response.error}), 500

    except Exception as e:
        # Captura e exibe o erro de execução
        print(f"Erro ao processar feedback: {str(e)}")
        return jsonify({"status": "erro", "detalhes": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
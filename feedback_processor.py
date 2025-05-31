import json
import re
from transformers import pipeline
from supabase import create_client, Client

# --- CONFIGURAÇÕES DA SUPABASE ---
SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co/"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

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
        "id_evaluator": numero,
        "feedback": clean_text,
        "score": nota,
        "id_user": entidade
    }

def process_feedback_file(filepath: str) -> list:
    """Processa um arquivo JSON de feedbacks."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    processed_data = [process_feedback_item(item) for item in data]
    return processed_data

def send_to_supabase(data: list):
    """Envia lista de feedbacks processados para Supabase."""
    for item in data:
        response = supabase.table('feedbacks').insert(item).execute()
        print(f"Enviado: {item} | Resposta: {response}")
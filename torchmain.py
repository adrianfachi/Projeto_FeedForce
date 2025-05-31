import json
import re
from transformers import pipeline
from supabase import create_client, Client

# --- CONFIGURAÇÕES DA SUPABASE ---
SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co/"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Função de pré-processamento ---
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)  # Remove links
    text = re.sub(r"[^a-zA-ZÀ-ÿ\s]", "", text)  # Remove caracteres especiais
    return text.strip()

# --- Carregar modelo de sentimento ---
classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# --- Função para converter para nota 0-2 ---
def sentiment_to_score(label):
    if label in ["1 star", "2 stars"]:
        return 0  # Negativo
    elif label == "3 stars":
        return 1  # Neutro
    else:
        return 2  # Positivo

# --- Função para detectar entidade (quem se fala) ---
def detect_entity(text):
    empresas = ["empresa A", "empresa B", "produto X"]  # ajuste conforme seu contexto
    for entidade in empresas:
        if entidade.lower() in text.lower():
            return entidade
    return "Desconhecido"

# --- Carregar e processar JSON ---
with open('whatsapp_feedback.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

processed_data = []

for item in data:
    numero = item['numero']
    datetime = item['datetime']
    raw_text = item['text']
    clean_text = preprocess_text(raw_text)

    # Classificação de sentimento
    result = classifier(clean_text)[0]
    nota = sentiment_to_score(result['label'])

    # Entidade
    entidade = detect_entity(clean_text)

    # Montar o dicionário para envio
    processed_data.append({
        "id_evaluator": numero,
        "feedback": clean_text,
        "score": nota,
        "id_user": entidade
    })

# --- Enviar para Supabase ---
for item in processed_data:
    response = supabase.table('feedbacks').insert(item).execute()
    print(f"Enviado: {item} | Resposta: {response}")
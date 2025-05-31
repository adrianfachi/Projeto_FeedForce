
from supabase import create_client, Client

# 🔐 Coloque suas chaves diretamente ou use dotenv/env
SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_user(user_name, user_email, user_password, user_role, user_cellphone):
    data = {
        "user_name": user_name,
        "user_password": user_password,
        "user_email": user_email,
        "user_role": user_role,
        "user_cellphone": user_cellphone,
        "user_total_score": 0
    }
    try:
        response = supabase.table("users").insert(data).execute()
        return response.data
    except Exception as e:
        raise Exception(f"Erro ao criar usuário: {str(e)}")

def login_user(user_email, user_password):
    try:
        response = supabase.table("users") \
            .select("*") \
            .eq("user_email", user_email) \
            .eq("user_password", user_password) \
            .single() \
            .execute()

        user = response.data
        if user:
            return {
                "success": True,
                "message": "Login bem-sucedido",
                "user": {
                    "id": user["id"],
                    "user_name": user["user_name"],
                    "user_email": user["user_email"],
                    "user_role": user["user_role"]
                }
            }
        else:
            return {
                "success": False,
                "message": "E-mail ou senha inválidos"
            }

    except Exception as e:
        return {
            "success": False,
            "message": f"Erro ao tentar login: {str(e)}"
        }

def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        raise Exception(f"Erro ao buscar usuários: {str(e)}")

def get_user_by_id(user_id):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        return response.data
    except Exception as e:
        raise Exception(f"Erro ao buscar usuário: {str(e)}")

def update_user(user_id, user_name=None, user_password=None, user_email=None,
                user_total_score=None, user_role=None, user_cellphone=None):
    update_data = {}
    if user_name is not None: update_data["user_name"] = user_name
    if user_password is not None: update_data["user_password"] = user_password
    if user_email is not None: update_data["user_email"] = user_email
    if user_total_score is not None: update_data["user_total_score"] = user_total_score
    if user_role is not None: update_data["user_role"] = user_role
    if user_cellphone is not None: update_data["user_cellphone"] = user_cellphone

    if not update_data:
        raise ValueError("Nenhum campo para atualizar foi fornecido.")

    try:
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        return response.data
    except Exception as e:
        raise Exception(f"Erro ao atualizar usuário: {str(e)}")

def delete_user(user_id):
    try:
        supabase.table("users").delete().eq("id", user_id).execute()
        return {"detail": "Usuário deletado com sucesso"}
    except Exception as e:
        raise Exception(f"Erro ao deletar usuário: {str(e)}")

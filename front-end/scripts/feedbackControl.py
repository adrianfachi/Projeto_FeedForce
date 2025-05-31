from supabase import create_client, Client

class SupabaseConnection:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase: Client = create_client(supabase_url, supabase_key)

    def get_user_name_by_user_id(self, table_name: str, user_id: int) -> str:
        """Fetches user_name by user_id."""
        response = self.supabase.table(table_name).select("user_name").eq("id", user_id).limit(1).execute()
        if response.error is not None or not response.data:
            raise Exception(f"Unable to retrieve user_name for user_id {user_id}: {response.error}")
        return response.data[0].get("user_name")

    def update_feedbacks(self, table_name: str, match: dict, user_name: str = None, **kwargs):
        """Updates feedback fields and increases user_total_score accordingly."""
        user_id = match.get("id")
        if not user_id:
            raise ValueError("match must include 'id'")

        # Get user_name from database if not provided
        if not user_name:
            user_name = self.get_user_name_by_user_id(table_name, user_id)
            if not user_name:
                raise ValueError("user_name could not be retrieved")

        allowed_fields = {"feedback", "score", "template"}  # atualize conforme seus campos reais
        feedback_data = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
        feedback_count = len(feedback_data)

        if feedback_count == 0:
            raise ValueError("At least one feedback field must be provided")

        # Get current user_total_score
        current_data = self.supabase.table(table_name).select("user_total_score").match(match).limit(1).execute()
        if current_data.error or not current_data.data:
            raise Exception("Unable to retrieve current user_total_score")

        current_score = current_data.data[0].get("user_total_score", 0)
        new_score = current_score + feedback_count

        # Prepare the update payload
        update_data = {
            "user_name": user_name,
            "user_total_score": new_score,
            **feedback_data
        }

        # Execute update
        response = self.supabase.table(table_name).update(update_data).match(match).execute()
        if response.error:
            raise Exception(response.error.message)
        return response.data

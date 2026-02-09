import asyncio
import os
from supabase import create_client

async def check_tables():
    url = "https://qcdkogcshcbvqpvqzcld.supabase.co"
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not key:
        # Fallback to reading from .env manually if not in env
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
                    key = line.split("=", 1)[1].strip()
                    break
    
    client = create_client(url, key)
    
    tables = [
        "users",
        "trips",
        "itineraries",
        "saved_places",
        "history",
        "feedback",
        "preferences"
    ]
    
    results = {}
    for table in tables:
        try:
            client.table(table).select("*").limit(1).execute()
            results[table] = "EXISTS"
        except Exception as e:
            err = str(e)
            if "PGRST205" in err or "does not exist" in err.lower():
                results[table] = "MISSING"
            else:
                results[table] = f"ERROR: {err[:50]}..."
                
    print("\n--- Database Table Check ---")
    for table, status in results.items():
        print(f"{table:15}: {status}")
    print("----------------------------\n")

if __name__ == "__main__":
    asyncio.run(check_tables())

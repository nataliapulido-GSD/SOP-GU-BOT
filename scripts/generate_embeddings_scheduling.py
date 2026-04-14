import json
import os
from pathlib import Path
from openai import OpenAI
from supabase import create_client
from dotenv import load_dotenv

# Load .env.local from project root
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

# DEBUG
import os
print("DEBUG - OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY")[:20] if os.getenv("OPENAI_API_KEY") else "NOT FOUND")
print("DEBUG - SUPABASE_URL:", os.getenv("SUPABASE_URL"))

# Initialize clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# Load chunks
with open("scripts/chunked_sops_scheduling.json") as f:
    chunks = json.load(f)

print(f"📦 Loaded {len(chunks)} chunks")

# First, insert documents
documents = {
    "doc_001": {"title": "Script Reference List", "file_name": "Script Reference List.pdf"},
    "doc_002": {"title": "Scheduling Foundations Guide", "file_name": "Scheduling Foundations Guide.pdf"}
}

print("\n📝 Inserting documents...")
doc_id_map = {}
for doc_id, doc_info in documents.items():
    result = supabase.table("sop_documents").insert({
        "title": doc_info["title"],
        "file_name": doc_info["file_name"],
        "total_chunks": len([c for c in chunks if c["sop_id"] == doc_id])
    }).execute()
    
    doc_id_map[doc_id] = result.data[0]["id"]
    print(f"   ✅ {doc_info['title']}: {doc_id_map[doc_id]}")

# Generate embeddings and upload in batches
BATCH_SIZE = 10
print(f"\n🔢 Generating embeddings (batch size: {BATCH_SIZE})...")

for i in range(0, len(chunks), BATCH_SIZE):
    batch = chunks[i:i+BATCH_SIZE]
    texts = [chunk["chunk_text"] for chunk in batch]
    
    # Generate embeddings
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    
    # Prepare data for Supabase
    rows = []
    for j, chunk in enumerate(batch):
        rows.append({
            "sop_id": doc_id_map[chunk["sop_id"]],
            "chunk_text": chunk["chunk_text"],
            "chunk_index": chunk["chunk_index"],
            "embedding": response.data[j].embedding,
            "metadata": chunk["metadata"]
        })
    
    # Insert to Supabase
    supabase.table("sop_chunks").insert(rows).execute()
    
    print(f"   ✅ Batch {i//BATCH_SIZE + 1}/{(len(chunks)-1)//BATCH_SIZE + 1} uploaded")

print(f"\n✅ Complete! Uploaded {len(chunks)} chunks with embeddings to Supabase")

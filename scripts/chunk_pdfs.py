import json
import os
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken

# Config
PDF_DIR = os.path.expanduser("~/Documents/GAU SOP")
OUTPUT_FILE = "scripts/chunked_sops.json"

def count_tokens(text):
    encoding = tiktoken.encoding_for_model("gpt-4")
    return len(encoding.encode(text))

def chunk_pdf(pdf_path, doc_id, doc_title):
    print(f"📄 Processing: {doc_title}...")
    
    # Read PDF
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    
    print(f"   Extracted {len(full_text)} characters")
    
    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=count_tokens,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks = splitter.split_text(full_text)
    
    # Format chunks
    result = []
    for i, chunk in enumerate(chunks):
        result.append({
            "sop_id": doc_id,
            "chunk_text": chunk,
            "chunk_index": i,
            "metadata": {
                "title": doc_title,
                "total_chunks": len(chunks),
                "char_count": len(chunk),
                "token_count": count_tokens(chunk)
            }
        })
    
    print(f"   Created {len(chunks)} chunks")
    return result

# Process PDFs
all_chunks = []

# Document 1
chunks1 = chunk_pdf(
    f"{PDF_DIR}/Script Reference List.pdf",
    "doc_001",
    "Script Reference List"
)
all_chunks.extend(chunks1)

# Document 2
chunks2 = chunk_pdf(
    f"{PDF_DIR}/Scheduling Foundations Guide.pdf",
    "doc_002",
    "Scheduling Foundations Guide"
)
all_chunks.extend(chunks2)

# Save to JSON
with open(OUTPUT_FILE, 'w') as f:
    json.dump(all_chunks, f, indent=2)

print(f"\n✅ Total: {len(all_chunks)} chunks from 2 documents")
print(f"💾 Saved to {OUTPUT_FILE}")

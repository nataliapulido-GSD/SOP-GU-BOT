import pytesseract
from pdf2image import convert_from_path
import json
import os

pdf_path = "scripts/Scheduling Foundations Guide.pdf"
output_path = "scripts/chunked_sops_scheduling.json"

print(f"Processing with OCR: {pdf_path}")
print("This may take a few minutes...")

pages = convert_from_path(pdf_path, dpi=200)
print(f"Total pages: {len(pages)}")

full_text = ""
for i, page in enumerate(pages):
    print(f"OCR page {i+1}/{len(pages)}...")
    text = pytesseract.image_to_string(page)
    full_text += text + "\n"

# Chunk the text
chunk_size = 1500
overlap = 200
chunks = []
start = 0
chunk_index = 0

while start < len(full_text):
    end = start + chunk_size
    chunk_text = full_text[start:end]
    if len(chunk_text.strip()) > 100:
        chunks.append({
            "sop_id": "doc_002",
            "chunk_index": chunk_index,
            "chunk_text": chunk_text.strip(),
            "metadata": {"title": "Scheduling Foundations Guide", "total_chunks": 0}
        })
        chunk_index += 1
    start = end - overlap

for c in chunks:
    c["metadata"]["total_chunks"] = len(chunks)

with open(output_path, "w") as f:
    json.dump(chunks, f, indent=2)

print(f"Created {len(chunks)} chunks")
print(f"Saved to {output_path}")

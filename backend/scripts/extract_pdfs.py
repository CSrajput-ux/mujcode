"""
Extract ALL PDFs and check which ones have actual text
"""
import os
import fitz  # PyMuPDF

pdf_folder = r"C:\Users\jkgga\Downloads\engineering course"
output_folder = r"c:\Users\jkgga\OneDrive\Desktop\muj code\backend\pdf_extracted"

os.makedirs(output_folder, exist_ok=True)

pdf_files = sorted([f for f in os.listdir(pdf_folder) if f.lower().endswith('.pdf')])

print(f"Processing {len(pdf_files)} PDFs...")
print("="*80)

stats = []

for pdf_file in pdf_files:
    pdf_path = os.path.join(pdf_folder, pdf_file)
    
    try:
        doc = fitz.open(pdf_path)
        text = ""
        total_chars = 0
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text()
            text += f"\n--- Page {page_num + 1} ---\n"
            text += page_text
            total_chars += len(page_text.strip())
        
        doc.close()
        
        # Save to file
        output_file = os.path.join(output_folder, pdf_file.replace('.pdf', '.txt'))
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        
        status = "✓ Has text" if total_chars > 100 else "✗ Empty/Image-based"
        stats.append({
            'file': pdf_file,
            'chars': total_chars,
            'status': status
        })
        
        print(f"{pdf_file:15} | {len(doc):3} pages | {total_chars:6} chars | {status}")
        
    except Exception as e:
        print(f"{pdf_file:15} | ERROR: {str(e)}")
        stats.append({
            'file': pdf_file,
            'chars': 0,
            'status': f'✗ Error: {str(e)[:30]}'
        })

print("\n" + "="*80)
print("SUMMARY:")
print("="*80)
text_pdfs = [s for s in stats if s['chars'] > 100]
empty_pdfs = [s for s in stats if s['chars'] <= 100]

print(f"PDFs with text content: {len(text_pdfs)}")
print(f"Empty/Image-based PDFs: {len(empty_pdfs)}")

if empty_pdfs:
    print("\nEmpty PDFs (may need OCR):")
    for pdf in empty_pdfs:
        print(f"  - {pdf['file']}")

if text_pdfs:
    print(f"\nPDFs with most content:")
    text_pdfs.sort(key=lambda x: x['chars'], reverse=True)
    for pdf in text_pdfs[:5]:
        print(f"  - {pdf['file']:15} ({pdf['chars']:,} characters)")

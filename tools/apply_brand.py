import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Slate Text Colors
    content = re.sub(r'text-slate-[789]00', 'text-text-primary', content)
    content = re.sub(r'text-slate-[3456]00', 'text-text-muted', content)
    content = re.sub(r'text-slate-[12]00', 'text-surface-bright', content)
    content = re.sub(r'text-slate-50', 'text-surface-bright', content)
    
    # Slate Bg Colors
    content = re.sub(r'bg-slate-[89]00', 'bg-surface-dim', content)
    content = re.sub(r'bg-slate-[12]00', 'bg-surface-dim', content)
    content = re.sub(r'bg-slate-50', 'bg-surface-dim', content)
    
    # White Bg/Text
    content = re.sub(r'bg-white/(\d+)', r'bg-white/\1', content) # keep white alpha backgrounds
    content = re.sub(r'bg-white(?!/)', 'bg-surface-bright', content)
    content = re.sub(r'text-white/(\d+)', r'text-text-primary/\1', content)
    content = re.sub(r'text-white(?!/)', 'text-text-primary', content)
    
    # Force sharp edges
    content = re.sub(r'rounded-(sm|md|lg|xl|2xl|3xl|full|none)', 'rounded-none', content)
    content = re.sub(r'rounded-\[[^\]]+\]', 'rounded-none', content)
    
    # Fix specific bg-primary button text color to be dark
    content = re.sub(r'(bg-primary.*?)text-text-primary', r'\1text-text-on-primary', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    src_dir = os.path.join(os.getcwd(), 'src')
    count = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))
                count += 1
    print(f"Processed {count} files to apply brand guidelines.")

if __name__ == "__main__":
    main()

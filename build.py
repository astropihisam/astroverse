
import json
import re
from pathlib import Path

CONTENT_DIRS = {
    "novel": Path("content/novels"),
    "post": Path("content/posts"),
}

def read_markdown(path, category):
    raw = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n?(.*)\Z", raw, re.S)

    if not match:
        return None

    metadata_text, body = match.groups()
    metadata = {}

    for line in metadata_text.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip("'\"")

    if metadata.get("status", "").lower() != "published":
        return None

    slug = path.stem
    return {
        "title": metadata.get("title", slug),
        "description": metadata.get("description", ""),
        "category": category,
        "slug": slug,
        "body": body.strip(),
        "cover": metadata.get("cover", ""),
    }

items = []

for category, folder in CONTENT_DIRS.items():
    if folder.exists():
        for path in sorted(folder.glob("*.md")):
            item = read_markdown(path, category)
            if item:
                items.append(item)

output = Path("data")
output.mkdir(exist_ok=True)
(output / "creations.json").write_text(
    json.dumps(items, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(f"Built public content: {len(items)} published entries")

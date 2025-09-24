#!/usr/bin/env python3

import urllib.parse

print("🔐 MongoDB Password URL Encoder")
print("=" * 40)

password = input("Inserisci la tua password MongoDB: ")
encoded = urllib.parse.quote(password, safe='')

print(f"\n✅ Password originale: {password}")
print(f"🔗 Password encoded:   {encoded}")
print(f"\n📋 Usa questa nell'URI MongoDB:")
print(f"mongodb+srv://username:{encoded}@cluster.mongodb.net/database")

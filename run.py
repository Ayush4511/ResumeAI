#!/usr/bin/env python3
"""
ResumeAI Setup & Run Script
Run this once to initialize the database, then the app starts automatically.
"""

import subprocess
import sys
import os

print("🚀 Setting up ResumeAI...")

# Install dependencies
print("\n📦 Installing dependencies...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Initialize database
print("\n🗄️  Initializing database...")
from app import init_db
init_db()
print("✅ Database ready!")

print("\n✅ Setup complete!")
print("🌐 Starting server at http://localhost:5000")
print("   Press CTRL+C to stop\n")

# Run the app
os.system(f"{sys.executable} app.py")
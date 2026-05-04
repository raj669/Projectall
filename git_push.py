#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir(r'c:\Users\rajal\OneDrive\Desktop\new')

commands = [
    ['git', 'init'],
    ['git', 'config', 'user.name', 'Copilot'],
    ['git', 'config', 'user.email', '223556219+Copilot@users.noreply.github.com'],
    ['git', 'remote', 'add', 'origin', 'https://github.com/raj669/Projectall.git'],
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'Initial commit\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>'],
    ['git', 'branch', '-M', 'main'],
    ['git', 'push', '-u', 'origin', 'main'],
]

for cmd in commands:
    print(f"\n>>> Running: {' '.join(cmd)}")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        if result.returncode != 0:
            print(f"Command failed with return code {result.returncode}")
    except Exception as e:
        print(f"Error: {e}")

print("\n✅ Git push completed!")

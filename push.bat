@echo off
cd /d "c:\Users\rajal\OneDrive\Desktop\new"
git init
git config user.name "Copilot"
git config user.email "223556219+Copilot@users.noreply.github.com"
git remote add origin https://github.com/raj669/Projectall.git 2>nul || git remote set-url origin https://github.com/raj669/Projectall.git
git add .
git commit -m "Initial commit

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git branch -M main
git push -u origin main

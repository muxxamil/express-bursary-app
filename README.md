# Pre-Installations
- Git Bash: https://gitforwindows.org/
- NVM: https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe
- VsCode: https://code.visualstudio.com/Download
- Node 21.1.0: nvm install 21.1.0 && nvm use 21.1.0
- Xampp: https://sourceforge.net/projects/xampp/files/latest/download
- WSL: wsl --install (you may need to restart your system after installation is done)
- open linux subsystem and install redis:
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis

# Post-Installations
- Install Dependencies: npm i
- Make a new file in project folder named: .env
- Copy everything from .env.example into .env and setup all values according to your environment
- Make sure your redis is up if not then run this command in linux subsystem: sudo service redis-server start
- Start application by 'npm run dev'

# Best Practices for development:
- Always create a new branch from `main` and open a pull request against `main` when finished
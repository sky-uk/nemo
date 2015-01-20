if [ ! -f ~/.nvm/nvm.sh ]; then
    curl https://raw.githubusercontent.com/creationix/nvm/v0.23.0/install.sh | bash
fi

source ~/.nvm/nvm.sh
nvm install
nvm use
npm install
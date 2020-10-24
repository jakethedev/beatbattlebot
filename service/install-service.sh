#!/usr/bin/env bash
# SYSTEMD SETUP

echo "Copying service file to /etc/systemd/system..."
systemd --version
# If you have 236+, uncomment the StandardOutput/Error lines in the service if you'd like to output
# logs and errors to custom locations. Else it's journalctl for you
sudo cp beatbattlebot.service /etc/systemd/system/

echo "Reloading daemon, enabling and starting beatbattlebot service"
sudo systemctl daemon-reload
systemctl status beatbattlebot # It should say 'not loaded'
sudo systemctl enable beatbattlebot
sudo systemctl start beatbattlebot
sleep 1
sudo journalctl -xe
# You should see healthy output and a logged-in message

echo "Setting up logrotate"
sudo ln -s $(pwd)/logrotate.beatbattlebot /etc/logrotate.d/

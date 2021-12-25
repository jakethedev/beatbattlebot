#!/usr/bin/env bash
#### SYSTEMD SETUP
# NOTE If you have 236+, uncomment the StandardOutput/Error lines in the
# service if you'd like to output logs and errors to custom locations. Else
# it's journalctl for you

# Installation of the unit file
echo "=== Systemd version: $(systemd --version) ==="
TARGETDIR="$HOME/.config/systemd/user/"
mkdir -p $TARGETDIR
echo "=== Copying service file to user unit directory [$TARGETDIR] ==="
ln -s $(pwd)/beatbattlebot.service $TARGETDIR

# Enabling, activating, and kickstarting the unit file
systemctl --user daemon-reload
echo "=== The following should say 'not loaded' ==="
systemctl --user status beatbattlebot
echo "=== Enabling beatbattlebot service ==="
systemctl --user enable beatbattlebot
echo "=== Liftoff! ==="
systemctl --user start beatbattlebot
echo "=== Just one second, checking status ==="
sleep 1
systemctl --user status beatbattlebot # It should say 'not loaded'

# Quick logging config
echo "Setting up logrotate"
sudo ln -s $(pwd)/logrotate.beatbattlebot /etc/logrotate.d/

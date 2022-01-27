#!/bin/bash
set -xv

###################################
# Auto updater script for simple projects
#
# Set as a BOT USER cron job, with the
# correct path, and your bot will
# auto update if there's a version
# change (or any package change)
#
# Recommended cron job structure:
# * * * * * /bin/bash /opt/deploy/beatbattlebot/service/autoupdate.sh > /opt/deploy/beatbattlebot/update.log 2>&1
#
###################################

echo "Enterying deploy dir..."
cd /opt/deploy/beatbattlebot
echo "Backing up current package.json..."
cp package.json package.old
echo "Running update..."
git pull
echo "Checking for changes and running restart..."
# Curr issue:
#   + systemctl --user restart beatbattlebot.service
#   Failed to connect to bus: No such file or directory
diff -w package.old package.json || systemctl --user restart beatbattlebot.service
echo "Update attempt complete"

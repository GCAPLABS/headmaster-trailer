#!/usr/bin/env bash
# One-time setup for a fresh machine or cloud session. Safe to run again: it skips what is already there.
set -e
cd "$(dirname "$0")/.."
[ -d node_modules ] || npm ci --no-audit --no-fund
python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow
python3 -c "import faster_whisper" 2>/dev/null || pip install -q faster-whisper || echo "faster-whisper not installed: only research-tools/audit.py needs it"
bash tools/get-clips.sh
[ -f public/film2-mix.wav ] || python3 tools/film2_audio.py .
echo "setup done"

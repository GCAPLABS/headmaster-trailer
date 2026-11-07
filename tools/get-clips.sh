#!/usr/bin/env bash
# Downloads the Mixkit footage the film uses into public/clips (left out of the slim zip to save space).
set -e
cd "$(dirname "$0")/../public" && mkdir -p clips
for id in $(ls ../tools/clip-ids.txt >/dev/null && cat ../tools/clip-ids.txt); do
  [ -s clips/$id.mp4 ] || curl -fsSL -o clips/$id.mp4 "https://assets.mixkit.co/videos/$id/$id-720.mp4"
done
echo done

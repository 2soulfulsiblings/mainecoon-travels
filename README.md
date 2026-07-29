# mainecoon-travels
documenting the life and adventures of my Maine Coons and non-profit, Reed's Beads and Beyond

## SongSync — Live Lyric Translator

A small standalone web app in [`song-translator/`](./song-translator) that plays a song and shows
the lyrics translating line by line as it plays, karaoke-style.

**How to use it:**
1. Open `song-translator/index.html` in a browser (or serve the folder with any static file server).
2. Upload an audio file.
3. Paste the lyrics. Plain text works, but for perfectly timed lyrics paste an **LRC** file
   (lines like `[00:12.50] some lyric line`) — many lyric sites offer this format for download.
4. Pick the original language and the language to translate into, then hit **Sync & Translate**
   and press play. Each line highlights as the song reaches it, and its translation appears
   right underneath, fetched on the fly from the free MyMemory translation API.

No build step, no server, no API key required — it's plain HTML/CSS/JS.

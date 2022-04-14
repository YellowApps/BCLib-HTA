@echo off
taskkill /f /im mshta.exe
ren bclib.hta bclib.old.hta
ren bclib.js bclib.old.js
ren doc.txt doc.old.txt

ren bclib.new.hta bclib.hta
ren bclib.new.js bclib.js
ren doc.new.txt doc.txt

start bclib.hta
@echo off

if %1 equ update (
	taskkill /f /im mshta.exe
	ren bclib.hta bclib.old.hta
	ren bclib.js bclib.old.js
	ren doc.txt doc.old.txt

	ren bclib.new.hta bclib.hta
	ren bclib.new.js bclib.js
	ren doc.new.txt doc.txt

	start bclib.hta
) else if %1 equ setdir (
	setx BCLIB_DIR %cd%
)
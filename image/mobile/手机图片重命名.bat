@echo off&setlocal EnableDelayedExpansion 
set a=1
for /f "delims=" %%i in ('dir /b *.jpg') do ( 
if not "%%~ni"=="%~n0" (
ren "%%i" "background_0!a!.jpg" 
set/a a+=1
) 
)

set a=1
for /f "delims=" %%i in ('dir /b *.png') do ( 
if not "%%~ni"=="%~n0" (
ren "%%i" "background_0!a!.png" 
set/a a+=1
) 
)
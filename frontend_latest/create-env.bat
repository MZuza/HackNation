@echo off
REM Create env.json file

echo { > env.json
echo|set /p=""COMMIT_HASH":" >> env.json
git rev-parse --short=8 HEAD > .tmp
set /p L= < .tmp
del .tmp
echo "%L%", >> env.json
echo|set /p=""COMMIT_DATE":" >> env.json

for /F "usebackq tokens=1,2 delims==" %%i in (`wmic os get LocalDateTime /VALUE 2^>NUL`) do if '.%%i.'=='.LocalDateTime.' set ldt=%%j
set ldt=%ldt:~0,4%-%ldt:~4,2%-%ldt:~6,2% %ldt:~8,2%:%ldt:~10,2%:%ldt:~12,6%
echo "%ldt%" >> env.json
echo } >> env.json
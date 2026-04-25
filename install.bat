@echo off
echo ==========================================
echo   TARA NEST - Install Dependencies
echo ==========================================
echo.

echo [1/2] Installing Backend...
cd /d "%~dp0backend"
npm install
if %errorlevel% neq 0 ( echo Backend install FAILED & pause & exit /b 1 )
echo Backend OK

echo.
echo [2/2] Installing Frontend...
cd /d "%~dp0frontend"
npm install
if %errorlevel% neq 0 ( echo Frontend install FAILED & pause & exit /b 1 )
echo Frontend OK

echo.
echo ==========================================
echo   Done! Run start.bat to launch.
echo ==========================================
pause

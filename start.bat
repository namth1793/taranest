@echo off
echo ==========================================
echo   TARA NEST - Starting Servers
echo   Backend:  http://localhost:5017
echo   Frontend: http://localhost:5173
echo ==========================================
echo.

start "TARA NEST Backend" cmd /k "cd /d "%~dp0backend" && npm start"
timeout /t 2 /nobreak >nul
start "TARA NEST Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

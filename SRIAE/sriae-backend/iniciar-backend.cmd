@echo off
cd /d "%~dp0"
set "MYSQL_USER=root"
set "MYSQL_PASSWORD=1234"

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8080 .*LISTENING"') do (
  echo El puerto 8080 ya esta ocupado por el proceso %%P.
  echo Cierra la otra ventana del backend o ejecuta:
  echo taskkill /PID %%P /F
  pause
  exit /b 1
)

call mvnw.cmd spring-boot:run
pause

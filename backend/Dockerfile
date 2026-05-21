# Usa una imagen oficial de Python ligera como base
FROM python:3.12-slim

# Crea el usuario no root llamado "appuser"
RUN useradd -m -s /bin/bash appuser

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /backend

# Copia primero el archivo de dependencias
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Cambia el propietario de la carpeta de trabajo a "appuser"
RUN chown -R appuser:appuser /backend

# Cambia al usuario no root recién creado
USER appuser

# Expone el puerto en el que correrá FastAPI
EXPOSE 8000

# Comando por defecto para iniciar el servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

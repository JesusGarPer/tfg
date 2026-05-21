# Usa una imagen oficial de Python ligera como base
FROM python:3.12-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /backend

# Copia primero el archivo de dependencias (para aprovechar la caché de Docker)
COPY requirements.txt .

# Instala las dependencias del sistema necesarias y los paquetes de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código del backend (carpetas app/ y models/)
COPY . .

# Expone el puerto en el que correrá FastAPI
EXPOSE 8000

# Comando por defecto para iniciar el servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

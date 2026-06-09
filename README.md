# 🏆 LEC Predictor AI

Sistema de Predicción de partidas de League of Legends (LEC) basado en Machine Learning. Este proyecto (Trabajo de Fin de Grado) utiliza datos históricos y en tiempo real (minuto 15) para predecir el resultado de los enfrentamientos.

El sistema está dividido en un **Frontend** (React + Vite + TailwindCSS), un **Backend** (FastAPI + Python) y una **Base de Datos** (PostgreSQL), todo ello orquestado mediante **Docker** para facilitar su despliegue.

---

## 🚀 Guía de Despliegue Rápido (Local)

Sigue estos pasos para replicar y ejecutar la aplicación en tu entorno local en menos de 5 minutos.

### 1. Prerrequisitos
Para ejecutar este proyecto, solo necesitas tener instalados los siguientes programas en tu ordenador:
* [Docker Desktop](https://www.docker.com/products/docker-desktop) (Debe estar abierto y ejecutándose en segundo plano).
* [Git](https://git-scm.com/downloads)

### 2. Clonar el repositorio
Abre una terminal y descarga el código fuente:
```bash
git clone https://github.com/JesusGarPer/tfg.git
cd tfg
```

### 3. Configurar variables de entorno
El proyecto requiere de un archivo de entorno para conectar los servicios. Existe un archivo de ejemplo con valores por defecto que funcionan perfectamente en local. Solo tienes que copiarlo y renombrarlo.

- En Mac/Linux usa el comando: `cp .env.example .env`
- En Windows usa el comando: `copy .env.example .env`

(Nota: Los modelos de Machine Learning ya vienen preentrenados e incluidos en el repositorio, por lo que no es necesario entrenarlos manualmente. En caso de querer entrenar el modelo de nuevo, ejecutar las celdas del notebook `01_experimentos15.ipynb`).

### 4. Levantar los servicios con Docker
Construye y levanta los contenedores (Base de datos, Backend y Frontend) ejecutando el siguiente comando en la raíz del proyecto:
```bash
docker-compose up -d --build
```
(La primera vez que se ejecuta, este proceso puede tardar un par de minutos mientras Docker descarga las imágenes y compila las dependencias).

### 5. Poblar la Base de Datos
Al levantar los servicios, la base de datos estará vacía. Para que la aplicación web muestre los equipos, jugadores y estadísticas, debes ejecutar el script de poblado de datos. Ejecuta el siguiente comando en tu terminal para lanzarlo dentro del contenedor del backend:
```bash
docker exec -it lol_predict_backend python db/populate_db.py
```
Si el script se ejecuta correctamente, verás un mensaje de confirmación en la consola.

---

## Acceso a la Aplicación

Una vez completados los pasos anteriores, abre tu navegador web para acceder a los servicios:

**Frontend (Interfaz Gráfica):** http://localhost:5173

**Backend (API Docs / Swagger):** http://localhost:8000/docs

**Base de Datos:** Puerto 5432 (Accesible a través de localhost con las credenciales del archivo de entorno).

---

## Detener la Aplicación

Cuando termines de usar la aplicación, puedes detener todos los servicios y liberar los recursos de tu ordenador ejecutando:
```bash
docker-compose down
```

---

## Estructura Principal del Proyecto

**/backend:** API construida con FastAPI, gestión de modelos de Machine Learning y endpoints.

**/frontend:** Interfaz de usuario desarrollada con React, TypeScript y TailwindCSS.

**/db:** Scripts de inicialización y poblado de la base de datos PostgreSQL.

**/notebooks:** Jupyter Notebooks utilizados para la limpieza de datos, entrenamiento y evaluación de los modelos predictivos.

**/data:** Datasets originales y filtrados de la LEC utilizados en el proyecto.

FROM node:20-alpine

WORKDIR /app

# Damos la propiedad de la carpeta /app al usuario 'node'
RUN chown -R node:node /app

# Nos cambiamos al usuario seguro ANTES de instalar las dependencias
USER node

# Usamos --chown para que el usuario 'node' sea el dueño de los archivos
COPY --chown=node:node package*.json ./
RUN npm install

# Copiamos el resto del código
COPY --chown=node:node . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

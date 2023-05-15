<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 0.1. Installation

```bash
$ npm i -g @nestjs/cli
```
```bash
$ nest new teslo-shop
```
```bash
$ yarn install
```

## 0.2. Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 0.3. Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

<!-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> -->

# 1. Desinstalar

```
 yarn remove prettier eslint-config-prettier eslint-plugin-prettier
```
   
# 2. nest conFig

```
yarn add @nestjs/config
```
# 3. Database

```
 npm install --save @nestjs/typeorm typeorm mysql2
 ó
  yarn add  @nestjs/typeorm typeorm 
```
Libreria que falta postgres
```
npm install pg --save
ó
yarn add pg
```

# Usage
1.Clonar proyecto

2. ```yarn install```

3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```

4. Cambiar las variables de entornno
5. Levantar la base de datos
  ```
  docker-compose up -d
  ```
6.  Levantar: ```yarn start:dev```
7.  Ejecutar SEED <GET>
  ```
  http://localhost:3001/api/seed
  ```
  ```
  yarn add -D  @types/multer
  ```

#Production notes:



<!-- ![sparkles](../03-pokedex/Configuraciones/corre_correctametne.png) -->

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
nest g res products --no-spec


yarn add class-validator class-transformer

nest g mo common

yarn add uuid
yarn add -D @types/uuid

nest g res seed --no-spec
nest g res files --no-spec

npm i -D @types/multer
yarn add uuid

nest g res auth --no-spec

yarn add bcrypt

yarn add -D @types/bcrypt


yarn add @nestjs/passport passport

yarn add @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt


 yarn add -D @types/passport-local

 nest g gu  auth/guards/userRole --no-spec
 
 nest g decorator 

# Documentacion con Postman
Se genera export o publicando
-Los cambios se guardan y publican

# Documentacion con OPENAPI
 npm install --save @nestjs/swagger
yarn add @nestjs/swagger

NOTE:Se necesita un cors cuando son en puertos diferentes

# Web Sockets 
permite hablar de manera actica
 inicia solicitud y el servider manda informacion sin que solicite

 nest  g res messagesWs --no-spec


 npm i --save @nestjs/websockets @nestjs/platform-socket.io

yarn add @nestjs/websockets @nestjs/platform-socket.io
 yarn add socket.io


 yarn create vite
 yarn
 yarn dev


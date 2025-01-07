## Screen Share App
This is a screen sharing application built using React for the frontend and Socket.io for real-time communication between the client and server. The client and server are deployed as separate services.

## Features
Real-time communication using WebSockets via Socket.io.
Client-side built with React.
Server-side using Node.js with Socket.io.
Screen sharing capabilities (can be added as an enhancement).

## Requirements
Node.js: v16 or higher
npm: v8 or higher

## Project Structure
The project is divided into two main parts:
Client: Frontend built with React.
Server: Backend powered by Node.js and Socket.io.

## Clone the repository
git clone https://github.com/Anil12345z/screen_share.git

## Environment
1.Environment Variables
Both the client and the server use environment variables for configuration.

2.Client Environment Variables
Create a .env file in the client directory with the following:

3.Server Environment Variables
Create a .env file in the server directory with the following:



## Deployment
This project can be deployed on platforms like Render, Heroku, or any server that supports Node.js. If you want to deploy to Render, make sure both the client and server are added as separate services in the Render dashboard.

## Deployment Steps for Render
Create two services in Render:

Client: Build and deploy your React app.
Server: Build and deploy your Node.js Socket.io server.

1.Set the environment variables as described above in both the client and server services.
2.The client service should have the following build and start commands in the render.yaml file:

buildCommand: |
  cd client && npm install && npm run build
  startCommand: cd client && npm start

3.The server service should have the following build and start commands in the render.yaml file:

buildCommand: |
  cd server && npm install
  startCommand: node server/index.js

## Local Development
1.Start the client (npm start).
2.Start the server (npm start from the server directory).
3. The application will be accessible locally via http://localhost:YourPort (client) and http://localhost:YourPort (server).


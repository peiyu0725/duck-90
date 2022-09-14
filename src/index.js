import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Phaser from 'phaser'
import Game from './plugins/Phaser/index.js'
import './assets/styles/global.sass'

export const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 900,
  parent: "phaser",
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 },
          debug: true
      }
  },
  scene: Game
};

new Phaser.Game(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

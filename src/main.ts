'use strict'
const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

const window = require('./Window');

function main() {
  let mainWindow = new window({
    file: 'index.html'
  })
}

app.on("ready", main);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    main;
  }
});

let connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "./dotnet/core")
  .build();

connection.onDisconnect = () => {
  console.log("lost");
};

connection.send("greeting", "from C#", (response: any) => {
  window.webContents.send("greeting", response);
  connection.close();
});
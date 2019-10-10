'use strict'
const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

const window = require('./Window');
let mainWindow: BrowserWindow | null;

function main() {
  mainWindow = new window({
    file: 'index.html'
  });
}

app.on("ready", main);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    main();
  }
});

let connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "./dotnet/core")
  .build();

connection.onDisconnect = () => {
  console.log("lost");
};

connection.send("greeting", "from C#", (response: any) => {
  mainWindow.webContents.send("greeting", response);
  connection.close();
});
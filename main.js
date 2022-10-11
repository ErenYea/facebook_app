const { app, BrowserWindow, ipcMain } = require("electron");
const facebook = require("./facebook");

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      //   preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("run", async (event, data) => {
  console.log(data);
  var value = await facebook();
  console.log(value);
  win.webContents.send("receive", value);
});

const { app, BrowserWindow } = require('electron')
const path = require('path')
const os = require('os-utils')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    icon: __dirname + '/icone.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
  
  mainWindow.removeMenu()
  mainWindow.maximize();
  mainWindow.show();

  setInterval(() => {
    os.cpuUsage(function (v) {
      mainWindow.webContents.send('cpu', v * 100)
      mainWindow.webContents.send('mem', (100 - (100 * os.freememPercentage())))
      mainWindow.webContents.send('mem-disp', os.freememPercentage() * 100)
      mainWindow.webContents.send('total-mem', os.totalmem()/1024)
    })
  }, 1000)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
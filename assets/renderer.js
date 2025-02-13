var settingLocked = false;

const Store = require("electron-store");
const { ipcRenderer } = require('electron')

const store = new Store();

window.onload = (event) => {
  console.log(store.get("unicorn"));

  if (store.get("privateKey")) {
    writeSetting(store.get("privateKey"));
  }

  writeInfo({
    chainName: 'loading...',
    walletAddress: 'loading...',
    walletBalance: 'loading...',
    currentProfit: '0.00%'
  });

  setInterval(() => {
  
    ipcRenderer.send('setting:async', readSetting());

  }, 1000);

  ipcRenderer.on('asynchronous-reply', (event, payload) => {

    if(payload.status === 'success'){

      writeInfo({
        chainName: payload.chainName,
        walletAddress: payload.walletAddress,
        walletBalance: payload.walletBalance,
        currentProfit:  payload.currentProfit
      });


    }

    if(payload.traderStatus){
      document.getElementById("traderStatus2").innerHTML = payload.traderStatus;
    }

    if(payload.status === 'error'){

      document.getElementById("traderStatus").innerHTML = payload.statusdDetails;
    }
   

    console.log(payload) // prints "pong"
  });


  document.getElementById("startButton").addEventListener("click", function() {
    ipcRenderer.send('button:control', 'start');
    settingLocked = true;
    document.getElementById("settingsButton").disabled = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("stopButton").disabled = false;
    document.getElementById("panicSell").disabled = false;
  });

  document.getElementById("pauseButton").addEventListener("click", function() {
    ipcRenderer.send('button:control', 'pause');
    document.getElementById("pauseButton").innerHTML = document.getElementById("pauseButton").innerHTML === "Pause" ? 'Continue' : 'Pause';
    settingLocked = true;
  });

  document.getElementById("stopButton").addEventListener("click", function() {
    ipcRenderer.send('button:control', 'stop');
    settingLocked = false;
    document.getElementById("pauseButton").innerHTML = "Pause";
    document.getElementById("startButton").disabled = false;
    document.getElementById("pauseButton").disabled = true;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("panicSell").disabled = true;
    document.getElementById("settingsButton").disabled = false;
  });

  document.getElementById("panicSell").addEventListener("click", function() {
    ipcRenderer.send('button:control', 'panicSell');
    settingLocked = true;
  });



};

//store.set('unicorn', 'fsdfsdafasdfasdfasfasfsdfasdf');

/*
const { ipcRenderer } = require('electron')


console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

ipcRenderer.send('asynchronous-message', 'ping');
*/

const unlockSettings = () => {
  settingLocked = false;
};

const lockSettings = () => {
  settingLocked = true;
};

const writeSetting = (newPrivateKey) => {
  const privateKey = document.getElementById("setting1");

  privateKey.value = newPrivateKey;
};

const writeInfo = ({ chainName, walletAddress, walletBalance, currentProfit }) => {
  document.getElementById("chainName").innerHTML = chainName;
  document.getElementById("walletAddress").innerHTML = walletAddress;
  document.getElementById("walletBalance").innerHTML = walletBalance;
  document.getElementById("currentProfit").innerHTML = currentProfit;
};

const readSetting = () => {
  const privateKey = document.getElementById("setting1").value;
  const chain = document.getElementById("setting2").value;
  const apeAmount = document.getElementById("setting3").value;
  const minProfit = document.getElementById("setting4").value;
  const gasPrice = document.getElementById("setting5").value;
  const gasLimit = document.getElementById("setting6").value;
  const apeAddress = document.getElementById("apeAddress").value;

  if (privateKey && typeof privateKey === "string" && privateKey.length >= 64) {
    store.set("privateKey", privateKey);
  }

  return {
    privateKey,
    chain,
    apeAmount,
    minProfit,
    gasPrice,
    gasLimit,
    apeAddress,
  };
};

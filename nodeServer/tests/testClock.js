let currentClock = new Date()
let currentTournamentInfo = {nextBlindTime: new Date().getTime() + 30000}
let blindDisplayClock = ""
let clockUpdateInterval = setInterval(()=>{
    console.log("clockUpdateInterval")
    // clearInterval(clockUpdateInterval)
    currentClock = new Date()
    if (!currentTournamentInfo) return
    if (!currentTournamentInfo.nextBlindTime) return
    let minutesLeft = Math.floor((currentTournamentInfo.nextBlindTime - currentClock.getTime())/60000)
    let secondsLeft = Math.floor(((currentTournamentInfo.nextBlindTime - currentClock.getTime())%60000)/1000)
    blindDisplayClock = `${("0" + minutesLeft).slice(-2)}:${("0" + secondsLeft).slice(-2)}`
    console.log(minutesLeft)
    console.log(secondsLeft)
    console.log(blindDisplayClock)
}, 1000)
setTimeout( () => {
    currentTournamentInfo.nextBlindTime = new Date().getTime() + 70000
},10000)

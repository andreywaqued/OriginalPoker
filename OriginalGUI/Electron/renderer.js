window.api.on('update', (data) => {
    document.getElementById('data').innerText = data.data;
});
function sendNewMessage() {
    pid = getProcessId()
    window.api.send("message", `process id: ${pid}`)
}
function getProcessId() {
    const pid = window.api.getProcessId();
    console.log(`Renderer Process ID in renderer window: ${pid}`);
    return pid
}
function getDisplaySize() {
    return window.api.getDisplaySize()
}

// console.log("loaded")
import sys
# from PyQt6.QtCore import Qt, QUrl, QObject, pyqtSlot
# from PyQt6.QtWebEngineWidgets import QWebEngineView, QWebEnginePage
# from PyQt6.QtWebSockets import QWebSocket
# from PyQt6.QtWidgets import QApplication, QMainWindow
import socketio
from PyQt6.QtCore import *
from PyQt6.QtCore import pyqtSlot
from PyQt6.QtCore import pyqtSignal as Signal
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from PyQt6.QtWebEngineWidgets import *
from PyQt6.QtWebEngineCore import *
from PyQt6.QtWebChannel import QWebChannel

class MyWebEnginePage(QWebEnginePage):
    # pass
    def javaScriptConsoleMessage(self, level, message, line_number, source_id):
        print(f"JS message: {message}, line: {line_number}, source: {source_id}")


class MyBridge(QObject):
    def __init__(self, window_id):
        super().__init__()
        self.window_id = window_id

    @pyqtSlot(str)
    def send_message(self, message: str):
        msg = f"Message received from JS: {self.window_id} {message}"
        print("send_message: " + msg)
        sio.send(msg)
        # You can send this message to your server here
    # @pyqtSlot(str)
    # def update_message(self, message):
    #     print(f"Update message received: {message}")
        

    
def printMessage(message):
    print(message)
    
def updateMessage(msg):
    print("updateMessage: " + msg['data'])
    if "window1" in msg['data']:
        window1.update_message("window1")
    elif "window2" in msg['data']:
        window2.update_message("window2")
        

class MainWindow(QMainWindow):
    def __init__(self, ws, window_id):
        super(MainWindow, self).__init__()
        # self.ws = ws
        self.window_id = window_id

        self.setWindowTitle(f"Window {window_id}")
        self.browser = QWebEngineView(self)
        self.setCentralWidget(self.browser)
        self.page = MyWebEnginePage(self.browser)
        self.browser.setPage(self.page)
        
        self.channel = QWebChannel()
        self.bridge = MyBridge(self.window_id)
        self.channel.registerObject("bridge", self.bridge)
        self.browser.page().setWebChannel(self.channel)
        self.browser.load(QUrl.fromLocalFile(sys.path[0] + '\\index.html'))
        # self.setCentralWidget(self.browser)
        # self.browser.page().webChannel().registerObject("jsConsole", self)
        # Redirect JavaScript console.log to Python stdout
        # self.browser.page().javaScriptConsoleMessage.connect(
        #     lambda level, msg, line, src: print(f"JS console: {msg}")
        # )

        # Create channel and bridge
        # self.channel = QWebChannel()
        # self.bridge = MyBridge()
        # self.channel.registerObject('bridge', self.bridge)
        # page.setWebChannel(self.channel)

        
        

        self.browser.loadFinished.connect(lambda: self.js_bridge())
        # sio.on("update", self.update_message)
        # sio.on("update", page.runJavaScript(f"updateMessage({})"))

        # self.ws.connected.connect(on_connected)
        # self.ws.textMessageReceived.connect(on_text_message_received)
            
            
            
    def update_message(self, message):
        print("update_message:" + message)
        self.page.runJavaScript(f"updateMessage('{message}')", self.js_callback)

        # self.browser.page().runJavaScript("alert('Hello, world!');")

        # try:
        #     self.browser.page().runJavaScript(f"updateMessage('{message}')")
        # except Exception as e:
        #     print(f"An error occurred: {e}")

        # print("its fine up to here")
        # self.page.runJavaScript(f"updateMessage('{message}')")
        # print("it worked")
        
    def js_bridge(self):
        self.page.runJavaScript(f'connectPyQtBridge({self.bridge})')
        self.update_message("asd123")
        
    def js_callback(self, result):
        print(f"JS callback received: {result}")
        
    # def on_message(self, message):
    #     message_data = message  # Assume you send JSON and deserialize it here

    #     # You'll need to inspect the message to decide if this window should handle it
    #     if message_data.get('window_id') == self.window_id:
    #         print(f"Message for {self.window_id}: {message_data}")

if __name__ == '__main__':
    app = QApplication(sys.argv)

    # ws = QWebSocket()
    sio = socketio.Client()
    sio.connect("http://127.0.0.1:5000")
    sio.send("Hello, server")
    sio.on("update", updateMessage)
    # ws.open(QUrl("http://127.0.0.1:5000"))  # Replace with your WebSocket server address
    # ws.connected.connect(on_connected)
    # # ws.sendTextMessage("hello")
    # ws.textMessageReceived.connect(on_text_message_received)
    window1 = MainWindow(sio, "window1")
    window1.show()

    window2 = MainWindow(sio, "window2")
    window2.show()
    
    sys.exit(app.exec())

import logging
import os.path
import datetime

class cLogger():
    """
        Logger class. \n
        Imports the logging library and abstracts it to facilitate the usage.
    """
    def __init__(self, appArea):
        #sets log folder and file
        logFolder = "log/"
        if not os.path.isdir(logFolder):
            logFolder
            os.mkdir(logFolder)
        logFile =  str(datetime.date.today()) + ".log"
        # set up logging to file - see previous section for more details
        logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                    # datefmt='%Y-%m-%d %H:%M:%S.%f',
                    filename=logFolder + logFile,
                    filemode='a')
        # define a Handler which writes DEBUG messages or higher to the sys.stderr
        self.console = logging.StreamHandler()
        # set a format which is simpler for console use
        formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
        # tell the handler to use this format
        self.console.setFormatter(formatter)
        # add the handler to the root logger
        self.consoleLogger = logging.getLogger("")
        if len(self.consoleLogger.handlers) <= 1:
            # create the handlers and call logger.addHandler(logging_handler)
            self.consoleLogger.addHandler(self.console)
        self.logger = logging.getLogger(appArea)

    def fPrintAndLog(self, message, logMethod = "INFO"):
        """
            Print debug info on the console and logs it \n
            appArea is meant to receive the area that is calling this function. By default its root \n
            logMethod accepts 'INFO', 'DEBUG', 'ERROR'. By default its INFO \n

        """
        if logMethod == "INFO":
            self.console.setLevel(logging.INFO)
        elif logMethod == "DEBUG":
            self.console.setLevel(logging.DEBUG)
        elif logMethod == "ERROR":
            self.console.setLevel(logging.ERROR)

        
        if logMethod == "INFO":
            self.logger.info(message)
        elif logMethod == "DEBUG":
            self.logger.debug(message)
        elif logMethod == "ERROR":
            self.logger.error(message)
        return
import mysql.connector as mariadb
import threading

dbConnection = mariadb.connect(
    user='original', password='mysqlpwdoriginal', database='originaldb')
dbConnection.autocommit = True
cursor = dbConnection.cursor(dictionary=True, buffered=True)
mtxDb = threading.Lock()


class cDB():
    def __init__(self):
        self.dbConnection = dbConnection
        self.cursor = cursor

    def fExecute(self, sql, params=()):
        mtxDb.acquire()
        print(sql)
        self.cursor.execute(sql, params)
        idLast: int = self.cursor.lastrowid
        #idLast = 1
        mtxDb.release()
        return idLast

    def fConsulta(self, sql, params=()):
        print(sql)
        mtxDb.acquire()
        self.cursor.execute(sql, params)
        mtxDb.release()
        return self.cursor.fetchall()

    def fGetVar(self, sql, params=()):
        print(sql)
        mtxDb.acquire()
        self.cursor.execute(sql, params)
        f = self.cursor.fetchone()
        mtxDb.release()
        t = next(iter(f.values()))
        if t == None:
            return 0
        else:
            return t

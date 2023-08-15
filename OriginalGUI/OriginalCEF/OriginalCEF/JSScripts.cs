using CefSharp.OriginalCEF;
using System;
using System.Threading;
using System.Windows;
using System.IO;
using OriginalCEF;
using TCPClient;



namespace OriginalCEF
{
    public class buttonEvents
    {
        public cSocket sock;
        public delegate void eChangeWindow(string action);
        public event eChangeWindow fChangeWindow;
        public void fConnect(string host)
        {
            //host = "3.21.35.87";
            //host = "192.168.100.5";

            //host = "192.168.110.248";
            //private string host = "localhost"; // AMZ-SV"3.21.35.87"; // ALEX-PC"192.168.61.14";
            //if (host == "localhost")
            //{
            host = "localhost";
            //host = "192.168.61.14";
            //}
            //else if (host == "server")
            //{
            //host = "3.21.35.87";
            //}
            //else if (host == "alexander")
            //{
            //    host = "192.168.0.107";
            //    //host = "192.168.61.12";
            //}
            //else
            //{
            //    return;
            //}
            sock.fConnectToTcpServer(host);
            Random random = new Random();
            //App.sock.fSendPacket($"SIGN_IN;{random.Next(1, 100)}#");
        }
        public void fLogin(string user, string password)
        {
            sock.fSendPacket($"SIGN_IN;{user};{password}#");
        }
        public void fRaise(string amount)
        {
            Log.WriteLog($"fRaise ({amount})");
            sock.fSendPacket($"RAISE;{amount.Replace(",", ".")}#");
        }
        public void fCall()
        {
            sock.fSendPacket($"CALL;#");
        }
        public void fFold()
        {
            sock.fSendPacket($"FOLD;#");
        }
        public void fCheck()
        {
            sock.fSendPacket($"CHECK;#");
        }
        public void fEnterTable(int tableId)
        {
            sock.fSendPacket($"ENTER_TABLE;{tableId}#");
            //CefSharp.OriginalCEF.MainWindow.fExecuteJavaScriptFunction();
        }
        public void fFechar()
        {
            fChangeWindow("Fechar");
        }
        public void fQuit(bool notFunds = false)
        {
            if(notFunds)
                sock.fSendPacket("QUIT;notfunds#");
            else
                sock.fSendPacket("QUIT;ok#");
        }
        public void fMinimizar()
        {
            fChangeWindow("Minimizar");
        }
        public void fOpenCashier()
        {
            //TODO;
            //Abrir caixa
            sock.fSendPacket($"GET_CASHIER#");
            
        }
        public void fOpenLobby()
        {
            //TODO;
            //Abrir caixa
            sock.fSendPacket($"GET_LOBBY#");

        }
        public void fOrganizerTables()
        {
            fChangeWindow("organizerTables");
        }
        //public void fEnterPool(float stackAmount)
        //{
        //    App.sock.fSendPacket($"ENTER_POOL;{stackAmount}#");
        //    App.sock.startStack = stackAmount;
        //    Random random = new Random();
        //    //fReserveSit(random.Next(1,6));
        //    //CefSharp.OriginalCEF.MainWindow.fExecuteJavaScriptFunction();
        //}

        public void fEnterPool(int idTipo, int idBlind, int idQtdJogadores, float stackAmount)
        {
            sock.fSendPacket($"SUBSCRIBE_POOL;{idTipo};{idBlind};{idQtdJogadores};{stackAmount}#");
            //LobbyWindow
            //Thread thread = new Thread(() =>
            //{
            //    MainWindow w = new MainWindow();
            //    w.Show();
            //});
            //thread.SetApartmentState(ApartmentState.STA);
            //thread.Start();
            //fReserveSit(random.Next(1,6));
            //CefSharp.OriginalCEF.MainWindow.fExecuteJavaScriptFunction();
        }
        public void fUpdateHtmlLoadedState()
        {
            fChangeWindow("htmlLoaded");
        }
        public void fActivateTable()
        {
            fChangeWindow("activateTable");
        }
        //public void fReserveSit(int pos)
        //{

        //    sock.fSendPacket($"RESERVE_SIT;{pos}#");
        //    sock.mySeat = pos;
        //    //CefSharp.OriginalCEF.MainWindow.functionA();
        //}
        //public void fSit(float stackAmount)
        //{
        //    sock.fSendPacket($"SIT;{stackAmount}#");
        //    sock.startStack = stackAmount;
        //    //CefSharp.OriginalCEF.MainWindow.functionA();
        //}

        public void fSitOutNextHand(int selected)
        {
            sock.fSendPacket($"SIT_OUT_NEXT_HAND;{selected}#");
        }
        public void fSitOutNextBB(int selected)
        {
            sock.fSendPacket($"SIT_OUT_NEXT_BLIND;{selected}#");
        }
    }
}

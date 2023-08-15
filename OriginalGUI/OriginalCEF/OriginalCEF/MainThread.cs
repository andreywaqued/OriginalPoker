using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using CefSharp.OriginalCEF;
using CefSharp.Wpf;


namespace OriginalCEF
{
    class MainThread
    {
        public string hash;
        public string host;
        public bool closed = false;
        public LobbyWindow lobbyWindow;
        private MainWindow mWindow;
        
        public void fFechar()
        {
            this.closed = true;
            if(!mWindow.closed)
                mWindow.bEvents.fFechar();
            while (!mWindow.closed)
            {
                System.Threading.Thread.Sleep(100);
            }
            mWindow.Dispatcher.BeginInvokeShutdown(System.Windows.Threading.DispatcherPriority.Normal);
        }
        public void fOrganizerTable(int pos)
        {
            int top = 0;
            int left = 0;
            if (pos == 1)
            {
                top = 491;
                left = 0;
            }
            if (pos == 2)
            {
                top = 0;
                left = 624;
            }
            if (pos == 3)
            {
                top = 491;
                left = 624;
            }
            if (pos == 4)
            {
                top = 0;
                left = 1248;
            }
            if (pos == 5)
            {
                top = 491;
                left = 1248;
            }
            mWindow.Dispatcher.Invoke((Action)(() =>
            {
                mWindow.Top = top;
                mWindow.Left = left;
            }));
        }
        public void fThreadMethod()
        {
            mWindow = new MainWindow(hash, host);
            mWindow.lobbyWindow = this.lobbyWindow;
            mWindow.Show();
            System.Windows.Threading.Dispatcher.Run();
            Log.WriteLog("Fechou thread");
        }
    }
}

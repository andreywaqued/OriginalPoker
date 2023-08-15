using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Interop;
using CefSharp.Wpf;
using OriginalCEF;
using TCPClient;
using System.Diagnostics;

namespace CefSharp.OriginalCEF
{
    public partial class LobbyWindow : Window
    {
        const string resourcename = "http://lobby.html";

        private double _aspectRatio;
        private bool? _adjustingHeight = null;
        public cSocket sock = new cSocket();
        public buttonEvents bEvents = new buttonEvents();
        public ChromiumWebBrowser Browser;
        public int mySeat = -1;
        public float startStack = -1;
        public bool htmlIsLoaded = false;
        List<Thread> threadTableList = new List<Thread>();
        List<MainThread> mainThreadTableList = new List<MainThread>();
        List<string> messages = new List<string>();
        private bool closeOk = false;
        private bool logado = false;

        public void fOrganizerTable()
        {
            int i = 0; 
            foreach (MainThread m in mainThreadTableList){
                if (!m.closed)
                {
                    m.fOrganizerTable(i);
                    i++;
                }
            }
        }
        public bool fTreatMessage(string serverMessage)
        {
            messages = serverMessage.Split('#').ToList();
            int number;
            for (int i = 0; i < messages.Count(); i++)
            {

                string msg = messages[i];
                string[] args = msg.Split(';'); // Split message's arguments.
                List<int> reservedSits = new List<int>();
                Log.WriteLog(msg);
                //Identify message and act properly.
                switch (args[0])
                {
                    case "":
                        //quando splita a ultima mensagem fica vazia as vezes
                        break;
                    case "SIGN_IN":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            //this.fUpdateHtmlElement($"connectButtons", "style.display", "'none'");
                            //eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));
                            this.fUpdateWindowTitle("LOBBY"); //adicionar ante
                            //this.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    this.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));
                            //this.fUpdateHtmlElement($"gameOptions", "style.display", "'block'");
                            fRedirectWindow("lobby_ZAPP.html");
                            logado = true;

                        }
                        break;
                    case "SEND_CASHIER":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {

                            this.fUpdateWindowTitle("CASHIER"); //adicionar ante
                            fRedirectWindow("caixa.html");
                            float playerBalance = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            float playerBalanceInPlay = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdateCashier", $"'{playerBalance.ToString("0.00")}'", $"'{playerBalanceInPlay.ToString("0.00")}'");
                        }
                        // (To-Do)
                        break;
                    case "SEND_LOBBY":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {

                            this.fUpdateWindowTitle("LOBBY"); //adicionar ante
                            fRedirectWindow("lobby_ZAPP.html");
                        }
                        // (To-Do)
                        break;
                    case "ENTER_TABLE":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            this.fUpdateHtmlElement($"connectButtons", "style.display", "'none'");
                            //eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));
                            this.fExecuteJavaScriptFunction("fCreateTable", "6");
                            this.fUpdateWindowTitle("LOBBY"); //adicionar ante
                            //this.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    this.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));

                        }
                        // (To-Do)
                        break;
                    case "SEND_BALANCE":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            float balance = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdateBalance", $"'{balance.ToString("0.00")}'");
                        }
                        break;
                    case "SET_POOL_PLAYERS":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            string idPool = args[2];
                            string numPlayers = args[3];

                            this.fExecuteJavaScriptFunction("fUpdatePool", $"{idPool}", $"{numPlayers}");
                        }
                        break;
                    case "SET_PLAYER_INFO":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            string playerName = args[2];
                            string idAvatar = args[3];

                            this.fExecuteJavaScriptFunction("fUpdatePlayer", $"'{playerName}'", $"{idAvatar}");
                        }
                        break;
                    case "ENTER_POOL":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            this.fUpdateHtmlElement($"connectButtons", "style.display", "'none'");
                            //eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));

                            this.fUpdateWindowTitle("LOBBY"); //adicionar ante
                            //this.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    this.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));
                            sock.fSendPacket($"GET_BALANCE#");
                        }
                        // (To-Do)
                        break;
                    case "SUBSCRIBE_POOL":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            MainThread m = new MainThread();
                            m.hash = args[2].Replace(':', ';');
                            m.host = sock.host;
                            m.lobbyWindow = this;
                            Thread threadMainWindow = new Thread(new ThreadStart(m.fThreadMethod));
                            threadMainWindow.SetApartmentState(ApartmentState.STA);
                            threadTableList.Add(threadMainWindow);
                            mainThreadTableList.Add(m);
                            threadMainWindow.Start();
                            sock.fSendPacket($"GET_BALANCE#");
                            break;
                        }
                        else if(args[1] == "insulficientfunds")
                        {
                            this.fExecuteJavaScriptFunction("fNotFunds");
                        }

                        // (To-Do)
                        break;

                    case "QUIT":
                        if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
                        {
                            closeOk = true;
                            this.Dispatcher.Invoke((Action)(() =>
                            {
                                this.Close();
                            }));
                            //this.Dispatcher.BeginInvokeShutdown(System.Windows.Threading.DispatcherPriority.Normal);
                            return false;
                            // (To-Do)
                        }
                        else if (int.TryParse(args[1], out number)) // Announce Exit - "EXIT;sit_position"
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fRemovePlayer", $"{sitPosition}");
                            //eventQueue.EnqueueAction(fAnnounceOpponentsExit(sitPosition));
                        }
                        break;

                    default:
                        string unknown = "Message not Known: ";
                        foreach (string arg in args)
                        {
                            unknown += arg + ";";
                        }
                        Log.WriteLog(unknown);
                        Console.WriteLine(unknown);
                        break;
                }
            }
            return true;
            //messages.Clear();
        }
        public void fUpdateHtmlElement(string element, string property, string value)
        {
            Console.WriteLine("Updating HTML: " + $"document.getElementById('{element}').{ property} = { value}");
            while (!Browser.CanExecuteJavascriptInMainFrame)
                Thread.Sleep(100);
            Browser.ExecuteScriptAsync($"document.getElementById('{element}').{property} = {value}");
        }

        public void fRedirectWindow(string url)
        {
            Console.WriteLine("Mudando para a pagina: " + url);
            htmlIsLoaded = false;
            Browser.Load("file://" + System.IO.Path.GetFullPath(@"HTML Original\" + url));
            while (!htmlIsLoaded)
            {
                Thread.Sleep(5);
            }
        }
        public void fChangeWindow(string action)
        {
            if (action == "htmlLoaded")
            {
                this.fExecuteJavaScriptFunction("fSetDecimalSeparator", $"'{System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator}'");
                htmlIsLoaded = true;
            }
        }
        public void fUpdateWindowTitle(string title)
        {
            Console.WriteLine($"Updating title: {title}");
            //System.Windows.Threading.Dispatcher.CurrentDispatcher.Invoke(() =>
            //{
            //    ((MainWindow)App.Current.Windows[0]).Title = $"{title}";
            //});
            this.Dispatcher.Invoke((Action)(() =>
            {
                this.Title = $"{title}";
            }));
        }
        public void fExecuteJavaScriptFunction(string funcName, string arg1 = null, string arg2 = null, string arg3 = null, string arg4 = null)
        {
            if (arg1 == null)
            {
                Console.WriteLine($"{funcName}();");
                Log.WriteLog($"{funcName}();");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}();");
            }
            else if (arg2 == null)
            {
                Log.WriteLog($"{funcName}({arg1});");
                Console.WriteLine($"{funcName}({arg1});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1});");
            }
            else if (arg3 == null)
            {
                Log.WriteLog($"{funcName}({arg1}, {arg2});");
                Console.WriteLine($"{funcName}({arg1}, {arg2});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1}, {arg2});");
            }
            else if (arg4 == null)
            {
                Log.WriteLog($"{funcName}({arg1}, {arg2}, {arg3});");
                Console.WriteLine($"{funcName}({arg1}, {arg2}, {arg3});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1}, {arg2}, {arg3});");
            }
            else
            {
                Log.WriteLog($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
                Console.WriteLine($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
            }
        }
        internal enum SWP
        {
            NOMOVE = 0x0002
        }
        internal enum WM
        {
            WINDOWPOSCHANGING = 0x0046,
            EXITSIZEMOVE = 0x0232, NLH

        }
        public LobbyWindow()
        {
            InitializeComponent();
            //Window1 w = new Window1();NLH

            //w.Show();
            //MainWindow mw = new MainWindow();
            //mw.Show();
            //Thread thread = new Thread(() =>
            //{
            //    MainWindow w = new MainWindow();
            //    w.Show();NLH

            //    while (true)
            //    {
            //        Thread.Sleep(1);
            //    }
            //});
            //thread.SetApartmentState(ApartmentState.STA);
            //thread.Start();
            this.Browser = new ChromiumWebBrowser("localfolder://cefsharp/");
            this.Browser.RequestHandler = new CustomRequestHandler();
            this.Browser.Address = "login.html";
            //this.Browser.MenuHandler = new CustomMenuHandler();
            //this.SourceInitialized += Window_SourceInitialized;
            this.Title = "Original Poker";
            this.AddChild(this.Browser);
            sock.fTreatMessage += new cSocket.eTreatMessage(fTreatMessage);
            bEvents.fChangeWindow += new buttonEvents.eChangeWindow(this.fChangeWindow);
            bEvents.sock = sock;
            Log.WriteLog($"CurrentCulture is {System.Globalization.CultureInfo.CurrentCulture.Name}.");
            Log.WriteLog($"Curr Decimal Sep. is {System.Globalization.NumberFormatInfo.CurrentInfo.CurrencyDecimalSeparator}");
            Log.WriteLog($"Number Decimal Sep. is {System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator}");
            Log.WriteLog($"CurrentCulture is {System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalDigits}");
            //if connection !succesful
            //{
            //    abre Updater
            //    Exit()
            //}



            //Browser.AddHandler(MouseLeftButtonUpEvent, new RoutedEventHandler(writeMousePos), true);            
            //Browser.PreviewMouseLeftButtonUp += new MouseButtonEventHandler(leftButtonUp);
            //Browser.PreviewMouseRightButtonUp += new MouseButtonEventHandler(rightButtonUp);

            this.Browser.JavascriptObjectRepository.ResolveObject += (sender, e) =>
            {
                var repo = e.ObjectRepository;
                if (e.ObjectName == "buttonEvents")
                {
                    BindingOptions bindingOptions = null; //Binding options is an optional param, defaults to null
                    bindingOptions = BindingOptions.DefaultBinder; //Use the default binder to serialize values into complex objects, CamelCaseJavascriptNames = true is the default
                    repo.Register("buttonEvents", bEvents, isAsync: true, options: bindingOptions);
                }
            };

            this.Browser.JavascriptObjectRepository.ObjectBoundInJavascript += (sender, e) =>
            {
                var name = e.ObjectName;

                Console.WriteLine($"Object {e.ObjectName} was bound successfully.");
            };
        }

        [StructLayout(LayoutKind.Sequential)]
        internal struct WINDOWPOS
        {
            public IntPtr hwnd;
            public IntPtr hwndInsertAfter;
            public int x;
            public int y;
            public int cx;
            public int cy;
            public int flags;
        }

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool GetCursorPos(ref Win32Point pt);

        [StructLayout(LayoutKind.Sequential)]
        internal struct Win32Point
        {
            public Int32 X;
            public Int32 Y;
        };

        public static Point GetMousePosition() // mouse position relative to screen
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            return new Point(w32Mouse.X, w32Mouse.Y);
        }

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {            
            if (closeOk || !logado)
            {
                base.OnClosing(e);
                //System.Windows.Application.Current.Shutdown();
            }
            else
            {
                for (int i = 0; i < threadTableList.Count; i++)
                {
                    Thread t = threadTableList[i];
                    MainThread m = mainThreadTableList[i];
                    m.fFechar();
                    t.Join();
                }
                this.bEvents.fQuit();
                e.Cancel = true;
            }
        }

        //private void Window_SourceInitialized(object sender, EventArgs ea)
        //{
        //    HwndSource hwndSource = (HwndSource)HwndSource.FromVisual((Window)sender);
        //    hwndSource.AddHook(DragHook);

        //    _aspectRatio = base.Width / base.Height;
        //}

        //private IntPtr DragHook(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        //{
        //    switch ((WM)msg)
        //    {
        //        case WM.WINDOWPOSCHANGING:
        //            {
        //                WINDOWPOS pos = (WINDOWPOS)Marshal.PtrToStructure(lParam, typeof(WINDOWPOS));

        //                if ((pos.flags & (int)SWP.NOMOVE) != 0)
        //                    return IntPtr.Zero;

        //                Window wnd = (Window)HwndSource.FromHwnd(hwnd).RootVisual;
        //                if (wnd == null)
        //                    return IntPtr.Zero;

        //                // determine what dimension is changed by detecting the mouse position relative to the 
        //                // window bounds. if gripped in the corner, either will work.
        //                if (!_adjustingHeight.HasValue)
        //                {
        //                    Point p = GetMousePosition();

        //                    double diffWidth = Math.Min(Math.Abs(p.X - pos.x), Math.Abs(p.X - pos.x - pos.cx));
        //                    double diffHeight = Math.Min(Math.Abs(p.Y - pos.y), Math.Abs(p.Y - pos.y - pos.cy));

        //                    _adjustingHeight = diffHeight > diffWidth;
        //                }

        //                if (_adjustingHeight.Value)
        //                    pos.cy = (int)(pos.cx / _aspectRatio); // adjusting height to width change
        //                else
        //                    pos.cx = (int)(pos.cy * _aspectRatio); // adjusting width to heigth change

        //                Marshal.StructureToPtr(pos, lParam, true);
        //                handled = true;
        //            }
        //            break;
        //        case WM.EXITSIZEMOVE:
        //            _adjustingHeight = null; // reset adjustment dimension and detect again next time window is resized
        //            break;
        //    }

        //    return IntPtr.Zero;
        //}
        public class CustomResourceRequestHandler : CefSharp.Handler.ResourceRequestHandler
        {
            protected override IResourceHandler GetResourceHandler(IWebBrowser chromiumWebBrowser, IBrowser browser, IFrame frame, IRequest request)
            {
                //ResourceHandler has many static methods for dealing with Streams, 
                // byte[], files on disk, strings
                // Alternatively ou can inheir from IResourceHandler and implement
                // a custom behaviour that suites your requirements.

                //chromiumWebBrowser.Load(@"C:\OriginalPokerRoom\OriginalPokerRoom\original_poker\OriginalGUI\OriginalCEF\ConsoleApp1\index.html"); //load a custom URL to the browser
                //string password = "pu7Kz1PNShe6dSda+hIwQ5ixxtldHpq9HGu4WXg11bsX7JO3THkyNBLSviZka66T7myYL2O0BuyPY87n+Ybeeg=="; //OriginalPokerRoom encrypted with Original as password
                //string encryptedstring = File.ReadAllText(@"C:\OriginalPokerRoom\OriginalPokerRoom\original_poker\OriginalGUI\OriginalCEF\ConsoleApp1\indexEncrypt.txt");
                //string decryptedstring = StringCipher.Decrypt(encryptedstring, password);

                Console.WriteLine("Entrando login");
                //string html = File.ReadAllText(System.IO.Path.GetFullPath(@"HTML Original\login.html"));
                //System.IO.MemoryStream memorystream = new System.IO.MemoryStream(System.Text.Encoding.UTF8.GetBytes(html));
                //chromiumWebBrowser.RegisterResourceHandler(resourcename, memorystream);
                //chromiumWebBrowser.Load(resourcename);
                //chromiumWebBrowser.UnRegisterResourceHandler(resourcename);


                chromiumWebBrowser.Load("file://" + System.IO.Path.GetFullPath(@"HTML Original\login.html"));
                // chromiumWebBrowser.LoadHtml(html);
                if (chromiumWebBrowser.CanExecuteJavascriptInMainFrame)
                {
                    //execute javascript
                    chromiumWebBrowser.ExecuteScriptAsync(String.Format("document.body.oncontextmenu = 'return false';"));
                }
                return null; //ResourceHandler.FromString("Welcome to CefSharp!", ".html"); 

            }
        }

        public class CustomRequestHandler : CefSharp.Handler.RequestHandler
        {
            protected override IResourceRequestHandler GetResourceRequestHandler(IWebBrowser chromiumWebBrowser, IBrowser browser, IFrame frame, IRequest request, bool isNavigation, bool isDownload, string requestInitiator, ref bool disableDefaultHandling)
            {
                //Only intercept specific Url's
                if (request.Url == "localfolder://cefsharp/" || request.Url == "https://cefsharp.test/")
                {
                    return new CustomResourceRequestHandler();
                }

                //Default behaviour, url will be loaded normally.
                return null;
            }
        }

        public class CustomMenuHandler : IContextMenuHandler
        {
            //disable Context menu (right button click menu)
            public void OnBeforeContextMenu(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters, IMenuModel model)
            {
                model.Clear();
            }

            public bool OnContextMenuCommand(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters, CefMenuCommand commandId, CefEventFlags eventFlags)
            {
                return false;
            }

            public void OnContextMenuDismissed(IWebBrowser browserControl, IBrowser browser, IFrame frame)
            {

            }

            public bool RunContextMenu(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters, IMenuModel model, IRunContextMenuCallback callback)
            {
                return false;
            }
        }
    }
}

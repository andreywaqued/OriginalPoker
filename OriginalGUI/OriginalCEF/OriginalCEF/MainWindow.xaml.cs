using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using CefSharp.Wpf;
using OriginalCEF;
using TCPClient;

namespace CefSharp.OriginalCEF
{
    public partial class MainWindow : Window
    {
        private ChromiumWebBrowser Browser;
        private double _aspectRatio;
        private bool? _adjustingHeight = null;
        public cSocket sock = new cSocket();
        public buttonEvents bEvents = new buttonEvents();
        public bool htmlIsLoaded = false;
        public int mySeat = -1;
        public float startStack = -1;
        List<string> messages = new List<string>();
        private string hashSubscribe;
        public string myPlayerName = string.Empty;
        public string decimalSep = System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;
        private bool closeOK = false;
        private bool notFunds = false;
        public bool closed = false;
        private bool Moving = false;
        public LobbyWindow lobbyWindow = new LobbyWindow();
        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            if (closeOK)
            {
                base.OnClosing(e);
            }
            else
            {
                bEvents.fQuit(notFunds);
                e.Cancel = true;
            }
        }

        internal enum SWP
        {
            NOMOVE = 0x0002
        }
        internal enum WM
        {
            WINDOWPOSCHANGING = 0x0046,
            EXITSIZEMOVE = 0x0232,
        }
        public void fChangeWindow(string action)
        {
            if (action == "organizerTables")
            {
                lobbyWindow.fOrganizerTable();
            }
            if (action == "Minimizar")
            {
                this.Dispatcher.Invoke((Action)(() =>
                {
                    this.WindowState = WindowState.Minimized;
                }));
            }
            if (action == "Fechar")
            {
                this.Dispatcher.Invoke((Action)(() =>
                {
                    this.Close();
                }));
            }
            if (action == "htmlLoaded")
            {
                this.fExecuteJavaScriptFunction("fSetDecimalSeparator", $"'{decimalSep}'");
                htmlIsLoaded = true;
            }
            if (action == "activateTable")
            {
                this.Dispatcher.Invoke((Action)(() =>
                {
                    this.Activate();
                }));
            }
        }
        public bool fTreatMessage(string serverMessage)
        {
            if (serverMessage == "EveryOneClosed")
            {
                closed = true;
                return false;
            }
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
                            //MainWindow.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    MainWindow.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));
                            //this.fUpdateHtmlElement($"gameOptions", "style.display", "'block'");

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
                            //MainWindow.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    MainWindow.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));

                        }
                        // (To-Do)
                        break;
                    case "ENTER_POOL":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            //this.fUpdateHtmlElement($"connectButtons", "style.display", "'none'");
                            //eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));

                            this.fUpdateWindowTitle("LOBBY"); //adicionar ante
                            while (!htmlIsLoaded)
                            {
                                Thread.Sleep(5);
                            };
                            //MainWindow.AppWindow.Dispatcher.Invoke((Action)(() =>
                            //{
                            //    MainWindow.AppWindow.Title = "Conectou";
                            //    //your code here...
                            //}));

                        }
                        // (To-Do)
                        break;
                    case "RESERVE_SIT":
                        if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
                        {
                            this.fExecuteJavaScriptFunction("fSendMessageNotStack");
                            //for (int j = 1; j <= 9; j++)
                            //{
                            //    this.fUpdateHtmlElement($"buttonSeat{j}", "disabled", "true");
                            //}
                            //eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));
                        }
                        else if (int.TryParse(args[1], out number)) // Announce Reserved - "RESERVE_SIT;sit_position;player_name;avatar_id"
                        {
                            int sitPosition = number;
                            string playerName = args[2];
                            string avatarID = args[3];
                            reservedSits.Add(sitPosition);
                            if (sitPosition != mySeat)
                            {
                                this.fExecuteJavaScriptFunction("fSitPlayer", $"{sitPosition}", $"'{playerName}'", $"'{avatarID}'");
                            }
                            if (sitPosition == mySeat)
                            {
                                this.fExecuteJavaScriptFunction("fSitHero", $"{mySeat}", $"'{myPlayerName}'", $"'{avatarID}'");
                            }
                            //foreach (GameObject sit in gameController.seats)
                            //{
                            //    if (sit.GetComponent<cSeat>().position == sitPosition)
                            //    {
                            //        Console.WriteLine("My oponnent has reserved a sit, must show his sit");
                            //        sit.GetComponent<cSeat>().fShowSit();
                            //    }
                            //}
                            //eventQueue.EnqueueAction(fReserveSitForOpponents(sitPosition, playerName));
                        }
                        else if (args[1] == "invalid")
                        {
                            //gameController.reservedSeatPosition = -1;
                            for (int j = 1; j <= 9; j++)
                            {
                                if (reservedSits.Contains(j))
                                {
                                    this.fUpdateHtmlElement($"buttonSeat{j}", "disabled", "true");

                                }
                                else
                                {
                                    this.fUpdateHtmlElement($"buttonSeat{j}", "disabled", "false");
                                }
                            }
                        }
                        break;
                    case "REQUEST_BUY": // Amount To Buy - "REQUEST_BUY;min;max" - "REQUEST_BUY;50;100"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            if (args.Length == 4)
                            {
                                float min = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                                float max = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
                                //gameController.fAskForSitStack(min, max);
                            }
                            //TODO anunciar aos adversários.
                        }
                        break;
                    case "SIT":
                        //ajustar para ficar lendo posicao primeiro sempre.
                        if (args[1] == "ok") // Confirm Sit Amount - "SIT;ok;sit_position;stack_amount;avatar_id"
                        {
                            //this.fExecuteJavaScriptFunction("fCreateTable", "6");
                            this.fExecuteJavaScriptFunction("fDisableActionButtons");
                            this.fExecuteJavaScriptFunction("fClearTable");
                            this.fExecuteJavaScriptFunction("fHideEmptySeats");
                            int sitPosition = int.Parse(args[2]);
                            int avatarId = int.Parse(args[4]);
                            reservedSits.Add(sitPosition);
                            this.fExecuteJavaScriptFunction("fSitHero", $"{sitPosition}", $"'{myPlayerName}'", $"{avatarId}");
                            mySeat = int.Parse(args[2]);
                            //this.fExecuteJavaScriptFunction("fHideEmptySeats");
                            //this.fExecuteJavaScriptFunction("fSitPlayer", $"{mySeat}", "'MyName'");
                            float stack = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePlayerStack", $"{mySeat}", $"{stack}");

                            //eventQueue.EnqueueAction(fConfirmLocalPlayerSitAmount());
                        }
                        else if (int.TryParse(args[1], out number)) // Announce Sit - "SIT;sit_position;stack_amount"
                        {
                            int sitPosition = number;
                            float stack = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePlayerStack", $"{sitPosition}", $"'{stack.ToString("0.00")}'");

                            //eventQueue.EnqueueAction(fAnnounceOpponentsSit(sitPosition, stack));
                        }
                        break;
                    case "EXIT":
                        if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
                        {
                            this.fChangeWindow("Fechar");
                        }
                        else if (int.TryParse(args[1], out number)) // Announce Exit - "EXIT;sit_position"
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fRemovePlayer", $"{sitPosition}");
                            //eventQueue.EnqueueAction(fAnnounceOpponentsExit(sitPosition));
                        }
                        break;
                    case "QUIT":
                        if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
                        {
                            closeOK = true;
                            this.Dispatcher.Invoke((Action)(() =>
                            {
                                this.Close();
                            }));
                            return false;
                        }
                        break;
                    case "PLAYER_WITHOUT_STACK":
                        if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
                        {
                            notFunds = true;
                            this.fExecuteJavaScriptFunction("fNotFunds");
                        }
                        break;
                    case "SEND_TABLE":
                        if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
                        {
                            // (To-Do)

                        }
                        break;
                    case "UPDATE_DEALER": // Update Dealer Position - "UPDATE_DEALER;sit_position"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fUpdateDealerPosition", $"{sitPosition}");
                            //eventQueue.EnqueueAction(fUpdateDealerPosition(sitPosition));
                        }
                        break;
                    case "PLAYER_TURN": // Player Turn - "PLAYER_TURN;sit_position;amountToCall;minBet;maxBet;valid_action1;valid_action2;valid_action3" - "PLAYER_TURN;2;10;100;fold;call;raise"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            float timeToAct = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePlayerTurn", $"{sitPosition}", $"'{timeToAct.ToString("0.00").Replace(",", ".")}'");
                            //eventQueue.EnqueueAction(fOpponentTurn(sitPosition));
                            if (args.Length > 3)
                            {
                                {
                                    float amountToCall = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
                                    float minBet = float.Parse(args[4], System.Globalization.CultureInfo.InvariantCulture);
                                    float maxBet = float.Parse(args[5], System.Globalization.CultureInfo.InvariantCulture);
                                    //List<string> validActions = new List<string>();
                                    string validActions = "[";
                                    for (int j = 6; j < args.Length; j++)
                                    {
                                        validActions += $"'{args[j]}'";
                                        if (j != args.Length - 1)
                                        {
                                            validActions += ", ";
                                        }
                                        else
                                        {
                                            validActions += "]";
                                        }
                                        //validActions.Add(args[j]);

                                    }
                                    this.fExecuteJavaScriptFunction("fLocalPlayerTurn", $"'{amountToCall.ToString("0.00").Replace(",", ".")}'", $"'{minBet.ToString("0.00").Replace(",", ".")}'", $"'{maxBet.ToString("0.00").Replace(",", ".")}'", $"{validActions}", $"'{timeToAct.ToString("0.00").Replace(",", ".")}'");
                                    //eventQueue.EnqueueAction(fPlayerTurn(sitPosition, amountToCall, minBet, maxBet, validActions)); ;
                                }
                            }
                        }
                        break;
                    case "UPDATE_PLAYER_STACK": // Update Player Stack - "UPDATE_PLAYER_STACK;sit_position;amount"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            float stack = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePlayerStack", $"{sitPosition}", $"'{stack.ToString("0.00")}'");
                            //eventQueue.EnqueueAction(fUpdatePlayerStack(sitPosition, amount));
                        }
                        break;
                    case "PLAYER_POOL": // Update Player Stack - "UPDATE_PLAYER_STACK;sit_position;amount"
                        Console.Write(args[1]);
                        break;
                    case "UPDATE_PLAYER_BET": // Update Player Bet Chips - "UPDATE_PLAYER_BET;sit_position;amount"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            float betAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePlayerBet", $"{sitPosition}", $"'{betAmount.ToString("0.00")}'");
                            //eventQueue.EnqueueAction(fUpdatePlayerBetChips(sitPosition, betAmount));
                        }
                        break;
                    case "UPDATE_POT_AMOUNT": // Update Pot Amount - "UPDATE_POT_AMOUNT;amount"
                        if (int.TryParse(args[1], out number))
                        {
                            int potNumber = number;
                            float potAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fUpdatePotAmount", $"{potNumber}", $"'{potAmount.ToString("0.00")}'");
                            //eventQueue.EnqueueAction(fUpdatePotAmount(potNumber, potAmount));
                        }
                        break;
                    case "PLAYER_CARD": // Show Player Card - "PLAYER_CARD;sit_position;card" - 1; JcKc#
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            List<string> playerCards = new List<string>();
                            if (args.Length == 3)
                            {
                                //string card1 = args[2].Substring(0, 2);
                                //string card2 = args[2].Substring(2, 2);
                                //this.fExecuteJavaScriptFunction("fAddCardToSlot", $"card1Seat{sitPosition}", $"'<br/>{card1}'");
                                //this.fExecuteJavaScriptFunction("fAddCardToSlot", $"card2Seat{sitPosition}", $"' {card2}'");
                                for (int z = 0; z < args[2].Length / 2; z++)
                                {
                                    playerCards.Add(args[2].Substring(z * 2, 2));
                                }
                                for (int z = 1; z <= playerCards.Count; z++)
                                {
                                    this.fExecuteJavaScriptFunction("fAddCardToSlot", $"'card{z}'", $"{sitPosition}", $"'{playerCards[z - 1]}'");
                                }
                                //eventQueue.EnqueueAction(fShowPlayerCards(sitPosition, args[2], false)); // Cards are no hidden.
                            }
                            else
                            {
                                //TODO if table is omaha, do this 4 times instead of 2.
                                this.fExecuteJavaScriptFunction("fAddCardToSlot", $"'card1'", $"{sitPosition}", $"'card'");
                                this.fExecuteJavaScriptFunction("fAddCardToSlot", $"'card2'", $"{sitPosition}", $"'card'");
                                //eventQueue.EnqueueAction(fShowPlayerCards(sitPosition, "", true)); // Cards are hidden.
                            }
                        }
                        break;
                    case "SHOW_TABLE_CARD": // Show Table Card - "SHOW_TABLE_CARD;cardslot;card" - flop;JcKc2h# turn;8c# river;2s#
                        string cardSlot = args[1];
                        //List<string> cards = new List<string>();
                        if (cardSlot == "flop")
                        {
                            this.fExecuteJavaScriptFunction("fAddCardToBoard", $"boardC1", $"'{args[2].Substring(0, 2)}'");
                            this.fExecuteJavaScriptFunction("fAddCardToBoard", $"boardC2", $"'{args[2].Substring(2, 2)}'");
                            this.fExecuteJavaScriptFunction("fAddCardToBoard", $"boardC3", $"'{args[2].Substring(4, 2)}'");
                        }
                        else if (cardSlot == "turn")
                        {
                            this.fExecuteJavaScriptFunction("fAddCardToBoard", $"boardC4", $"'{args[2].Substring(0, 2)}'");
                        }
                        else if (cardSlot == "river")
                        {
                            this.fExecuteJavaScriptFunction("fAddCardToBoard", $"boardC5", $"'{args[2].Substring(0, 2)}'");
                        }
                        //eventQueue.EnqueueAction(fShowTableCards(cardSlot, cards));
                        break;
                    case "NEW_HAND": // Start New Hand - "NEW_HAND;hand_number;small_blind;big_blind" - "NEW_HAND;22;2.5;5"
                        if (int.TryParse(args[1], out number))
                        {
                            int handNumber = number;
                            float smallBlind = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            float bigBlind = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
                            //eventQueue.EnqueueAction(fClearTable());
                            //this.fExecuteJavaScriptFunction("fClearTable");
                            this.fUpdateWindowTitle($"Hand: {handNumber} SB:{smallBlind} / BB:{bigBlind}"); //adicionar ante
                            //eventQueue.EnqueueAction(fNewHand(handNumber, smallBlind, bigBlind));
                        }
                        break;
                    case "CLEAR_TABLE": // Clear Table - "CLEAR_TABLE;" - "CLEAR_TABLE"
                        //this.fExecuteJavaScriptFunction("fClearTable");
                        this.fExecuteJavaScriptFunction("fResetTable");
                        //eventQueue.EnqueueAction(fClearTable());
                        break;
                    case "WINNER": // Round Winner(s) - "WINNER;sit_position;amount" - "WINNER;5;15.00"
                        if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            float wonAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
                            this.fExecuteJavaScriptFunction("fShowWinner", $"{sitPosition}", $"{wonAmount}");
                            //eventQueue.EnqueueAction(fShowRoundWinner(sitPosition, wonAmount));
                        }
                        break;
                    case "FOLD": // Confirm Fold - "FOLD;ok"	
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fFoldPlayerCards", $"{mySeat}");
                            this.fExecuteJavaScriptFunction("fDisableActionButtons");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        else if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fFoldPlayerCards", $"{sitPosition}");
                            this.fExecuteJavaScriptFunction("fDisableTime", $"{sitPosition}");
                        }
                        break;
                    case "CHECK": // Confirm Check - "CHECK;ok"
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fDisableActionButtons");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        else if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fDisableTime", $"{sitPosition}");
                        }
                        break;
                    case "CALL": // Confirm Call - "CALL;ok"
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fDisableActionButtons");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        else if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fDisableTime", $"{sitPosition}");
                        }
                        break;
                    case "SITOUT_NEXT_HAND": // Confirm Call - "CALL;ok"
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fSetSitOutNexHand", args[2]);
                        }
                        break;
                    case "SITOUT_NEXT_BB": // Confirm Call - "CALL;ok"
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fSetSitOutNexBB", args[2]);
                        }
                        break;
                    case "RAISE": // Confirm Raise - "RAISE;ok"
                        if (args[1] == "ok")
                        {
                            this.fExecuteJavaScriptFunction("fDisableActionButtons");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        else if (int.TryParse(args[1], out number))
                        {
                            int sitPosition = number;
                            this.fExecuteJavaScriptFunction("fDisableTime", $"{sitPosition}");
                        }
                        break;
                    case "SIT_OUT": // Sitout position x - "SITOUT;pos"
                        if (int.TryParse(args[1], out number))
                        {
                            this.fExecuteJavaScriptFunction("fSitOut", $"{number}");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        break;
                    case "CANCEL_SIT_OUT": // Sit in position x - "SIT_IN;pos"
                        if (int.TryParse(args[1], out number))
                        {
                            this.fExecuteJavaScriptFunction("fSitIn", $"{number}");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
                        }
                        break;
                    case "SIT_IN": // Sit in position x - "SIT_IN;pos"
                        if (int.TryParse(args[1], out number))
                        {
                            this.fExecuteJavaScriptFunction("fSitIn", $"{number}");
                            //eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
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
            //messages.Clear();
            return true;
        }
        public void fUpdateHtmlElement(string element, string property, string value)
        {
            Console.WriteLine("Updating HTML: " + $"document.getElementById('{element}').{ property} = { value}");
            while (!Browser.CanExecuteJavascriptInMainFrame)
                Thread.Sleep(100);
            Browser.ExecuteScriptAsync($"document.getElementById('{element}').{property} = {value}");
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
        public void fExecuteJavaScriptFunction(string funcName, string arg1 = null, string arg2 = null, string arg3 = null, string arg4 = null, string arg5 = null)
        {
            if (arg1 == null)
            {
                Log.WriteLog($"{funcName}();");
                Console.WriteLine($"{funcName}();");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                this.Browser.ExecuteScriptAsync($"{funcName}();");
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
            else if (arg5 == null)
            {
                Log.WriteLog($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
                Console.WriteLine($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1}, {arg2}, {arg3}, {arg4});");
            }
            else
            {
                Log.WriteLog($"{funcName}({arg1}, {arg2}, {arg3}, {arg4}, {arg5});");
                Console.WriteLine($"{funcName}({arg1}, {arg2}, {arg3}, {arg4}, {arg5});");
                while (!Browser.CanExecuteJavascriptInMainFrame)
                    Thread.Sleep(100);
                Browser.ExecuteScriptAsync($"{funcName}({arg1}, {arg2}, {arg3}, {arg4}, {arg5});");
            }
        }

        public MainWindow(string hash, string host)
        {
            hashSubscribe = hash;
            InitializeComponent();
            Browser = new ChromiumWebBrowser("localfolder://cefsharp/");
            Browser.RequestHandler = new CustomRequestHandler();
            Browser.Address = "mesa.html";
            //Browser.MenuHandler = new CustomMenuHandler();
            this.SourceInitialized += Window_SourceInitialized;
            this.Title = "Original Poker - Mesa";
            this.AddChild(Browser);

            sock.fTreatMessage += new cSocket.eTreatMessage(this.fTreatMessage);
            bEvents.fChangeWindow += new buttonEvents.eChangeWindow(this.fChangeWindow);
            bEvents.sock = sock;
            sock.fConnectToTcpServer(host);
            myPlayerName = hash.Split(';')[0];
            sock.fSendPacket("SUBSCRIBE_HASH;" + hash);
            //if connection !succesfulHelenos III - $0.10/$0.20 NLH

            //{
            //    abre Updater
            //    Exit()
            //}

            Point startPosition = new Point();
            this.PreviewMouseLeftButtonDown += (sender, e) =>
            {
                Moving = true;
                if (e.GetPosition(this).X <= 555 && e.GetPosition(this).Y <= 15)
                {
                    startPosition = e.GetPosition(this);
                }
                else
                {
                    startPosition.X = 9999;
                    startPosition.Y = 9999;
                }
            };

            this.PreviewMouseMove += (sender, e) =>
            {
                if (e.LeftButton == MouseButtonState.Pressed)
                {
                    Moving = true;
                    //Console.WriteLine("Movendo");
                    if (startPosition.X <= 555 && startPosition.Y <= 15)
                    {
                        Point endPosition = e.GetPosition(this);
                        Vector vector = endPosition - startPosition;
                        this.Left += vector.X;
                        this.Top += vector.Y;
                    }
                }
            };
            this.PreviewMouseLeftButtonUp += (sender, e) =>
            {
                Moving = false;
            };

            //Browser.AddHandler(MouseLeftButtonUpEvent, new RoutedEventHandler(writeMousePos), true);            
            //Browser.PreviewMouseLeftButtonUp += new MouseButtonEventHandler(leftButtonUp);
            //Browser.PreviewMouseRightButtonUp += new MouseButtonEventHandler(rightButtonUp);

            Browser.JavascriptObjectRepository.ResolveObject += (sender, e) =>
            {
                var repo = e.ObjectRepository;
                if (e.ObjectName == "buttonEvents")
                {
                    BindingOptions bindingOptions = null; //Binding options is an optional param, defaults to null
                    bindingOptions = BindingOptions.DefaultBinder; //Use the default binder to serialize values into complex objects, CamelCaseJavascriptNames = true is the default
                    repo.Register("buttonEvents", bEvents, isAsync: true, options: bindingOptions);
                }
            };

            Browser.JavascriptObjectRepository.ObjectBoundInJavascript += (sender, e) =>
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


        private void Window_SourceInitialized(object sender, EventArgs ea)
        {
            HwndSource hwndSource = (HwndSource)HwndSource.FromVisual((Window)sender);
            hwndSource.AddHook(DragHook);

            _aspectRatio = this.Width / this.Height;
        }

        private IntPtr DragHook(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            if (Moving)
                return IntPtr.Zero;
            switch ((WM)msg)
            {
                case WM.WINDOWPOSCHANGING:
                    {
                        bool changedSize = false;
                        Console.WriteLine("WM.WINDOWPOSCHANGING");
                        WINDOWPOS pos = (WINDOWPOS)Marshal.PtrToStructure(lParam, typeof(WINDOWPOS));

                        if ((pos.flags & (int)SWP.NOMOVE) != 0)
                        {
                            //Console.WriteLine("Saindo por NoMove");
                            return IntPtr.Zero;
                        }

                        Window wnd = (Window)HwndSource.FromHwnd(hwnd).RootVisual;
                        if (wnd == null)
                        {
                            //Console.WriteLine("Saindo por wnd=Null");
                            return IntPtr.Zero;
                        }

                        // determine what dimension is changed by detecting the mouse position relative to the 
                        // window bounds. if gripped in the corner, either will work.
                        if (!_adjustingHeight.HasValue)
                        {
                            //Console.WriteLine("if !_adjustingHeight.HasValue");

                            Point p = GetMousePosition();

                            double diffWidth = Math.Min(Math.Abs(p.X - pos.x), Math.Abs(p.X - pos.x - pos.cx));
                            double diffHeight = Math.Min(Math.Abs(p.Y - pos.y), Math.Abs(p.Y - pos.y - pos.cy));

                            _adjustingHeight = diffHeight > diffWidth;
                        }

                        if (_adjustingHeight.Value)
                        {
                            //Console.WriteLine("if _adjustingHeight.Value");
                            changedSize = true;
                            pos.cy = (int)(pos.cx / _aspectRatio); // adjusting height to width change
                        }
                        else
                        {
                            //Console.WriteLine("else _adjustingHeight.Value");
                            changedSize = true;
                            pos.cx = (int)(pos.cy * _aspectRatio); // adjusting width to heigth change
                        }

                        if (!changedSize)
                        {
                            return IntPtr.Zero;
                        }

                        Marshal.StructureToPtr(pos, lParam, true);
                        handled = true;
                    }
                    break;
                case WM.EXITSIZEMOVE:
                    //Console.WriteLine("WM.EXITSIZEMOVE");
                    _adjustingHeight = null; // reset adjustment dimension and detect again next time window is resized
                    break;
            }
            //Console.WriteLine("return IntPtr.Zero");

            return IntPtr.Zero;
        }
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
                Console.WriteLine("Carregando Mesa");
                chromiumWebBrowser.Load("file://" + System.IO.Path.GetFullPath(@"HTML Original\mesa.html"));

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
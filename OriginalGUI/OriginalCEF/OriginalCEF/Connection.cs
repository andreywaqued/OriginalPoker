using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using CefSharp.OriginalCEF;
using System.Linq;
using OriginalCEF;
using System.Windows;
using System.Net;

namespace TCPClient
{
    public class cSocket
    {
        private TcpClient socketConnection;
        private Thread clientReceiveThread;
        List<string> messages = new List<string>();
        private int port = 50000;
        public delegate bool eTreatMessage(string message);
        public event eTreatMessage fTreatMessage;
        public string host;

        public void fConnectToTcpServer(string host)
        {
            try
            {
                this.host = host;
                socketConnection = new TcpClient(host, port);
                clientReceiveThread = new Thread(new ThreadStart(fListenForData));
                clientReceiveThread.IsBackground = true;
                clientReceiveThread.Start();
            }
            catch (Exception e)
            {
                Console.WriteLine("On client connect exception " + e);
            }
        }
        public void fListenForData()
        {

            try
            {
                string serverMessage = "";
                Byte[] bytes = new Byte[1024];
                while (true)
                {
                    // Get a stream object for reading 				
                    using (NetworkStream stream = socketConnection.GetStream())
                    {
                        int length;
                        // Read incomming stream into byte arrary. 					
                        while ((length = stream.Read(bytes, 0, bytes.Length)) != 0)
                        {
                            var incommingData = new byte[length];
                            Array.Copy(bytes, 0, incommingData, 0, length);

                            // Convert byte array to string message. 						
                            serverMessage = Encoding.ASCII.GetString(incommingData);
                            Log.WriteLog("PACKET RECEIVED: " + ((IPEndPoint)socketConnection.Client.LocalEndPoint).Port.ToString() + ": " + serverMessage);
                            Console.WriteLine("PACKET RECEIVED: " + ((IPEndPoint)socketConnection.Client.LocalEndPoint).Port.ToString()  + ": " + serverMessage);
                            //string[] messages = serverMessage.Split('#');
                            if (!fTreatMessage(serverMessage))
                            {                                
                                stream.Close();
                                socketConnection.Close();
                                fTreatMessage("EveryOneClosed");
                                return;
                            }

                            
                            //// Treat messages received from server.
                            //int index;
                            //while ((index = serverMessage.IndexOf('#')) != -1)
                            //{
                            //    //tratar toda a informacao aqui.
                            //    Console.WriteLine("entrou no bagulho aqui");
                            //    //messages.Add(serverMessage.Substring(0, index));
                            //    serverMessage = serverMessage.Substring(index + 1);
                            //    Console.WriteLine(serverMessage);

                            //}
                        }
                    }

                }
            }
            catch (SocketException socketException)
            {
                Log.WriteLog("Socket exception: " + socketException);
                Console.WriteLine("Socket exception: " + socketException);
            }
            catch(InvalidOperationException socketException)
            {
                Log.WriteLog("Socket exception: " + socketException);
                Console.WriteLine("Socket exception: " + socketException);
            }
        }
        
        //Send message to server using socket connection.
        public void fSendPacket(string message)
        {
            if (socketConnection == null)
            {
                Log.WriteLog("connection null");
                Console.WriteLine("connection null");
                return;
            }
            try
            {
                // Get a stream object for writing. 			
                NetworkStream stream = socketConnection.GetStream();
                if (stream.CanWrite)
                {
                    string clientMessage = message;
                    // Convert string message to byte array.                 
                    byte[] clientMessageAsByteArray = Encoding.ASCII.GetBytes(clientMessage);
                    // Write byte array to socketConnection stream.                 
                    stream.Write(clientMessageAsByteArray, 0, clientMessageAsByteArray.Length);
                    Log.WriteLog("PACKET SEND: " + message);
                    Console.WriteLine("PACKET SEND: " + message);
                }
            }
            catch (SocketException socketException)
            {
                Log.WriteLog("Socket exception: " + socketException);
                Console.WriteLine("Socket exception: " + socketException);
            }
            catch (InvalidOperationException socketException)
            {
                Log.WriteLog("Socket exception: " + socketException);
                Console.WriteLine("Socket exception: " + socketException);
            }
        }
    }
}

//// This class is responsible for connecting with the game servers and exchanging messages with it.
//public class TCPClient 
//{
//    // Local Variables




//    List<string> messages = new List<string>(); // List with all the messages received from the server, waiting to be treated.

//    // Setup socket connection. 	


//    //LocalHost for test purposes
//    public void ConnectToTcpServerLocalHost()
//    {
//        host = "localhost";
//        ConnectToTcpServer();
//    }

//    //LocalHost for test purposes
//    public void ConnectToTcpServerAlexander()
//    {
//        host = "192.168.61.14";
//        ConnectToTcpServer();
//    }

//    // Runs in background clientReceiveThread; Listens for incomming data.


//    // Send message to server using socket connection. 	
//    private void SendPacket(string message)
//    {
//        if (socketConnection == null)
//        {
//            return;
//        }
//        try
//        {
//            // Get a stream object for writing. 			
//            NetworkStream stream = socketConnection.GetStream();
//            if (stream.CanWrite)
//            {
//                string clientMessage = message;
//                // Convert string message to byte array.                 
//                byte[] clientMessageAsByteArray = Encoding.ASCII.GetBytes(clientMessage);
//                // Write byte array to socketConnection stream.                 
//                stream.Write(clientMessageAsByteArray, 0, clientMessageAsByteArray.Length);
//                Console.WriteLine("PACKET SEND: " + message);
//            }
//        }
//        catch (SocketException socketException)
//        {
//            Console.WriteLine("Socket exception: " + socketException);
//        }
//    }

//    // This method checks for messages received from the server, and deal with it.
//    public void fCheckForMessages()
//    {
//        int number;
//        for (int i = 0; i < messages.Count; i++)
//        {
//            string msg = messages[i];
//            string[] args = msg.Split(';'); // Split message's arguments.

//            // Identify message and act properly.
//        //    switch (args[0])
//        //    {
//        //        case "SIGN_IN":
//        //            // (To-Do)
//        //            break;
//        //        case "RESERVE_SIT":
//        //            if (args[1] == "ok") // Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
//        //            {
//        //                float minStack = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                float maxStack = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);

//        //                eventQueue.EnqueueAction(fReserveSitForLocalPlayer(minStack, maxStack));
//        //            }
//        //            else if (int.TryParse(args[1], out number)) // Announce Reserved - "RESERVESIT;sit_position;player_name"
//        //            {
//        //                int sitPosition = number;
//        //                string playerName = args[2];
//        //                foreach (GameObject sit in gameController.seats)
//        //                {
//        //                    if (sit.GetComponent<cSeat>().position == sitPosition)
//        //                    {
//        //                        Console.WriteLine("My oponnent has reserved a sit, must show his sit");
//        //                        sit.GetComponent<cSeat>().fShowSit();
//        //                    }
//        //                }
//        //                eventQueue.EnqueueAction(fReserveSitForOpponents(sitPosition, playerName));
//        //            }
//        //            else if (args[1] == "invalid")
//        //            {
//        //                gameController.reservedSeatPosition = -1;
//        //            }
//        //            break;
//        //        case "REQUEST_BUY": // Amount To Buy - "REQUEST_BUY;min;max" - "REQUEST_BUY;50;100"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                if (args.Length == 4)
//        //                {
//        //                    float min = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                    float max = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
//        //                    gameController.fAskForSitStack(min, max);
//        //                }
//        //                //TODO anunciar aos adversários.
//        //            }
//        //            break;
//        //        case "SIT":
//        //            if (args[1] == "ok") // Confirm Sit Amount - "SIT;ok"
//        //            {
//        //                eventQueue.EnqueueAction(fConfirmLocalPlayerSitAmount());
//        //            }
//        //            else if (int.TryParse(args[1], out number)) // Announce Sit - "SIT;sit_position;stack_amount"
//        //            {
//        //                int sitPosition = number;
//        //                float stack = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fAnnounceOpponentsSit(sitPosition, stack));
//        //            }
//        //            break;
//        //        case "EXIT":
//        //            if (args[1] == "ok") // Confirm Exit - "EXIT;ok"
//        //            {
//        //                // (To-Do)
//        //            }
//        //            else if (int.TryParse(args[1], out number)) // Announce Exit - "EXIT;sit_position"
//        //            {
//        //                int sitPosition = number;
//        //                eventQueue.EnqueueAction(fAnnounceOpponentsExit(sitPosition));
//        //            }
//        //            break;
//        //        case "UPDATE_DEALER": // Update Dealer Position - "UPDATE_DEALER;sit_position"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                eventQueue.EnqueueAction(fUpdateDealerPosition(sitPosition));
//        //            }
//        //            break;
//        //        case "PLAYER_TURN": // Player Turn - "PLAYER_TURN;sit_position;amountToCall;minBet;maxBet;valid_action1;valid_action2;valid_action3" - "PLAYER_TURN;2;10;100;fold;call;raise"
//        //            if (int.TryParse(args[1], out number) && args.Length > 2)
//        //            {
//        //                int sitPosition = number;
//        //                float amountToCall = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                float minBet = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
//        //                float maxBet = float.Parse(args[4], System.Globalization.CultureInfo.InvariantCulture);
//        //                List<string> validActions = new List<string>();
//        //                for (int j = 5; j < args.Length; j++)
//        //                {
//        //                    validActions.Add(args[j]);
//        //                }
//        //                eventQueue.EnqueueAction(fPlayerTurn(sitPosition, amountToCall, minBet, maxBet, validActions)); ;
//        //            }
//        //            else
//        //            {
//        //                int sitPosition = number;
//        //                eventQueue.EnqueueAction(fOpponentTurn(sitPosition));
//        //            }
//        //            break;
//        //        case "UPDATE_PLAYER_STACK": // Update Player Stack - "UPDATE_PLAYER_STACK;sit_position;amount"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                float amount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fUpdatePlayerStack(sitPosition, amount));
//        //            }
//        //            break;
//        //        case "UPDATE_PLAYER_BET": // Update Player Bet Chips - "UPDATE_PLAYER_BET;sit_position;amount"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                float betAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fUpdatePlayerBetChips(sitPosition, betAmount));
//        //            }
//        //            break;
//        //        case "UPDATE_POT_AMOUNT": // Update Pot Amount - "UPDATE_POT_AMOUNT;amount"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int potNumber = number;
//        //                float potAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fUpdatePotAmount(potNumber, potAmount));
//        //            }
//        //            break;
//        //        case "PLAYER_CARD": // Show Player Card - "PLAYER_CARD;sit_position;card" - 1; JcKc#
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                if (args.Length == 3)
//        //                {
//        //                    eventQueue.EnqueueAction(fShowPlayerCards(sitPosition, args[2], false)); // Cards are no hidden.
//        //                }
//        //                else
//        //                {
//        //                    eventQueue.EnqueueAction(fShowPlayerCards(sitPosition, "", true)); // Cards are hidden.
//        //                }
//        //            }
//        //            break;
//        //        case "SHOW_TABLE_CARD": // Show Table Card - "SHOW_TABLE_CARD;cardslot;card" - flop;JcKc2h# turn;8c# river;2s#
//        //            string cardSlot = args[1];
//        //            List<string> cards = new List<string>();
//        //            if (cardSlot == "flop")
//        //            {
//        //                cards.Add(args[2].Substring(0, 2));
//        //                cards.Add(args[2].Substring(2, 2));
//        //                cards.Add(args[2].Substring(4, 2));
//        //            }
//        //            else
//        //            {
//        //                cards.Add(args[2].Substring(0, 2));
//        //            }
//        //            eventQueue.EnqueueAction(fShowTableCards(cardSlot, cards));
//        //            break;
//        //        case "NEW_HAND": // Start New Hand - "NEW_HAND;hand_number;small_blind;big_blind" - "NEW_HAND;22;2.5;5"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int handNumber = number;
//        //                float smallBlind = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                float bigBlind = float.Parse(args[3], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fClearTable());
//        //                eventQueue.EnqueueAction(fNewHand(handNumber, smallBlind, bigBlind));
//        //            }
//        //            break;
//        //        case "CLEAR_TABLE": // Clear Table - "CLEAR_TABLE;" - "CLEAR_TABLE"
//        //            eventQueue.EnqueueAction(fClearTable());
//        //            break;
//        //        case "WINNER": // Round Winner(s) - "WINNER;sit_position;amount" - "WINNER;5;15.00"
//        //            if (int.TryParse(args[1], out number))
//        //            {
//        //                int sitPosition = number;
//        //                float wonAmount = float.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture);
//        //                eventQueue.EnqueueAction(fShowRoundWinner(sitPosition, wonAmount));
//        //            }
//        //            break;
//        //        case "FOLD": // Confirm Fold - "FOLD;ok"	
//        //            if (args[1] == "ok")
//        //            {
//        //                eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
//        //            }
//        //            break;
//        //        case "CHECK": // Confirm Check - "CHECK;ok"
//        //            if (args[1] == "ok")
//        //            {
//        //                eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
//        //            }
//        //            break;
//        //        case "CALL": // Confirm Call - "CALL;ok"
//        //            if (args[1] == "ok")
//        //            {
//        //                eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
//        //            }
//        //            break;
//        //        case "RAISE": // Confirm Raise - "RAISE;ok"
//        //            if (args[1] == "ok")
//        //            {
//        //                eventQueue.EnqueueAction(fDisableActionsAfterConfirmation());
//        //            }
//        //            break;
//        //        default:
//        //            string unknown = "Message not Known: ";
//        //            foreach (string arg in args)
//        //            {
//        //                unknown += arg + ";";
//        //            }
//        //            Console.WriteLine(unknown);
//        //            break;
//        //    }
//        //    messages.RemoveAt(i); // Clean treated messages.
//        //    i--;
//        }
//    }

//    //// Event - Reserve Sit - "RESERVE_SIT;ok;min_stack;max_stack"
//    //private IEnumerator fReserveSitForLocalPlayer(float minStack, float maxStack)
//    //{
//    //    gameController.seats[gameController.reservedSeatPosition].GetComponent<cSeat>().fReserveSit(gameController.localPlayer.Nickname);
//    //    gameController.fAskForSitStack(minStack, maxStack);
//    //    yield return null;
//    //}

//    //// Event - Announce Reserved - "RESERVE_SIT;sit_position;player_name"
//    //private IEnumerator fReserveSitForOpponents(int sitPosition, string playerName)
//    //{
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fReserveSit(playerName);
//    //    yield return null;
//    //}

//    //// Event - Confirm Sit Amount - "SIT;ok"
//    //private IEnumerator fConfirmLocalPlayerSitAmount()
//    //{
//    //    if (gameController.localPlayer.LocalPlayerStack > 0)
//    //    {
//    //        //TODO verificar se o jogador esta na mao antes de mandar atualizar. Isso já está sendo feito no servidor, mas ele mostra o valor errado aqui.
//    //        gameController.localPlayer.LocalPlayerStack += float.Parse(gameController.contextInput);
//    //    }
//    //    else
//    //    {
//    //        gameController.localPlayer.LocalPlayerStack = float.Parse(gameController.contextInput);
//    //    }
//    //    gameController.localPlayer.LocalPlayerSeatPosition = gameController.reservedSeatPosition;
//    //    gameController.seats[gameController.reservedSeatPosition].GetComponent<cSeat>().fUpdateStack(gameController.localPlayer.LocalPlayerStack);
//    //    gameController.fToggleContextWindowOrGameButtons();
//    //    gameController.context = cGameController.Contexts.None;
//    //    yield return null;
//    //}

//    //// Event - Announce Sit - "SIT;sit_position;player_balance"
//    //private IEnumerator fAnnounceOpponentsSit(int sitPosition, float stack)
//    //{
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fUpdateStack(stack);
//    //    yield return null;
//    //}

//    //// Event - Announce Exit - "EXIT;sit_position"
//    //private IEnumerator fAnnounceOpponentsExit(int sitPosition)
//    //{
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fShowSitEmptySign();
//    //    if (gameController.localPlayer.LocalPlayerSeatPosition != -1)
//    //    {
//    //        gameController.seats[sitPosition].GetComponent<cSeat>().fHideSit();
//    //    }
//    //    yield return null;
//    //}

//    //// Event - Update Dealer Position - "UPDATE_DEALER;sit_position"
//    //private IEnumerator fUpdateDealerPosition(int sitPosition)
//    //{
//    //    // Disable Dealer Token for all players (PS: not a optimal solution)
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        sit.GetComponent<cSeat>().fDisableDealerToken();
//    //    }
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fEnableDealerToken(); // Enable Dealer Token for the correct player.
//    //    yield return null;
//    //}

//    //// Event - Player Turn - "PLAYER_TURN;sit_position;minBet;maxBet;valid_action1;valid_action2;valid_action3" - "PLAYER_TURN;2;10;100;fold;call;raise"
//    //private IEnumerator fPlayerTurn(int sitPosition, float amountToCall, float minBet, float maxBet, List<string> validActions)
//    //{
//    //    Console.WriteLine("Amount to Call: " + amountToCall + " minBet: " + minBet + " maxBet: " + maxBet);
//    //    // STEP 1: Highlight Correct Player
//    //    // Disable highligh for all players (PS: not a optimal solution)
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        sit.GetComponent<cSeat>().fRemoveHighlight();
//    //    }
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fHighlightPlayerTurn(); // Enable highlight for the correct player.

//    //    // STEP 2: Update minBet & maxBet.
//    //    gameController.fSetPlayerTurnVariables(amountToCall, minBet, maxBet);
//    //    // STEP 3: Update Valid Actions for the Local Player.
//    //    foreach (string action in validActions)
//    //    {
//    //        switch (action)
//    //        {
//    //            case "FOLD":
//    //                gameController.gameButtons.transform.Find("Fold (Button)").gameObject.SetActive(true);
//    //                break;
//    //            case "CALL":
//    //                TMPro.TextMeshProUGUI callText = gameController.gameButtons.transform.Find("Call (Button)").GetComponentInChildren<TMPro.TextMeshProUGUI>();
//    //                callText.text = "Call \n" + amountToCall.ToString("0.00").Replace(",", ".");
//    //                gameController.gameButtons.transform.Find("Call (Button)").gameObject.SetActive(true);
//    //                break;
//    //            case "CHECK":
//    //                gameController.gameButtons.transform.Find("Check (Button)").gameObject.SetActive(true);
//    //                break;
//    //            case "RAISE":
//    //                // Check if player is in All-In.
//    //                if (minBet == amountToCall && amountToCall != 0) //Amount to Call is equal or bigger than my stack
//    //                {
//    //                    TMPro.TextMeshProUGUI allInText = gameController.gameButtons.transform.Find("All-In (Button)").GetComponentInChildren<TMPro.TextMeshProUGUI>();
//    //                    allInText.text = "All-In \n" + minBet.ToString("0.00").Replace(",", ".");
//    //                    gameController.gameButtons.transform.Find("All-In (Button)").gameObject.SetActive(true);
//    //                    gameController.gameButtons.transform.Find("Call (Button)").gameObject.SetActive(false); // Disables call button.
//    //                }
//    //                else if (minBet == maxBet && minBet != amountToCall) //Amount to Call is smaller than my stack but the minimum amount I can raise is bigger than my stack.
//    //                {
//    //                    TMPro.TextMeshProUGUI allInText = gameController.gameButtons.transform.Find("All-In (Button)").GetComponentInChildren<TMPro.TextMeshProUGUI>();
//    //                    allInText.text = "All-In \n" + minBet.ToString("0.00").Replace(",", ".");
//    //                    gameController.gameButtons.transform.Find("All-In (Button)").gameObject.SetActive(true);
//    //                }
//    //                else // Regular Raise.
//    //                {
//    //                    gameController.gameButtons.transform.Find("Raise (Button)").gameObject.SetActive(true);
//    //                }
//    //                break;
//    //        }
//    //    }
//    //    yield return null;
//    //}

//    //// Event - Player Turn - "PLAYER_TURN;sit_position - "PLAYER_TURN;2;"
//    //private IEnumerator fOpponentTurn(int sitPosition)
//    //{
//    //    // STEP 1: Highlight Correct Player
//    //    // Disable highligh for all players (PS: not a optimal solution)
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        sit.GetComponent<cSeat>().fRemoveHighlight();
//    //    }
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fHighlightPlayerTurn(); // Enable highlight for the correct player.
//    //    yield return null;
//    //}

//    //// Event - Update Player Balance - "UPDATE_PLAYER_STACK;sit_position;amount"
//    //private IEnumerator fUpdatePlayerStack(int sitPosition, float amount)
//    //{
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fUpdateStack(amount);
//    //    yield return null;
//    //}

//    //// Event - Update Player Bet Chips - "UPDATE_PLAYER_BET;sit_position;value"
//    //private IEnumerator fUpdatePlayerBetChips(int sitPosition, float betAmount)
//    //{
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fUpdateBet(betAmount);
//    //    yield return null;
//    //}

//    //// Event - Update Pot Amount - "UPDATE_POT_AMOUNT;value"
//    //private IEnumerator fUpdatePotAmount(int potNumber, float potAmount)
//    //{
//    //    gameController.fUpdatePotAmount(potNumber, potAmount);
//    //    yield return null;
//    //}

//    //// Event - Show Player Card - "PLAYER_CARD;sit_position;card" - 1; JcKc#
//    //private IEnumerator fShowPlayerCards(int sitPosition, string cards, bool isHidden)
//    //{
//    //    // If cards are hidden, fill hand with cardbacks.
//    //    if (isHidden)
//    //    {
//    //        gameController.seats[sitPosition].GetComponent<cSeat>().fEnableCardsInHand();
//    //        gameController.fShowCard(gameController.deck.cardBack, gameController.seats[sitPosition].GetComponent<cSeat>().handPanel.transform.Find("Card Slot 1 (Image)").gameObject);
//    //        gameController.fShowCard(gameController.deck.cardBack, gameController.seats[sitPosition].GetComponent<cSeat>().handPanel.transform.Find("Card Slot 2 (Image)").gameObject);
//    //    }
//    //    else
//    //    {
//    //        // Otherwise, display player cards.
//    //        string firstCard = cards.Substring(0, 2);
//    //        string secondCard = cards.Substring(2, 2);
//    //        gameController.seats[sitPosition].GetComponent<cSeat>().fEnableCardsInHand();
//    //        gameController.fShowCard(gameController.deck.fFindCard(firstCard), gameController.seats[sitPosition].GetComponent<cSeat>().handPanel.transform.Find("Card Slot 1 (Image)").gameObject);
//    //        gameController.fShowCard(gameController.deck.fFindCard(secondCard), gameController.seats[sitPosition].GetComponent<cSeat>().handPanel.transform.Find("Card Slot 2 (Image)").gameObject);
//    //    }
//    //    yield return null;
//    //}

//    //// Event - Show Table Card - "SHOW_TABLE_CARD;cardslot;card" - "SHOW_TABLE_CARD;river;Qc"
//    //private IEnumerator fShowTableCards(string cardSlot, List<string> cards)
//    //{
//    //    switch (cardSlot)
//    //    {
//    //        case "flop":
//    //            gameController.fShowCard(gameController.deck.fFindCard(cards[0]), gameController.flop1Slot);
//    //            gameController.fShowCard(gameController.deck.fFindCard(cards[1]), gameController.flop2Slot);
//    //            gameController.fShowCard(gameController.deck.fFindCard(cards[2]), gameController.flop3Slot);
//    //            break;
//    //        case "turn":
//    //            gameController.fShowCard(gameController.deck.fFindCard(cards[0]), gameController.turnSlot);
//    //            break;
//    //        case "river":
//    //            gameController.fShowCard(gameController.deck.fFindCard(cards[0]), gameController.riverSlot);
//    //            break;
//    //        default:
//    //            Console.WriteLine("Error at fShowTableCards in TCPClient - Default path taken");
//    //            break;
//    //    }
//    //    yield return null;
//    //}

//    //// Event - Start New Hand - "NEW_HAND;hand_number;small_blind;big_blind" - "NEW_HAND;22;1;2"
//    //private IEnumerator fNewHand(int handNumber, float smallBlind, float bigBlind)
//    //{
//    //    // Display Hand Number (To-Do)
//    //    yield return null;
//    //}

//    //// Event - CLEAR_TABLE - "CLEAR_TABLE;" - "CLEAR_TABLE;"
//    //private IEnumerator fClearTable()
//    //{
//    //    // Remove Winner Highlight from all players (PS: not a optimal solution)
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        sit.GetComponent<cSeat>().fRemoveHighlight();
//    //    }
//    //    // Remove all cards in player hands from previous turns.
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        gameController.fRemoveCard(sit.GetComponent<cSeat>().handPanel.transform.Find("Card Slot 1 (Image)").gameObject);
//    //        gameController.fRemoveCard(sit.GetComponent<cSeat>().handPanel.transform.Find("Card Slot 2 (Image)").gameObject);
//    //    }
//    //    // Remove all cards in the table.
//    //    gameController.fRemoveCard(gameController.flop1Slot);
//    //    gameController.fRemoveCard(gameController.flop2Slot);
//    //    gameController.fRemoveCard(gameController.flop3Slot);
//    //    gameController.fRemoveCard(gameController.turnSlot);
//    //    gameController.fRemoveCard(gameController.riverSlot);
//    //    // Clear all pots.
//    //    foreach (GameObject pot in gameController.extraPots)
//    //    {
//    //        pot.GetComponent<cPot>().amountValue = 0f; // Setting the amount value to 0 will automatically hid the pots.
//    //    }
//    //    yield return null;
//    //}

//    //// Event - Round Winner(s) - "WINNER;sit_position;value" - "WINNER;5;15.00"
//    //private IEnumerator fShowRoundWinner(int sitPosition, float wonAmount)
//    //{
//    //    // Remove player's turn highlight to showcase winner. (PS: not a o optimal solution)
//    //    foreach (GameObject sit in gameController.seats)
//    //    {
//    //        sit.GetComponent<cSeat>().fRemoveHighlight();
//    //    }
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fHighlightWinner(); // Showcase winner player (Highlight).
//    //    gameController.seats[sitPosition].GetComponent<cSeat>().fUpdateBet(wonAmount); // Display won amount on bet;
//    //    yield return null;
//    //}

//    //// Event - Used in Confirmation for Player Actions. (Confirm Fold - "FOLD;ok", Confirm Check - "CHECK;ok", Confirm Raise - "RAISE;ok", Confirm Call - "CALL;ok")
//    //private IEnumerator fDisableActionsAfterConfirmation()
//    //{
//    //    gameController.fDisableAllActionButtons();
//    //    yield return null;
//    //}

//    //#endregion

//    #region Messages Sent By This Client - Login

//    // Sign In - "SIGN_IN;unique_id" - "SIGN_IN;6785391"
//    public void fSendPacketSignIn(string uniqueId)
//    {
//        string msg = "SIGN_IN;" + uniqueId.ToString() + "#";
//        SendPacket(msg);
//    }

//    #endregion

//    #region Messages Sent By This Client - In Lobby

//    // Enter Table - "ENTER;table_id" - "ENTER;452187"
//    public void fSendPacketEnterTable(int tableId)
//    {
//        string msg = "ENTER;" + tableId.ToString() + "#";
//        SendPacket(msg);
//    }

//    #endregion

//    #region Messages Sent By This Client - In-Table
//    // Request ReserveSit - "RESERVESIT;sit_position" - "SIT;1"
//    public void fSendPacketRequestReserveSit(int sitPosition)
//    {
//        string msg = "RESERVE_SIT;" + sitPosition.ToString() + "#";
//        SendPacket(msg);
//    }

//    // Sit - "SIT;stack" - "SIT;75"
//    public void fSendPacketSit(float stack)
//    {
//        string msg = "SIT;" + stack.ToString("0.00").Replace(",", ".") + "#";
//        SendPacket(msg);
//    }

//    // Exit table - "EXIT"
//    public void fSendPacketExitTable()
//    {
//        string msg = "EXIT" + "#";
//        SendPacket(msg);
//    }

//    // SitOut(sitout) - "SITOUT"
//    public void fSendPacketSitOut()
//    {
//        string msg = "SITOUT" + "#";
//        SendPacket(msg);
//    }

//    // Request Buy Chips - "REQUESTBUY"
//    public void fSendPacketRequestBuyChips()
//    {
//        string msg = "REQUEST_BUY" + "#";
//        SendPacket(msg);
//    }

//    // Send Amount to Buy - "BUY;amount" - "BUY;75"
//    public void fSendPacketSendAmountToBuy(float amount)
//    {
//        string msg = "BUY;" + amount.ToString() + "#";
//        SendPacket(msg);
//    }

//    //public void SendPacketChat()
//    //public void SendPacketRequestHandHistory()
//    //public void SendPacketRequestTableStatus()

//    // #### In-Game Player Actions (In Table Scene) ####

//    // ImBackBlind - "BACK_NEXT_BLIND;active"
//    public void fSendPacketWaitBigBlind(bool activate)
//    {
//        int activateInt = 0;
//        if (activate == true)
//        {
//            activateInt = 1;
//        }
//        string msg = "WAIT_BIG_BLIND;" + activateInt.ToString() + "#";
//        SendPacket(msg);
//    }

//    // SitOutNextHand - "SITOUT_NEXT_HAND;active"
//    public void fSendPacketSitoutNextHand(bool activate)
//    {
//        int activateInt = 0;
//        if (activate == true)
//        {
//            activateInt = 1;
//        }
//        string msg = "SITOUT_NEXT_HAND;" + activateInt.ToString() + "#";
//        SendPacket(msg);
//    }

//    // SitOutNextBlind - "SITOUT_NEXT_BLIND;active"
//    public void fSendPacketSitoutNextBlind(bool activate)
//    {
//        int activateInt = 0;
//        if (activate == true)
//        {
//            activateInt = 1;
//        }
//        string msg = "SITOUT_NEXT_BLIND;" + activateInt.ToString() + "#";
//        SendPacket(msg);
//    }


//    // Fold Hand - "FOLD"
//    public void fSendPacketFoldHand()
//    {
//        string msg = "FOLD" + "#";
//        SendPacket(msg);
//    }

//    // Call BLIND - "BLIND"
//    public void fSendPacketCall()
//    {
//        string msg = "CALL" + "#";
//        SendPacket(msg);
//    }

//    // Check - "CHECK"
//    public void fSendPacketCheck()
//    {
//        string msg = "CHECK" + "#";
//        SendPacket(msg);
//    }

//    // Raise - "RAISE;value"
//    public void fSendPacketRaise(float value)
//    {
//        string msg = "RAISE;" + value.ToString("0.00").Replace(",", ".") + "#";
//        SendPacket(msg);
//    }

//    //public void SendPacketShowMyCards()
//    #endregion

//}
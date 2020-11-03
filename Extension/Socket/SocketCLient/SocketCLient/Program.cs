using System;
using SocketIOClient;

namespace SocketCLient
{

    // REFERENCIA https://archive.codeplex.com/?p=socketio4net
    //https://www.codeproject.com/Articles/598281/SocketIO-Programming-in-Csharp-using-SocketIO4Net
    class Program
    {
        static Client socket;
        public static String ip;
        public static String port;

        static void Main(string[] args)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Hello World!");
            try
            {
                socket = new Client("http://localhost:1617");
                socket.On("txt", (data) =>
                {
                    //MessageBox.Show(data.RawMessage);
                    String msg = data.Json.Args[0].ToString();
                    Console.Write(msg);
                    //MessageBox.Show(msg, "Received Data");
                });
                socket.Connect();
            }
            catch (Exception e)
            {
                Console.WriteLine("Something Went Wrong!!");
            }
            if (socket.ReadyState.ToString() == "Connecting")
            {
                userset();
            }
            else
            {
                Console.WriteLine(socket.IsConnected.ToString());
                Console.WriteLine(socket.ReadyState.ToString(), "Error!");
                Console.WriteLine("Failed To Connect To Server!", "Error!");
            }
            Console.WriteLine("=============================");
            Console.WriteLine("");
            Console.ResetColor();
        }
        public static void emit(String msg)
        {
            socket.Emit("private message", port + " : " + msg);

        }
        public static void userset()
        {
            if (socket != null)
                socket.Emit("newuser", port);
        }
        public static void disco()
        {
            if (socket != null)
                socket.Emit("exit", port);
            socket.Close();
        }
    }
}

using System;
using System.Diagnostics;

namespace TestOpen
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            //var proc = Process.Start(@"cmd.exe ", @"/c C:\Users\gvmck\OneDrive\Escritorio\test.txt");
            var proce = Process.Start(@"cmd.exe ", @"/c D:\Documents\AVIB\plugin\Extension\avib\avib\SockClient.cs");

        }
    }
}

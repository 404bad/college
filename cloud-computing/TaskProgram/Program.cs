using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void PrintNumbers()
    {
        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine("Task 1: " + i);
            Thread.Sleep(500);
        }
    }

    static void PrintLetters()
    {
        for (char c = 'A'; c <= 'E'; c++)
        {
            Console.WriteLine("Task 2: " + c);
            Thread.Sleep(500);
        }
    }

    static void Main()
    {
        Task t1 = new Task(PrintNumbers);
        Task t2 = new Task(PrintLetters);

        t1.Start();
        t2.Start();

        Task.WaitAll(t1, t2);

        Console.WriteLine("Tasks Completed");
    }
}﻿

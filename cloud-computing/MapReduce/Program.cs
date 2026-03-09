using System;
using System.Collections.Generic;

class MapReduceExample
{
    // Map Function
    static List<KeyValuePair<string, int>> Map(string text)
    {
        List<KeyValuePair<string, int>> mapped = new List<KeyValuePair<string, int>>();
        string[] words = text.Split(' ');
        foreach (string word in words)
        {
            mapped.Add(new KeyValuePair<string, int>(word.ToLower(), 1));
        }
        return mapped;
    }

    // Reduce Function
    static Dictionary<string, int> Reduce(List<KeyValuePair<string, int>> mappedData)
    {
        Dictionary<string, int> result = new Dictionary<string, int>();
        foreach (var pair in mappedData)
        {
            if (result.ContainsKey(pair.Key))
                result[pair.Key] += pair.Value;
            else
                result[pair.Key] = pair.Value;
        }
        return result;
    }

    static void Main()
    {
        string text = "hadoop mapreduce hadoop bigdata mapreduce data";
        var mapped = Map(text);
        var reduced = Reduce(mapped);

        Console.WriteLine("Word Count using MapReduce:\n");
        foreach (var item in reduced)
        {
            Console.WriteLine(item.Key + " : " + item.Value);
        }
    }
}

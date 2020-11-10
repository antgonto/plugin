// For Directory.GetFiles and Directory.GetDirectories
// For File.Exists, Directory.Exists
using System;
using System.IO;
using System.Collections;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Linq;

public class RecursiveFileProcessor
{
    public static void Main(string[] args)
    {
        //foreach (string path in args)
        //{
            string path = "D:/Documents/AVIB/plugin/Extension/example";
            if (File.Exists(path))
            {
                // This path is a file
                ProcessFile(path);
            }
            else if (Directory.Exists(path))
            {
                // This path is a directory
                ProcessDirectory(path);
            }
            else
            {
                Console.WriteLine("{0} is not a valid file or directory.", path);
            }
        //}
    }

    // Process all files in the directory passed in, recurse on any directories
    // that are found, and process the files they contain.
    public static void ProcessDirectory(string targetDirectory)
    {
        // Process the list of files found in the directory.
        string[] fileEntries = Directory.GetFiles(targetDirectory);
        foreach (string fileName in fileEntries)
            ProcessFile(fileName);

        // Recurse into subdirectories of this directory.
        string[] subdirectoryEntries = Directory.GetDirectories(targetDirectory);
        foreach (string subdirectory in subdirectoryEntries)
            ProcessDirectory(subdirectory);
    }

    // Insert logic for processing found files here.
    public static void ProcessFile(string path)
    {
       // Console.WriteLine("Processed file '{0}'.", path);
        if (path.EndsWith("cs"))
        {
            Console.WriteLine("Processed file '{0}'.", path);
            Console.WriteLine("FIIIILEEEEE");
            string readText = File.ReadAllText(path);
            var tree = CSharpSyntaxTree.ParseText(readText);
            var members = tree.GetRoot().DescendantNodes().OfType<MemberDeclarationSyntax>();

            foreach (var member in members)
            {
                var property = member as PropertyDeclarationSyntax;
                if (property != null)
                    Console.WriteLine("Property: " + property.Identifier);
                var method = member as MethodDeclarationSyntax;
                if (method != null)
                    Console.WriteLine("Method: " + method.Identifier);
            }
            //Console.WriteLine(readText);
        }

    }
}
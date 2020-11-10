using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Linq;

namespace readSyntax
{
    class Program
    {
        /*
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            var tree = CSharpSyntaxTree.ParseText(@"
            public class Sample
            {
            public string FooProperty {get; set;}
            public void FooMethod()
            {
            }
            }");

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
        }*/
    }
}

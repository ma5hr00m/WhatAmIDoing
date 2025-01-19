using System;
using System.Windows.Forms;
using UI;

class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        Application.Run(new FocusedAppTracker());
    }
}

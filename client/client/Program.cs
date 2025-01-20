using System;
using System.Windows.Forms;
using UI;

/**
 * 入口文件：
 * 入口，现阶段没什么特殊的
 * **/

class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        Application.Run(new FocusedAppTracker());
    }
}

using System;
using System.Windows.Forms;
using UI;

/**
 * ����ļ���
 * ��ڣ��ֽ׶�ûʲô�����
 * **/

class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        Application.Run(new FocusedAppTracker());
    }
}

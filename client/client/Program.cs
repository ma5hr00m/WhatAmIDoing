using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using System.Runtime.InteropServices;
using System.Windows.Forms;

class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        Application.Run(new FocusedAppTracker());
    }
}

public class FocusedAppTracker : Form
{
    private static string? previousWindowTitle = null;
    private static readonly string serverUrl = "http://localhost:4000/status/update";
    private static readonly HttpClient httpClient = new HttpClient();
    private Label currentAppLabel = new Label();
    private Label timeElapsedLabel = new Label();
    private Label updateStatusLabel = new Label();
    private Label lastUpdateTimestampLabel = new Label();
    private System.Windows.Forms.Timer timer;
    private DateTime lastUpdateTime;
    private bool lastUpdateSuccess;

    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);

    public FocusedAppTracker()
    {
        InitializeComponents();
        timer = new System.Windows.Forms.Timer { Interval = 1000 };
        timer.Tick += async (sender, e) => await CheckFocus();
        timer.Start();
    }

    private void InitializeComponents()
    {
        this.Text = "Current Focused Application";
        this.Size = new System.Drawing.Size(400, 250);
        this.StartPosition = FormStartPosition.CenterScreen;
        this.BackColor = System.Drawing.Color.White;

        currentAppLabel = CreateLabel(16, System.Drawing.Color.Black);
        timeElapsedLabel = CreateLabel(12, System.Drawing.Color.DarkGreen);
        updateStatusLabel = CreateLabel(12, System.Drawing.Color.DarkOrange);
        lastUpdateTimestampLabel = CreateLabel(12, System.Drawing.Color.Gray);

        this.Controls.Add(currentAppLabel);
        this.Controls.Add(timeElapsedLabel);
        this.Controls.Add(updateStatusLabel);
        this.Controls.Add(lastUpdateTimestampLabel);
    }

    private Label CreateLabel(float fontSize, System.Drawing.Color textColor)
    {
        return new Label
        {
            Dock = DockStyle.Top,
            TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
            Font = new System.Drawing.Font("Arial", fontSize, System.Drawing.FontStyle.Bold),
            ForeColor = textColor,
            Padding = new System.Windows.Forms.Padding(5),
            BackColor = System.Drawing.Color.Transparent
        };
    }

    private async Task CheckFocus()
    {
        IntPtr hWnd = GetForegroundWindow();
        if (hWnd != IntPtr.Zero)
        {
            int processId;
            GetWindowThreadProcessId(hWnd, out processId);

            try
            {
                using (Process process = Process.GetProcessById(processId))
                {
                    if (process != null && process.MainModule != null)
                    {
                        string windowTitle = Path.GetFileNameWithoutExtension(process.MainModule.FileName);

                        if (windowTitle != previousWindowTitle)
                        {
                            previousWindowTitle = windowTitle;
                            currentAppLabel.Text = windowTitle;
                            lastUpdateTime = DateTime.UtcNow;
                            lastUpdateSuccess = await SendStatusUpdate(windowTitle);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        UpdateElapsedTime();
        UpdateStatus();
        GC.Collect();
        GC.WaitForPendingFinalizers();
    }

    private void UpdateElapsedTime()
    {
        if (previousWindowTitle != null)
        {
            TimeSpan elapsed = DateTime.UtcNow - lastUpdateTime;
            timeElapsedLabel.Text = $"Elapsed Time: {elapsed.TotalSeconds:F0} s";
        }
    }

    private void UpdateStatus()
    {
        updateStatusLabel.Text = lastUpdateSuccess ? "Last Update: Successful" : "Last Update: Failed";
        lastUpdateTimestampLabel.Text = $"Last Update Time: {lastUpdateTime:O}";
    }

    private static async Task<bool> SendStatusUpdate(string applicationName)
    {
        var payload = new
        {
            application = applicationName,
            timestamp = DateTime.UtcNow.ToString("o")
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await httpClient.PostAsync(serverUrl, content);
            response.EnsureSuccessStatusCode();
            Console.WriteLine("Status update sent successfully.");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send status update: {ex.Message}");
            return false;
        }
    }
}

using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace Tracking
{
    public class AppTracker
    {
        private static string? previousWindowTitle = null;
        private static readonly string serverUrl = "http://localhost:4000/status/update";
        private static readonly HttpClient httpClient = new HttpClient();
        private Action<string, TimeSpan, bool, DateTime> updateUI;
        private System.Windows.Forms.Timer timer;
        private DateTime lastUpdateTime;
        private bool lastUpdateSuccess;

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);

        public AppTracker(Action<string, TimeSpan, bool, DateTime> updateUI)
        {
            this.updateUI = updateUI;
            timer = new System.Windows.Forms.Timer { Interval = 1000 };
            timer.Tick += async (sender, e) => await CheckFocus();
        }

        public void StartTracking()
        {
            timer.Start();
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
                                lastUpdateTime = DateTime.UtcNow;
                                lastUpdateSuccess = await SendStatusUpdate(windowTitle);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"错误: {ex.Message}");
                }
            }

            UpdateElapsedTime();

            if (GC.GetTotalMemory(false) > 1024 * 1024 * 100)
            {
                GC.Collect();
            }
        }

        private void UpdateElapsedTime()
        {
            if (previousWindowTitle != null)
            {
                TimeSpan elapsed = DateTime.UtcNow - lastUpdateTime;
                updateUI(previousWindowTitle, elapsed, lastUpdateSuccess, lastUpdateTime);
            }
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
                Console.WriteLine("状态更新成功发送。");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"发送状态更新失败: {ex.Message}");
                return false;
            }
        }
    }
}

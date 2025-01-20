using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

/**
 * 追踪功能模块：
 * 主体是一个定时器，固定时间触发一次，触发时借助windows API获取焦点窗口信息
 * 同步本地数据和server数据，同步本地数据（距上次更新时间需要单独计算）时一并更新到窗口
 * **/

namespace Tracking
{
    public class AppTracker
    {
        /**
         * 声明一堆东西
         * **/
        private static string? previousWindowTitle = null; // 上一个窗口标题
        private static readonly string serverUrl = "http://localhost:4000/status/update";
        private static readonly HttpClient httpClient = new HttpClient();
        private Action<string, TimeSpan, bool, DateTime> updateUI; // 更新UI的委托
        private System.Windows.Forms.Timer timer; // 定时器
        private DateTime lastUpdateTime; // 上次更新时间
        private bool lastUpdateSuccess; // 上次更新是否成功


        /**
         * 导入windows API函数，获取预期信息
         * **/
        // 用于获取当前前景窗口
        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();
        // 用于获取窗口的线程和进程ID
        [DllImport("user32.dll")]
        static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);

        /**
         * 构造函数，初始化更新UI的委托和定时器
         * **/
        public AppTracker(Action<string, TimeSpan, bool, DateTime> updateUI)
        {
            this.updateUI = updateUI;
            // 定时器间隔为1000毫秒
            timer = new System.Windows.Forms.Timer { Interval = 1000 };
            // 定时器触发时检查焦点
            timer.Tick += async (sender, e) => await CheckFocus(); 
        }

        // 启动跟踪
        public void StartTracking()
        {
            timer.Start();
        }

        /**
         * 检查当前焦点窗口主功能函数，触发时调用，获取更新信息并同步到服务器
         * **/
        private async Task CheckFocus()
        {
            // 获取当前前景窗口句柄
            IntPtr hWnd = GetForegroundWindow(); 
            if (hWnd != IntPtr.Zero)
            {
                int processId;
                // 获取窗口的进程ID
                GetWindowThreadProcessId(hWnd, out processId); 

                try
                {
                    // 获取进程信息
                    using (Process process = Process.GetProcessById(processId))
                    {
                        if (process != null && process.MainModule != null)
                        {
                            // 获取窗口标题
                            string windowTitle = Path.GetFileNameWithoutExtension(process.MainModule.FileName);

                            // 如果窗口标题发生变化，则更新状态
                            if (windowTitle != previousWindowTitle)
                            {
                                // 更新上一个窗口标题
                                previousWindowTitle = windowTitle;
                                // 更新最后更新时间
                                lastUpdateTime = DateTime.UtcNow;
                                // 发送状态更新
                                lastUpdateSuccess = await SendStatusUpdate(windowTitle);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // 捕获并输出异常
                    Console.WriteLine($"错误: {ex.Message}");
                }
            }

            // 更新经过的时间
            UpdateElapsedTime();

            // 如果内存使用超过100MB，则进行垃圾回收
            if (GC.GetTotalMemory(false) > 1024 * 1024 * 100)
            {
                GC.Collect();
            }
        }

        /**
         * 更新时间
         * **/
        private void UpdateElapsedTime()
        {
            if (previousWindowTitle != null)
            {
                TimeSpan elapsed = DateTime.UtcNow - lastUpdateTime;
                // 调用更新UI的委托
                updateUI(previousWindowTitle, elapsed, lastUpdateSuccess, lastUpdateTime);
            }
        }

        /**
         * 同步本地聚焦窗口信息到服务器
         * **/
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

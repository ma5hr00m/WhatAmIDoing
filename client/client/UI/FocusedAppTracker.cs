using System;
using System.Drawing;
using System.Windows.Forms;
using ReaLTaiizor.Controls;
using ReaLTaiizor.Forms;
using ReaLTaiizor.Manager;
using ReaLTaiizor.Util;

/**
 * 主UI：
 * windows->card/panel->components
 * 初始化窗体，创建跟踪器并开始跟踪（异步进行）
 * **/

namespace UI
{
    public class FocusedAppTracker : MaterialForm
    {
        /**
         * 声明各种变量实例
         * **/
        // 定义用于显示当前应用程序、已用时间、更新状态和最后更新时间的标签
        private MaterialLabel currentAppLabel = new MaterialLabel();
        private MaterialLabel timeElapsedLabel = new MaterialLabel();
        private MaterialLabel updateStatusLabel = new MaterialLabel();
        private MaterialLabel lastUpdateTimestampLabel = new MaterialLabel();
        // 跟踪器实例
        private Tracking.AppTracker appTracker;
        // 主题属性
        public MaterialSkinManager.Themes Theme { get; private set; }

        /**
         * 构造函数，各种初始化作业
         * **/
        public FocusedAppTracker()
        {
            // 初始化组件
            InitializeComponents();
            // 创建跟踪器并传入更新UI的方法
            appTracker = new Tracking.AppTracker(UpdateUI);
            // 开始跟踪
            appTracker.StartTracking();
        }

        /**
         * 初始化窗口组件
         * **/
        private void InitializeComponents()
        {
            // 窗口属性
            this.Text = "WhatAmIDoing";
            this.Size = new Size(600, 400);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Theme = MaterialSkinManager.Themes.LIGHT;
            this.BackColor = Color.FromArgb(240, 240, 240);

            // 创建TabControl
            TabControl tabControl = new TabControl
            {
                Dock = DockStyle.Fill
            };

            // 创建“主页” TabPage
            System.Windows.Forms.TabPage homeTab = new System.Windows.Forms.TabPage("主页");
            MaterialCard homePanel = CreateMaterialCard();

            // 创建标签并添加到“主页”面板
            currentAppLabel = CreateMaterialLabel(20, Color.Black, FontStyle.Bold);
            timeElapsedLabel = CreateMaterialLabel(16, Color.DarkGreen, FontStyle.Regular);
            updateStatusLabel = CreateMaterialLabel(16, Color.DarkOrange, FontStyle.Regular);
            lastUpdateTimestampLabel = CreateMaterialLabel(16, Color.Gray, FontStyle.Italic);

            // 将标签添加到“主页”面板
            homePanel.Controls.Add(currentAppLabel);
            homePanel.Controls.Add(timeElapsedLabel);
            homePanel.Controls.Add(updateStatusLabel);
            homePanel.Controls.Add(lastUpdateTimestampLabel);

            // 将“主页”面板添加到“主页” TabPage
            homeTab.Controls.Add(homePanel);

            // 创建“设置” TabPage
            System.Windows.Forms.TabPage settingsTab = new System.Windows.Forms.TabPage("设置");
            // 这里可以添加设置相关的控件，当前为空

            // 将TabPage添加到TabControl
            tabControl.TabPages.Add(homeTab);
            tabControl.TabPages.Add(settingsTab);

            // 将TabControl添加到窗体
            this.Controls.Add(tabControl);
        }

        // 封装一层MaterialLabel
        private MaterialLabel CreateMaterialLabel(float fontSize, Color textColor, FontStyle fontStyle)
        {
            var label = new MaterialLabel
            {
                Dock = DockStyle.Top,
                TextAlign = ContentAlignment.MiddleCenter,
                Font = new Font("Helvetica Neue", fontSize, fontStyle),
                ForeColor = textColor,
                Padding = new Padding(5),
                BackColor = Color.Transparent,
                AutoSize = true
            };

            label.MinimumSize = new Size(0, 30);
            return label;
        }

        // 创建MaterialCard面板的封装方法
        private MaterialCard CreateMaterialCard()
        {
            return new MaterialCard
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(20),
                BackColor = Color.White,
                ForeColor = Color.Black,
                BorderStyle = BorderStyle.FixedSingle
            };
        }

        // 更新UI的方法
        public void UpdateUI(string windowTitle, TimeSpan elapsedTime, bool updateSuccess, DateTime lastUpdateTime)
        {
            currentAppLabel.Text = windowTitle;
            timeElapsedLabel.Text = $"已用时间: {elapsedTime.TotalSeconds:F0} s";
            updateStatusLabel.Text = updateSuccess ? "最后更新: 成功" : "最后更新: 失败";
            lastUpdateTimestampLabel.Text = $"最后更新时间: {lastUpdateTime:HH:mm:ss}";
        }

        // 重写绘制事件
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e); // 调用基类绘制方法
        }
    }
}


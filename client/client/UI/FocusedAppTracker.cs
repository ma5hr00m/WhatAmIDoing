using System;
using System.Drawing;
using System.Windows.Forms;
using ReaLTaiizor.Controls;
using ReaLTaiizor.Forms;
using ReaLTaiizor.Manager;
using ReaLTaiizor.Util;

namespace UI
{
    public class FocusedAppTracker : MaterialForm
    {
        private MaterialLabel currentAppLabel = new MaterialLabel();
        private MaterialLabel timeElapsedLabel = new MaterialLabel();
        private MaterialLabel updateStatusLabel = new MaterialLabel();
        private MaterialLabel lastUpdateTimestampLabel = new MaterialLabel();
        private Tracking.AppTracker appTracker;

        public MaterialSkinManager.Themes Theme { get; private set; }

        public FocusedAppTracker()
        {
            InitializeComponents();
            appTracker = new Tracking.AppTracker(UpdateUI);
            appTracker.StartTracking();
        }

        private void InitializeComponents()
        {
            this.Text = "当前聚焦的应用程序";
            this.Size = new Size(400, 250);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Theme = MaterialSkinManager.Themes.LIGHT;
            this.BackColor = Color.FromArgb(240, 240, 240);

            MaterialCard panel = new MaterialCard
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(20),
                BackColor = Color.White,
                ForeColor = Color.Black,
                BorderStyle = BorderStyle.FixedSingle
            };

            currentAppLabel = CreateMaterialLabel(16, Color.Black);
            timeElapsedLabel = CreateMaterialLabel(12, Color.DarkGreen);
            updateStatusLabel = CreateMaterialLabel(12, Color.DarkOrange);
            lastUpdateTimestampLabel = CreateMaterialLabel(12, Color.Gray);

            panel.Controls.Add(lastUpdateTimestampLabel);
            panel.Controls.Add(updateStatusLabel);
            panel.Controls.Add(timeElapsedLabel);
            panel.Controls.Add(currentAppLabel);

            this.Controls.Add(panel);
        }

        private MaterialLabel CreateMaterialLabel(float fontSize, Color textColor)
        {
            var label = new MaterialLabel
            {
                Dock = DockStyle.Top,
                TextAlign = ContentAlignment.MiddleCenter,
                Font = new Font("Helvetica Neue", fontSize, FontStyle.Bold),
                ForeColor = textColor,
                Padding = new Padding(5),
                BackColor = Color.Transparent,
                AutoSize = true
            };

            label.MinimumSize = new Size(0, 30);

            return label;
        }

        public void UpdateUI(string windowTitle, TimeSpan elapsedTime, bool updateSuccess, DateTime lastUpdateTime)
        {
            currentAppLabel.Text = windowTitle;
            timeElapsedLabel.Text = $"已用时间: {elapsedTime.TotalSeconds:F0} s";
            updateStatusLabel.Text = updateSuccess ? "最后更新: 成功" : "最后更新: 失败";
            lastUpdateTimestampLabel.Text = $"最后更新时间: {lastUpdateTime:O}";
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
        }
    }
}

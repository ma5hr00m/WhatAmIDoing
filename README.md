# WhatAmIDoing

📹检测你正在PC上做什么，并通过自部署后端项目提供Web API

该项目是一个客户端-服务端应用，客户端为基于C#的桌面软件，负责监测用户当前活动窗口并将应用名称发送至服务端，服务端基于Express提供API供其他应用查询用户正在使用的软件。

项目尚处在初始开发阶段。

## client

基于csharp开发的WhatAmIDoing本地客户端。

- [ ] 使用项目上报
- [ ] GUI自定义服务端Url
- [ ] GUI自定义本地轮询频率、初始状态、黑白名单软件
- [ ] GUI美化
- [ ] 自定义状态字典
- [ ] 提供对Linux/MacOS系统的支持

## server

基于Express开发的WhatAmIDoing Web服务端。

- [ ] 支持客户端上传状态字典
- [ ] 优化API结构
- [ ] 添加认证功能
- [ ] Docker部署
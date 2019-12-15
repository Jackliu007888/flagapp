# flagapp 仿网易立个 flag

## 人类的本质是复读机

9012了，网易的一个网页吸引了我，动画很炫，于是乎想从零开始仿写一个。

## 目标

- 尽可能实现原有动画效果
- 写成教程，开源代码

## 准备

### 工具

- 谷歌浏览器（必备）
- [Full download JS/CSS/HTML - Chrome 网上应用店](https://chrome.google.com/webstore/detail/full-download-jscsshtml/jlgfpehamfinbdbdofmhakpcgjilbkol/related)

### 分析

目标网址：[你的新年Flag](http://h5.daxue.163.com/163/html/news/happynewyear2019/index.html)

由于页面做了 userAgent 的限制，所以要用谷歌浏览器的手机模式打开。

首屏是个等待加载资源的动画。打开 network Tab 可以看到加载了许多图片。

![67b9c361.png](http://ojbk.dddog.com.cn/67b9c361.png)

迫于没有设计资源，可以用 Full download 这款 Chrome 插件将静态资源都下载下来备用。

### 明确任务

#### 首屏（难度： 🌟 🌟 🌟）

![loading-screen.gif](http://ojbk.dddog.com.cn/loading-screen.gif)

- 加载资源
- 进场离场动画

#### 倒计时页（难度： 🌟 🌟 🌟 🌟 🌟）

![countdown-screen.gif](http://ojbk.dddog.com.cn/countdown-screen.gif)

- 倒计时效果
- 文字沿弧线改变颜色效果
- 音频加载
- 背景建筑物旋转
- 移动红点背景建筑物3D旋转，离场动画

#### 立flag步骤页（难度： 🌟 🌟 🌟）

![make-flag-screen.gif](http://ojbk.dddog.com.cn/make-flag-screen.gif)

- 雪花飘落效果
- Let's go 按钮效果
- 离场动画，文字上移效果

#### 选择 Flag 页（难度： 🌟 🌟 🌟 🌟）

![select-flag-screen.gif](http://ojbk.dddog.com.cn/select-flag-screen.gif)

- 背景动画
- 点击选择动画
- 点击选择，输入Flag，查看Flag实现

#### 选择背景搭配页（难度： 🌟 🌟 🌟 🌟 🌟）

 ![select-bg-screen.gif](http://ojbk.dddog.com.cn/select-bg-screen.gif)
 
- 颜色选择器
- 图片选择器
- 离场动画

#### 签署到生成图片（难度： 🌟 🌟 🌟 🌟 🌟）

![make-image.gif](http://ojbk.dddog.com.cn/make-image.gif)

- html 转 canvas，生成图片
- 期间动画

详见 
- [仿网易立个 flag（一）](http://note.dddog.com.cn/2019/01/27/%e4%bb%bf%e7%bd%91%e6%98%93%e7%ab%8b%e4%b8%aa-flag%ef%bc%88%e4%b8%80%ef%bc%89/)
- [仿网易立个 flag（二）](http://note.dddog.com.cn/2019/01/27/%e4%bb%bf%e7%bd%91%e6%98%93%e7%ab%8b%e4%b8%aa-flag%ef%bc%88%e4%ba%8c%ef%bc%89/)
- [仿网易立个 flag（三）](http://note.dddog.com.cn/2019/01/27/%e4%bb%bf%e7%bd%91%e6%98%93%e7%ab%8b%e4%b8%aa-flag%ef%bc%88%e4%b8%89%ef%bc%89/)
- [仿网易立个 flag（四）](http://note.dddog.com.cn/2019/01/27/%e4%bb%bf%e7%bd%91%e6%98%93%e7%ab%8b%e4%b8%aa-flag%ef%bc%88%e5%9b%9b%ef%bc%89/)
- [Jenkins 自动化打包部署](http://note.dddog.com.cn/2019/12/15/jenkins-%e8%87%aa%e5%8a%a8%e5%8c%96%e6%89%93%e5%8c%85%e9%83%a8%e7%bd%b2/)
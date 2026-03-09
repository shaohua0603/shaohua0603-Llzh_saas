# 蓝领智汇 SaaS 系统 - Demo阶段生产环境部署手册

**文档版本**: 1.0
**创建日期**: 2026-03-05
**适用版本**: Demo阶段
**预计阅读时间**: 30分钟

---

## 📋 目录

1. [概述](#1-概述)
2. [服务器配置要求](#2-服务器配置要求)
3. [云服务器购买指南](#3-云服务器购买指南)
4. [本地项目构建](#4-本地项目构建)
5. [服务器环境配置](#5-服务器环境配置)
6. [项目部署](#6-项目部署)
7. [域名与SSL配置](#7-域名与ssl配置)
8. [验证部署](#8-验证部署)
9. [日常维护](#9-日常维护)
10. [常见问题](#10-常见问题)

---

## 1. 概述

### 1.1 文档说明

本手册适用于**零运维基础**的技术人员，按照本手册步骤操作，可在30分钟内完成蓝领智汇 SaaS 系统 Demo 阶段的生产环境部署。

### 1.2 部署架构

本项目采用**前后端分离架构**，Demo 阶段使用纯静态部署，无需部署后端服务。

```
用户浏览器
    ↓
CDN 加速 (可选)
    ↓
Nginx 服务器
    ↓
静态资源 (HTML/CSS/JS)
    ↓
Mock.js 本地模拟数据
```

### 1.3 部署方式

本手册提供两种部署方式：

| 方式 | 难度 | 成本 | 适用场景 |
|------|------|------|----------|
| **方式一：云服务器+Nginx** | ⭐⭐ | ¥30-100/月 | 正式演示、需要域名 |
| **方式二：Vercel** | ⭐ | 免费 | 快速演示、临时使用 |

---

## 2. 服务器配置要求

### 2.1 最低配置要求

| 资源项 | 最低配置 | 说明 |
|--------|----------|------|
| **CPU** | 1核 | 演示足够 |
| **内存** | 2GB | 最低要求 |
| **系统盘** | 40GB | SSD 推荐 |
| **带宽** | 3Mbps | 共享带宽即可 |
| **月流量** | 300GB | 足够 Demo 使用 |

### 2.2 推荐配置

| 资源项 | 推荐配置 | 说明 |
|--------|----------|------|
| **CPU** | 2核 | 稳定性更好 |
| **内存** | 4GB | 预留扩展 |
| **系统盘** | 80GB | SSD |
| **带宽** | 5Mbps | 响应更快 |
| **月流量** | 500GB | 充足余量 |

### 2.3 服务器系统

| 项目 | 要求 |
|------|------|
| **操作系统** | Ubuntu 22.04 LTS (推荐) 或 CentOS 7+ |
| **架构** | x86_64 |
| **远程登录** | SSH |

### 2.4 软件环境

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **Nginx** | 1.18+ | Web 服务器 |
| **Node.js** | 18+ | 本地构建需要 |

---

## 3. 云服务器购买指南

### 3.1 云服务商推荐

| 服务商 | 学生优惠 | 推荐配置价格 | 特点 |
|--------|----------|--------------|------|
| **阿里云** | 有 | ¥30-50/月 | 稳定、备案方便 |
| **腾讯云** | 有 | ¥30-50/月 | 性价比高 |
| **华为云** | 有 | ¥30-50/月 | 政企客户多 |
| **Vercel** | 免费 | ¥0 | 无需服务器 |

> 💡 **建议**：如果是首次演示，推荐使用 **Vercel** 方案（免费且无需配置服务器）。如果需要正式演示或有域名需求，推荐使用 **阿里云** 或 **腾讯云**。

### 3.2 阿里云购买步骤（图文教程）

#### 步骤1：注册账号

1. 访问阿里云官网：https://www.aliyun.com/
2. 点击右上角"免费注册"
3. 完成手机号验证和企业/个人认证

#### 步骤2：选择云服务器 ECS

1. 登录后，在产品搜索框输入"云服务器 ECS"
2. 点击"立即购买"
3. 选择以下配置：
   - **产品**: 云服务器 ECS
   - **计费方式**: 按量付费（演示用）或 包年包月（长期用）
   - **地域**: 建议选择离用户最近的地域（如华东1杭州）
   - **实例规格**: ecs.t6-c1m1.large (2核2G) 或选择共享型 s6 (1核2G)
   - **镜像**: Ubuntu 22.04 64位
   - **存储**: 40GB SSD

#### 步骤3：网络配置

1. **带宽计费模式**: 按固定带宽
2. **带宽**: 5Mbps
3. **安全组**: 选择"新建安全组"，开放以下端口：
   - 80 (HTTP)
   - 443 (HTTPS)

#### 步骤4：设置登录密码

1. 设置服务器登录密码（记住此密码，后续登录需要）
2. 点击"立即购买"

#### 步骤5：记录服务器信息

购买成功后，在控制台找到云服务器 ECS，记录以下信息：

| 信息 | 位置 | 用途 |
|------|------|------|
| **公网IP地址** | 实例详情页 | 访问网站用 |
| **用户名** | 通常是 root | 登录服务器用 |
| **登录密码** | 购买时设置 | 登录服务器用 |

---

## 4. 本地项目构建

### 4.1 环境准备

#### 安装 Node.js

1. 访问 Node.js 官网：https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或 20.x）
3. 运行安装包，一步步点击"下一步"完成安装

#### 验证安装

打开命令提示符（CMD），输入以下命令验证：

```bash
node -v
# 输出类似：v18.20.0

npm -v
# 输出类似：9.8.0
```

### 4.2 项目构建

#### 步骤1：进入项目目录

```bash
# 进入项目根目录
cd e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform
```

> ⚠️ 注意：请将命令中的路径替换为您实际的项目路径（注意 Windows 系统使用反斜杠）

#### 步骤2：安装依赖

```bash
npm install
```

> 💡 此命令可能需要等待3-5分钟，请耐心等待

#### 步骤3：构建项目

```bash
npm run build
```

构建成功后，会在项目根目录生成一个 `dist` 文件夹，这就是要部署到服务器的静态文件。

#### 步骤4：验证构建结果

```bash
# 查看 dist 文件夹
ls dist
# Windows 系统使用：
dir dist
```

应该能看到以下文件：
- `index.html`
- `assets/` 文件夹
- 其他静态资源

---

## 5. 服务器环境配置

### 5.1 通过工具连接服务器

#### Windows 系统

推荐使用 **Xshell** 或 **PuTTY** 连接服务器：

1. 下载安装 Xshell：https://www.xshell.com/
2. 新建连接：
   - 主机：您的服务器公网IP
   - 协议：SSH
   - 端口：22
3. 输入用户名 `root` 和密码
4. 点击"连接"

#### Mac / Linux 系统

直接使用终端：

```bash
ssh root@您的服务器IP
# 然后输入密码
```

### 5.2 安装 Nginx

#### Ubuntu 系统

```bash
# 更新软件包
apt update

# 安装 Nginx
apt install -y nginx

# 验证安装
nginx -v
# 输出：nginx version: nginx/1.18.0 (Ubuntu)
```

#### CentOS 系统

```bash
# 安装 Nginx
yum install -y nginx

# 启动 Nginx
systemctl start nginx

# 设置开机自启
systemctl enable nginx
```

### 5.3 配置防火墙

```bash
# 开放 80 和 443 端口
ufw allow 80/tcp
ufw allow 443/tcp

# 启动防火墙（可选）
ufw enable
```

### 5.4 创建部署目录

```bash
# 创建项目目录
mkdir -p /var/www/blue-collar-platform

# 设置目录权限
chmod -R 755 /var/www/blue-collar-platform
```

---

## 6. 项目部署

### 6.1 上传静态文件到服务器

#### 方法一：使用 Xftp（推荐）

1. 下载安装 Xftp：https://www.xshell.com/
2. 打开 Xftp，新建连接（填写服务器IP、用户名、密码）
3. 在左侧找到本地 `dist` 文件夹
4. 拖拽到右侧服务器的 `/var/www/blue-collar-platform` 目录
5. 等待上传完成

#### 方法二：使用命令行

```bash
# 在本地项目目录执行
# 先安装依赖（如果提示没有命令）
npm install -g vsftp

# 使用 scp 命令上传
scp -r dist/* root@您的服务器IP:/var/www/blue-collar-platform/
```

### 6.2 配置 Nginx

#### 创建配置文件

```bash
# 创建配置文件
nano /etc/nginx/sites-available/blue-collar-platform
```

#### 粘贴以下配置

```nginx
server {
    listen 80;
    server_name 您的域名或服务器IP;

    # 根目录
    root /var/www/blue-collar-platform;
    index index.html;

    # 访问日志
    access_log /var/log/nginx/blue-collar-access.log;
    error_log /var/log/nginx/blue-collar-error.log;

    # SPA 路由支持 - 所有路径都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存配置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 安全头配置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

> ⚠️ **重要**：请将 `server_name` 后面的 `您的域名或服务器IP` 替换为实际值

#### 启用配置

```bash
# 创建软链接
ln -s /etc/nginx/sites-available/blue-collar-platform /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 7. 域名与SSL配置

### 7.1 域名解析

1. 购买域名（可在阿里云、腾讯云购买）
2. 进入域名控制台，添加解析记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| A | @ | 您的服务器公网IP |
| A | www | 您的服务器公网IP |

### 7.2 配置免费 SSL 证书（推荐 Let's Encrypt）

#### 安装 Certbot

```bash
# Ubuntu 系统
apt install -y certbot python3-certbot-nginx

# CentOS 系统
yum install -y certbot python3-certbot-nginx
```

#### 获取证书

```bash
# 执行证书申请（请将域名替换为您的实际域名）
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

> 💡 如果没有域名，可以使用服务器IP访问，只是没有 HTTPS

#### 自动续期

```bash
# 测试自动续期
certbot renew --dry-run

# 添加定时任务（自动续期）
crontab -e

# 添加以下行（每天凌晨3点检查续期）
0 3 * * * certbot renew --quiet
```

---

## 8. 验证部署

### 8.1 访问测试

打开浏览器，输入以下地址进行测试：

| 测试地址 | 说明 |
|----------|------|
| http://您的服务器IP | 直接用IP访问 |
| http://yourdomain.com | 用域名访问 |
| https://yourdomain.com | HTTPS 访问 |

### 8.2 验证清单

- [ ] 页面能够正常加载
- [ ] 页面样式显示正常
- [ ] 点击按钮有响应
- [ ] 能够切换不同页面（路由正常）
- [ ] 刷新页面不会404

### 8.3 常见问题排查

#### 问题1：页面显示空白

```bash
# 检查 Nginx 是否启动
systemctl status nginx

# 检查日志
tail -f /var/log/nginx/blue-collar-error.log
```

#### 问题2：页面样式丢失

检查 Nginx 配置中的 `root` 路径是否正确：

```nginx
root /var/www/blue-collar-platform;  # 确保路径正确
```

#### 问题3：刷新页面404

确保配置了 SPA 路由支持：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 9. 日常维护

### 9.1 常用命令

| 操作 | 命令 |
|------|------|
| 重启 Nginx | `systemctl restart nginx` |
| 查看 Nginx 状态 | `systemctl status nginx` |
| 查看访问日志 | `tail -f /var/log/nginx/blue-collar-access.log` |
| 查看错误日志 | `tail -f /var/log/nginx/blue-collar-error.log` |
| 重新加载配置 | `nginx -s reload` |

### 9.2 更新部署

当项目代码有更新时：

```bash
# 1. 在本地重新构建
npm run build

# 2. 上传新的 dist 文件（覆盖旧的）
# 使用 Xftp 或 scp 命令

# 3. 重启 Nginx
systemctl restart nginx
```

### 9.3 备份

建议定期备份以下内容：

1. `/var/www/blue-collar-platform/` 目录
2. `/etc/nginx/sites-available/blue-collar-platform` 配置文件

---

## 10. 常见问题

### Q1：没有域名可以部署吗？

**答**：可以，直接使用服务器公网IP地址访问即可。但建议购买域名以获得更好的演示效果和专业形象。

### Q2：需要备案吗？

**答**：如果使用国内服务器（阿里云、腾讯云等），域名需要备案。如果使用海外服务器（如 Vercel、AWS），则不需要备案。

### Q3：服务器需要续费吗？

**答**：需要。阿里云/腾讯云的服务器是按月/年付费的，到期前需要续费，否则会被回收。

### Q4：访问速度慢怎么办？

**答**：
1. 增加服务器带宽（5Mbps 以上）
2. 使用 CDN 加速
3. 配置静态资源缓存

### Q5：如何查看谁在访问网站？

**答**：查看 Nginx 访问日志：
```bash
tail -f /var/log/nginx/blue-collar-access.log
```

---

## 附录

### 附录A：快速部署方案（Vercel）

如果觉得服务器配置太复杂，可以使用 Vercel 方案：

1. 注册 Vercel 账号：https://vercel.com/
2. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```
3. 进入项目目录，执行：
   ```bash
   vercel
   ```
4. 按照提示操作，几分钟后即可获得一个可访问的网址

### 附录B：紧急联系人

如果在部署过程中遇到无法解决的问题，请联系：

| 角色 | 联系方式 |
|------|----------|
| 项目负责人 | [请填写] |
| 技术支持 | [请填写] |

---

**文档结束**

如有问题，请检查每一步是否按照文档操作。如果需要进一步帮助，请联系技术支持团队。

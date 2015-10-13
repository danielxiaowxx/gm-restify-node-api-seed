#### 开发前准备工作

```
npm pre-dev
```

#### 如何开发

1.启动后台服务

```
nodemon bin/www
```

2.启动前台服务

```
cd public
sudo gulp develop
```

#### 测试|生产环境如何发布

```
npm run deploy
```

#### 测试|生产环境如何启动服务

```
[NODE_ENV=] [PORT=] node bin/www
```
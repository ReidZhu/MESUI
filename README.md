# 介绍

- 该项目模板是基于 Ant Design Pro v5 二次开发的

--WTZ MES IBI 過賬前端後台： MESAPI

## 1. 相关文档

- Ant Design Pro v5: https://beta-pro.ant.design/docs/getting-started-cn
- UmiJS@3x: https://umijs.org/zh-CN/docs
- UmiJS@3x 插件: https://umijs.org/zh-CN/plugins/api
- ProComponents 重型组件: https://procomponents.ant.design/components

## 2. 在 Ant Design Pro v5 基础上做了哪些事情

- 登录 & 鉴权
- 权限管理(菜单渲染, 路由控制, 页面元素)
- umi-request 二次封装
- 去掉菜单国际化配置
- moment 全局配置 `src/global.ts`

### 2.1. 登录 & 鉴权

1. 用户输入账号密码登录成功, 接口返回 `token`, 将 `token` 存储到 cookie 中

- 之后所有请求的请求头都会带上`Authorization: ${token}`

1. 进入首页, 通过 `token` 换取用户信息 `currentUser` (id,name,permissions...), 将信息存储到`initialState`中
1. 之后这三种情况下会对用户登录状态进行鉴定:

- 页面跳转时, 根据`token + currentUser` 判断用户登录状态, 代码位置: `src/app.tsx` 的 `onPageChange`
- 请求接口时, 根据接口响应数据`res.errcode` 判断登录是否过期, 代码位置: `src/app.tsx` 的 `errorHandler`
- 刷新页面时(或直接进入系统非登录页), 通过 `token` 换取用户信息 `currentUser`, 如果失败则表示登录过期, 代码位置: `src/app.tsx` 的 `fetchUserInfo`

1. 当用户退出登录/登录失效时, 删除`token + currentUser(用户信息)`, 跳转登录页

### 2.2. 权限管理(菜单渲染, 路由控制, 页面元素)

- 权限管理的逻辑使用了 pro5 官方提供的方案, 系统涉及的权限码统一放在了 `useModel('@@initialState')`
- 细粒度划分每一个标签权限 详见 `3.3. 开发新页面`
- pro5 权限管理: https://beta-pro.ant.design/docs/authority-management-cn

### 2.3.自动登出 (30分钟无操作自动登出)
- 监控页面是否有操作,代码位置 `src\pages\document.ejs`
### 2.4. umi-request 二次封装

- 统一设置请求头字段 `Authorization`, 代码位置: `src/app.tsx` 的 `requestInterceptors`
- 错误异常统一处理, 代码位置: `src/app.tsx` 的 `errorHandler`

  - http status 非 2xx: notification 错误提示
  - http status 2xx, success 为 false: message 错误提示
  - 请求初始化时出错或者没有响应返回的异常: notification 提示网络异常

- 封装 `umi-request` 请求方法, 暴露`get,post,put...`方法, 方便使用: `src/utils/request.ts`

## 3. 快速开始

- 全局搜索 "TODO", 确认可能需要修改的地方

```bash
$ npm i
$ npm start # 本地启动
$ npm run build # 生产打包
```

### 3.1. 代码格式化

- 编辑器: VSCode
- 编辑器插件: Prettier-Code formatter(VSCode 插件) => 开启自动格式化(配合 `.vscode/settings.json`)
- 编辑器插件: ESLint => 开启 ESLint 规则检测

```bash
# 提交代码前, 执行下面命令自动格式化 ts,js 和 less 文件, ps: 有些格式问题可能需要手动才能修复
$ npm run lint:fix # eslint 修复 & stylelint 修复
```

### 3.2. 后端返回格式

> 不一致则根据实际接口修改对应代码

- 程式统一返回数据
// 响应数据
```js
{
  "status": 200,// 错误码, 200-表示成功, 400系统逻辑异常,500程式报错
  "msg": "账号或密码错误",// 提示信息
  "data": {} //交互数据
}
```


### 3.3. 开发新页面

1. 新建文件: `src/pages/*`
2. 配置路由: `config/routes.ts`
3. 如果需要权限控制(细粒度):
```html
/*引入*/
import { useAccess, Access } from 'umi';
/*引用*/
const access = useAccess();
/*使用 如无权限无需显示 删除 fallback 内容*/
<Access accessible={access.lableFilter("mes")} fallback={<h2>你没有mes权限</h2>}>
  /*需要验证的组件*/
</Access>
```

### 3.4. 定义请求方法和 ts 类型的位置

- 定义公共的请求方法 `src/services/***.ts`
- 定义公共的 ts 类型 `src/services/API.d.ts`

- 定义页面独有的请求方法 `src/pages/***/services.ts`
- 定义页面独有的 ts 类型 `src/pages/***/data.d.ts`

### 3.5. 前端 excel 工具类

```js
//具体详情请参看方法注释
import { createExcle, readerExcle } from '@/utils/excleUtils';
/**
 *  通用下載Excle
 * @param1 array  默认对象数组第一个为Excle表头     -必选
 * @param2 fileName  生成的文件名称(后缀为 .xlsx)   -必选
 * @param3 diyHeader  自定义头部如['姓名','年龄']   -可选参数
 */
createExcle(param1,param2,param3);

/**
 * 通用读取Excle并返回json格式数据
 * @param1 file 要读取的文件                                                           -必填
 * @param2 keyArray 返回json格式的key数组如['name','age'],注意和文件头部位置对应         -必填
 * @param3 callback 回调函数会返回读出来的json数据                                      -必填
 * @param4 extraParams 额外的参数{key:value,key:value}                                 -可选
 */
readerExcle(param1,param2,param3,param4);

```

## 4. 目录

```bash
├── config
│   ├── config.ts # umi 配置文件
│   ├── defaultSettings.ts # 默认配置: 标题, logo, 主题...
│   ├── proxy.ts # 本地开发配置反向代理
│   └── routes.ts # 路由,菜单配置
├── public
│   ├── favicon.ico
│   ├── home_bg.png
│   └── logo.png
├── src
│   ├── access.ts # 返回权限对象
│   ├── app.tsx # 运行时配置: 应用初始数据, layout, umi-request
│   ├── components # 公共组件
│   │   ├── Footer
│   │   │   └── index.tsx
│   │   ├── HeaderDropdown
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── RightContent
│   │       ├── AvatarDropdown.tsx
│   │       ├── index.less
│   │       └── index.tsx
│   ├── global.less # 全局样式
│   ├── global.tsx
│   ├── pages # 页面组件
│   │   ├── 404.tsx
│   │   ├── Admin.tsx
│   │   ├── Welcome.tsx # 欢迎页
│   │   ├── document.ejs # 相当于 index.html
│   │   └── user
│   │       └── login # 登录页
│   │           ├── index.less
│   │           └── index.tsx
│   ├── services # 公用的接口请求方法(页面独有请求方法可以放在 src/pages/xxx/services.ts)
│   │   ├── API.d.ts # 公用的 ts 类型(页面独有 ts 类型定义可以放在 src/pages/xxx/data.d.ts)
│   │   ├── login.ts # 登录相关接口
│   │   └── user.ts # 用户信息相关接口
│   ├── typings.d.ts
│   └── utils
│       ├── auth.ts # 管理 token 的方法(为了实现子域名之间共享登录状态默认存储在 cookie 中, 可改为 localStorage)
│       ├── request.ts # 再次封装 umi-reuqest, 暴露 get, post, put...方法
│       ├── sleep.ts # 暂停函数
│       ├── utils.less
│       └── utils.ts
└── tsconfig.json
```

import React, { useEffect, useRef, useState } from 'react';
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
  PageLoading,
  MenuDataItem,
  SettingDrawerProps,
} from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import { getToken, removeToken } from './utils/auth';
import goLoginPage from './utils/goLoginPage';
import { checkMenu } from './utils/routesUtils';
import storageUtils from './utils/storageUtils';
import { StarFilled } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-table';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// https://umijs.org/zh-CN/plugins/plugin-initial-state
/** getInitialState 会在整个应用最开始时执行 */
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.UserInfoType;
  fetchUserInfo?: () => Promise<API.UserInfoType | undefined>;
  settingDrawer?: SettingDrawerProps;
}> {
  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    try {
      const currentUser: any = await queryCurrent({ username: storageUtils.getUser().name });
      currentUser.data.routes.push('mes');
      currentUser.data.routes.push('mes1');
      currentUser.data.permissions = currentUser.data.routes;
      currentUser.data.userInfoModel = { name: storageUtils.getUser().name };
      //const currentUser = {data:{permissions:['mes','mes1'],userInfoModel:{name: storageUtils.getUser().name}}}

      return currentUser.data;
    } catch (error) {
      removeToken();
      goLoginPage();
    }
    return undefined;
  };
  // 非登录页
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      settingDrawer: {
        hideCopyButton: true,
        hideHintAlert: true,
      },
    };
  }
  // 登录页
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

let love = {
  name: '我的最爱', // 对应菜单名,面包屑名,页面title
  routes: [],
};
// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.UserInfoType };
}): BasicLayoutProps & {
  childrenRender?: (dom: JSX.Element) => React.ReactNode;
} => {
  let actionRef: any;
  //定义一个数组存放不需要过滤的路由

  const arrurl: any = [
    '/user/login',
    '/welcome',
    '/report',
    '/report/MR01_Wip',
    '/report/MR02_Capacity',
    '/report/MR03_Record',
  ];
  return {
    actionRef: actionRef,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    // 页面跳转
    onPageChange: async () => {
      const { currentUser } = initialState;
      const { location } = history;
      const token = getToken();
      // 判断登录状态(无token或者无currentUser)
      if ((!token || !currentUser) && !arrurl.includes(location.pathname)) {
        removeToken();
        goLoginPage();
      }
    },
    menuItemRender: (itemProps: MenuDataItem, dom: any) => {
      return (
        <div
          onClick={() => {
            history.replace(itemProps.path || '');
          }}
        >
          <span>{dom} </span>
          {changeColor(itemProps.locale) == 'yellow' && !itemProps!.show ? (
            <></>
          ) : (
            <StarFilled
              style={{ fontSize: '15px', color: `${changeColor(itemProps.locale)}` }}
              onClick={() => {
                saveLove(itemProps);
                history.replace(itemProps.path || '');
              }}
            />
          )}
        </div>
      );
    },

    menuHeaderRender: undefined,
    menuDataRender: (e: any) => {
      love.routes = JSON.parse(localStorage.getItem(getName()) || '[]');
      e.unshift(love);
      return e;
    },
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 统一进行异常处理
 * 什么情况会进入该异常处理: 状态码非2xx | errcode!==0 | 请求没发出去或没有响应信息
 */
const errorHandler = (error: ResponseError) => {
  const { response, data } = error;
  if (response && response.status) {
    // 状态码非 2xx 的响应: 也就是业务处理异常
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (data.errcode) {
    // 状态码2xx & errcode!==0: 也就是业务处理失败
    const errmsg = data.errmsg || data.errMsg || '未知的业务处理错误'; // 兼容历史接口: 驼峰 or 全小写
    const errcode = data.errcode || data.errCode || '未知'; // 兼容历史接口: 驼峰 or 全小写
    // TODO: 请确认登录过期的 errcode
    if (errcode === 10110002) {
      // 10110002: 登录过期, token无效等表示需要重新登录
      removeToken();
      message.error('你的登录已失效, 请重新登录');
      goLoginPage();
    } else {
      // 其他错误码统一提示
      message.error(`${errmsg}(错误码:${errcode})`);
    }
  } else {
    // 请求发出前出错或没有响应
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

const getName = () => {
  return storageUtils.getUser().name;
};
/**
 * 保存我的最爱
 * @param name
 */
const saveLove = (itemProps: any) => {
  const { locale } = itemProps;
  let myLove = JSON.parse(localStorage.getItem(getName()) || '[]');
  let exist = false;
  myLove.forEach((e: any) => {
    if (e.locale == locale) exist = true;
  });
  if (exist) {
    myLove = myLove.filter((e: any) => {
      return e.locale != locale;
    });
  } else {
    itemProps.show = true;
    myLove.push(itemProps);
  }

  localStorage.setItem(getName(), JSON.stringify(myLove));
};
/**
 * 改变我的最爱颜色
 */
const changeColor = (locale: any) => {
  let myLove: [] = JSON.parse(localStorage.getItem(getName()) || '[]');
  let exist = false;
  myLove.forEach((e: any) => {
    if (e.locale == locale) exist = true;
  });
  return exist ? 'yellow' : 'black';
};

export const request: RequestConfig = {
  errorHandler,
  prefix: REACT_APP_API_URL,
  /**
   * https://umijs.org/zh-CN/plugins/plugin-request
   * 当后端接口不满足 plugin-request 规范的时候你需要通过该配置把后端接口数据转换为该格式
   * 注意: 该配置只是用于错误处理，不会影响最终传递给页面的数据格式。
   */
  errorConfig: {
    adaptor: (resData) => {
      const errcode = typeof resData.errcode === 'number' ? resData.errcode : resData.errCode; // 兼容历史接口: 驼峰 or 全小写
      const errmsg = resData.errmsg || resData.errMsg || '未知的业务处理错误'; // 兼容历史接口: 驼峰 or 全小写
      return {
        ...resData,
        success: errcode === 0, // errcode:0 表示业务处理成功, 后端接口返回的 success 不准确
        errorMessage: errmsg,
      };
    },
  },
  // 请求拦截器: 请求头增加 token
  requestInterceptors: [
    (url, options) => {
      const tmpOptions = options;
      const token = getToken();
      if (token) {
        tmpOptions.headers = { ...options.headers, Authorization: token };
      }
      return {
        options: tmpOptions,
        url,
      };
    },
  ],
};

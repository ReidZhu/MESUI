import request from '@/utils/request'; // 统一 请求接口

/** 登录 */
export async function accountLogin(
  params: API.LoginParamsType,
): Promise<API.BaseType<API.LoginResType>> {
  return request('base/common/login', {
    method: 'GET',
    params,
  });
}

/** 退出登录 */
export async function outLogin() {
  return request('/api/user/logout', { method: 'POST' });
}

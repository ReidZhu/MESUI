import { extend } from 'umi-request';
/** 配置request请求时的默认参数 */
const request = extend({
  prefix: 'http://mesauthorityapi.k8sdev-wok.k8s.wistron.com.cn/',
  // prefix: 'http://localhost:7001/',
});
/** 查询用户信息: 用户ID, 用户名, 权限码... */
export async function queryCurrent(params: any): Promise<API.BaseType<API.UserInfoType>> {
  return request('users/loginInfo', {
    method: 'GET',
    params,
  });
}

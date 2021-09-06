import request from '@/utils/request'; /** 获取数据 */

export async function login() {
  return request('base/common/visitors', {
    method: 'GET',
  });
}

/** 获取数据 */
export async function logout() {
  return request('base/common/logout', {
    method: 'GET',
  });
}

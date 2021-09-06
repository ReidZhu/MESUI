import request from '@/utils/request'; /** 获取数据 */

/** 获取数据 */
export async function checkusn(params: any) {
  return request('trans/t04/getUsnAndMo', {
    params,
    method: 'GET',
  });
}

export async function savePackage(data: any) {
  return request('trans/t04/savePackage', {
    data,
    method: 'POST',
  });
}

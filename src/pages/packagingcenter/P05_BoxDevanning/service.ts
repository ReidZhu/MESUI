import request from '@/utils/request';

/** 获取数据 */
export async function checkbox(params: any) {
  return request('trans/devanning/boxInfo', {
    params,
    method: 'GET',
  });
}

/**拆箱 */
export async function savedevanning(data: any) {
  return request('trans/devanning/devanning', {
    data,
    method: 'POST',
  });
}

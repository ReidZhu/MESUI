import request from '@/utils/request';

/** 获取数据 */
export async function checkreject(params: any) {
  return request('repair/R03/query', {
    params,
    method: 'GET',
  });
}

/**拆箱 */
export async function savedevanning(data: any) {
  return request('repair/R03/devanning', {
    data,
    method: 'POST',
  });
}

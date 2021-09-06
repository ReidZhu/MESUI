import request from '@/utils/request';

/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}
/** 获取数据 */
export async function query(params: any) {
  return request('repair/R01/queryMesBrwInfo', {
    params,
    method: 'GET',
  });
}
/** 维修点收 */
export async function check(data: any) {
  return request('repair/R01/checkAndAccept', {
    data,
    method: 'POST',
  });
}

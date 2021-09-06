import request from '@/utils/request';
import storageUtils from '@/utils/storageUtils';

/** 获取数据 */
export async function getDataU01(params: any) {
  return request('trans/u01ancelline/getupn', {
    params: { infoid: params },
    method: 'GET',
  });
}

/** 插入数据 */
export async function addU01(params: any) {
  return request('trans/u01ancelline/saveclear', {
    data: { data: params, username: storageUtils.getUser().name, ip: storageUtils.getUser().ip },
    method: 'POST',
  });
}

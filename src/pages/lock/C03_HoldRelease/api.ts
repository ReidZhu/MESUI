import request from '@/utils/request'; /** 获取数据 */

/** 获取数据 */
export async function check(params: any) {
  return request('base/C03/getOneMesInfoByInfoid', {
    params,
    method: 'GET',
  });
}

/** 获取数据 */
export async function checkrelease(params: any) {
  return request('base/C03/getHoldRelease', {
    params,
    method: 'GET',
  });
}

export async function save(data: any) {
  return request('base/C03/save', {
    data,
    method: 'POST',
  });
}

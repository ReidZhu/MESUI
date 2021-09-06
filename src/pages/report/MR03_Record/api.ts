import request from '@/utils/request'; /** 获取数据 */

/** 获取数据 */
export async function report03(params: any) {
  return request('report/MR03/getMestransaction', {
    params,
    method: 'GET',
  });
}

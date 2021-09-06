import request from '@/utils/request';
// import { extend } from 'umi-request';

// var request = extend({
//   prefix:'http://10.57.94.113:7001/'
// })

/** 获取数据 */
export async function getDataB10(params: any) {
  return request('base/mesMo/queryList', {
    params,
    method: 'GET',
  });
}

/** 修改数据/添加数据 */
export async function editB10(data: any) {
  return request('base/mesMo/update', {
    data,
    method: 'PUT',
  });
}


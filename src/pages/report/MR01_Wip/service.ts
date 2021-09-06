import request from '@/utils/request';
//import { request } from 'umi';

//const wipurl = 'http://10.57.94.71:7003/';
/**
 * 查询所有
 * @returns
 */
export async function findwip(params: any) {
  return request(`report/wip/query`, {
    method: 'GET',
    params,
  });
}

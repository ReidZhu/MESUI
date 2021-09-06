import request from '@/utils/request';
//import { request } from 'umi';

//const wipurl = 'http://10.57.94.71:7003/';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}
/**
 * 获取数据
 * @returns
 */
export async function findInfoid(params: any) {
  return request(`trans/Q01/infoid`, {
    method: 'GET',
    params,
  });
}
/**
 * OQC结批
 * @returns
 */
export async function saveBatch(data: any) {
  return request(`trans/Q01/oqcBatch`, {
    method: 'POST',
    data,
  });
}

/**
 * OQC结批
 * @returns
 */
export async function post(data: any) {
  return request(`trans/moveout/confirmMoveOut`, {
    method: 'POST',
    data,
  });
}

/**
 * OQC批号查询
 * @returns
 */
export async function getelot(params: any) {
  return request(`trans/Q01/query`, {
    method: 'GET',
    params,
  });
}

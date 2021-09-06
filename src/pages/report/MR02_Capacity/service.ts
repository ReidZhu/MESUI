import request from '@/utils/request';
//import { request } from 'umi';

//const wipurl = 'http://10.57.94.71:7003/';
/**
 * 生产主表
 * @returns
 */
export async function findMaster(params: any) {
  return request(`report/MR02/queryMaster`, {
    method: 'GET',
    params,
  });
}
/**
 * 投入产出明细
 * @returns
 */
export async function findDetail(params: any) {
  return request(`report/MR02/queryInputOutDetail`, {
    method: 'GET',
    params,
  });
}
/**
 * 不良明细
 * @returns
 */
export async function findNgDetail(params: any) {
  return request(`report/MR02/queryBadnessDetail`, {
    method: 'GET',
    params,
  });
}
/**
 * 不良汇总
 * @returns
 */
export async function findNgCollect(params: any) {
  return request(`report/MR02/queryBadnessCollect`, {
    method: 'GET',
    params,
  });
}

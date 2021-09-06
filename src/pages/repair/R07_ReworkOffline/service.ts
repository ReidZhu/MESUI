import request from '@/utils/request';
//import requesttest from '@/utils/request';
import { TypeNum } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function getMoList() {
  return request(`repair/reworkoffline/getMoList`, {
    method: 'GET',
  });
}
/**
 * 查询工單
 * @returns
 */
 export async function getMoInfo(mo: String) {
  return request(`trans/common/getMoInfo`, {
    method: 'GET',
    params: {mo:mo}
  });
}
/**
 * 查詢數量
 * @returns
 */
 export async function checkInput(data: any) {
  return request(`repair/reworkoffline/checkInput`, {
    method: 'POST',
    data
  });
}
/**
 * 查询流程
 * @returns
 */
 export async function findAllStep(routename:String) {
  return request(`repair/reworkoffline/getStep`, {
    method: 'GET',
    params:{routename:routename}
  });
}
/**
 * 提交
 * @returns
 */
 export async function confirmList(data: any) {
  return request(`repair/reworkoffline/confirmList`, {
    method: 'POST',
    data,
  });
}




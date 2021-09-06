import request from '@/utils/requesttrans';
import { TypeNum } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function getMoList() {
  return request(`trans/mdloffline/getMdlMoList`, {
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
  return request(`trans/mdloffline/checkInput`, {
    method: 'POST',
    data,
  });
}

/**
 * 提交
 * @returns
 */
 export async function confirmList(data: any) {
  return request(`trans/mdloffline/confirmList`, {
    method: 'POST',
    data,
  });
}




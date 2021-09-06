import request from '@/utils/request';

//import requesttest from '@/utils/requesttranstest';
import { TypeNum } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';


/**
 * 查询工單
 * @returns
 */
 export async function getMoLotList() {
  return request(`trans/mesoffline/getMoLotList`, {
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
 * 查詢機台
 * @returns
 */
export async function getMachine(mo: String) {
  return request(`trans/mesoffline/getMachine`, {
    method: 'GET',
    params: { mo },
  });
}
/**
 * 查詢數量
 * @returns
 */
 export async function getNum(usn: String,mo: String,lang: String) {
  return request(`trans/mesoffline/getLotNum`, {
    method: 'GET',
    params: { usn ,mo ,lang},
  });
}

/**
 * 提交
 * @returns
 */
 export async function confirmLotList(data: any) {
  return request(`trans/mesoffline/confirmLot`, {
    method: 'POST',
    data,
  });
}


/**
 * 查询工单对应pallet
 * @returns
 */
 export async function getPalletInfo(model: String) {
  return request(`trans/mesoffline/getPallet`, {
    method: 'GET',
    params: {model:model}
  });
}
/**
 * 查询pallet对应ary
 * @returns
 */
 export async function getAryInfo(palletid: String) {
  return request(`trans/mesoffline/getAry`, {
    method: 'GET',
    params: {palletid:palletid}
  });
}

/**
 * 查询pallet对应ary
 * @returns
 */
 export async function queryUpnInfo(upn: String) {
  return request(`trans/mesoffline/queryUpn`, {
    method: 'GET',
    params: {upn:upn}
  });
}




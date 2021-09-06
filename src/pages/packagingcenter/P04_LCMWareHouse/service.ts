import request from '@/utils/request';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}
/** 获取数据 */
export async function checkboxusn(params: any) {
  return request('trans/mesPallet/boxInfo', {
    params,
    method: 'GET',
  });
}

/** 获取数据 */
export async function checkusn(params: any) {
  return request('trans/mesPallet/usnInfo', {
    params,
    method: 'GET',
  });
}

/**箱号入库 */
export async function savepallet(data: any) {
  return request('trans/mesPallet/boxPallet', {
    data,
    method: 'POST',
  });
}

/**usn入库 */
export async function savepalletpcs(data: any) {
  return request('trans/mesPallet/usnPallet', {
    data,
    method: 'POST',
  });
}

/**查询栈板单号 */
export async function getpalletid(params: any) {
  return request('trans/mesPallet/queryPalletid', {
    params,
    method: 'GET',
  });
}

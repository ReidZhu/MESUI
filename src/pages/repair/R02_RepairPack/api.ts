import request from '@/utils/request';
import requesttrans from '@/utils/requesttrans';
import requesttest from '@/utils/requesttranstest';


/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}
/** 获取工單待打包數量 */
export async function getMoQty(params: any) {
  return request('repair/package/queryBrwPackageQtyByMo', {
    params,
    method: 'GET',
  });
}
/** 获取工單待打包數量 */
export async function getcheckusn(params: any) {
  return request('repair/package/checkUsn', {
    params,
    method: 'GET',
  });
}

/** 获取半品料號 */
export async function getcpn(params: any) {
  return request('base/select/queryCpnByMoAndStatus', {
    params,
    method: 'GET',
  });
}

/** 保存数据 */
export async function insertdata(data: any) {
  return request('repair/package/confirmPackage', {
    data,
    method: 'POST',
    // params: { lang: data.lang, ip: data.ip, line: data.line, machineid: data.machineid },
  });
}

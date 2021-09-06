import request from '@/utils/request';
import requesttest from '@/utils/requesttranstest';
/** 获取数据 */
export async function getData(params: any) {
  return request('trans/checkin/checkElot', {
    params,
    method: 'GET',
  });
}

/** 保存数据 */
export async function insertdata(data: any) {
  return request('trans/checkin/checkin', {
    data,
    method: 'POST',
    // params: { lang: data.lang, ip: data.ip, line: data.line, machineid: data.machineid },
  });
}

/** 获取数据 */
export async function getstage(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}


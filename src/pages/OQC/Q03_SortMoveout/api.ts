import request from '@/utils/request';
import requesttest from '@/utils/requesttranstest';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}

/** 保存数据 */
export async function insertdata(data: any) {
  return request('trans/moveout/confirmMoveOut', {
    data,
    method: 'POST',
    // params: { lang: data.lang, ip: data.ip, line: data.line, machineid: data.machineid },
  });
}

/**
 * 查询Elot信息
 * @returns
 */
export async function findQCElot(params: any) {
  return request('trans/moveout/checkQCElot', {
    method: 'GET',
    params
  });
}
/**
 * 查询infoid信息
 * @returns
 */
export async function findUsnInElot(params: any) {
  return request('trans/moveout/checkUsnInElot', {
    method: 'GET',
    params
  });
}

/**
 * 查询不良代码
 * @returns
 */
export async function findAllErrorCode(stage: any) {
  return request('base/select/queryAllErrorCodeAndDescr?stage=' + stage, {
    method: 'GET'
  });
}

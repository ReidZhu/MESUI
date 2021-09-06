import request from '@/utils/request';
import requesttest from '@/utils/requesttranstest';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}

/** 更新数据 */
export async function updateData(data: any) {
  return request('base/mesroute/update', {
    data,
    method: 'PUT',
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
 * 查询机台
 * @returns
 */
export async function findAllMachine(params: any) {
  console.log(params)
  return request('base/select/getMachineId', {
    method: 'GET',
    params
  });
}
/**
 * 查询USN信息
 * @returns
 */
export async function findMesInfo(params: any) {
  return request('trans/moveout/checkMesInfo', {
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

/**
 * 刪除數據
 * @returns
 */
export async function deleteByid(ids: any) {
  return request('base/mesroute/deleteByIds', {
    params: { ids },
    method: "DELETE",
  })
}

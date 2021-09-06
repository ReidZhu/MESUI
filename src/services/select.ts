import request from '@/utils/request';
import requesttrans from '@/utils/requesttrans';

/**
 * 查询站点
 * @returns
 */
export async function findAllStage() {
  return request(`base/select/stage`, {
    method: 'GET',
  });
}
/**
 * 查询线体
 * @returns
 */
export async function findAllLine() {
  return request(`base/select/line`, {
    method: 'GET',
  });
}
/**
 * 查询人員上線线体
 * @returns
 */
export async function findOnLine(params: any) {
  return request(`base/select/queryOnlineLineid`, {
    params,
    method: 'GET',
  });
}

/**
 * 查询不良代碼
 * @returns
 */
export async function findAllError() {
  return request(`base/select/errorCode`, {
    method: 'GET',
  });
}
/**
 * 查询流程
 * @returns
 */
export async function findAllRoute() {
  return request(`base/select/route`, {
    method: 'GET',
  });
}
/**
 * 查询流程
 * @returns
 */
export async function getRuleOption() {
  return request(`trans/L02/getSelectOption`, {
    method: 'GET',
  });
}

/**
 * 查询Upn
 * @returns
 */
export async function findAllUpn(flag: string) {
  return request(`base/select/upn`, {
    params: { flag },
    method: 'GET',
  });
}
/**
 * 查询Model
 * @returns
 */
export async function findAllModel() {
  return request(`base/select/model`, {
    method: 'GET',
  });
}
/**
 * 查询Mo
 * @returns
 */
export async function findMo(upn: any) {
  return request(`base/select/queryAllMoByUpn?upn=` + upn, {
    method: 'GET',
  });
}
/**
 * 查询Upn
 * @returns
 */
export async function findUpn(model: any) {
  return request(`base/select/queryAllUpnByModel?model=` + model, {
    method: 'GET',
  });
}
/**
 * By料號查询站點
 * @returns
 */
export async function findStage(upn: any) {
  return request(`base/select/queryAllStageWithMaterialByUpn?upn=` + upn, {
    method: 'GET',
  });
}
/**
 * By料號和站點查询料件
 * @returns
 */
export async function findStageMaterial(params: any) {
  return request('base/select/queryAllMaterialByUpnAndStage', {
    params,
    method: 'GET',
  });
}
/**
 * 查询过账小站点
 * @returns
 */
export async function findAllMstage(params: any) {
  return request(`base/select/queryAllMStageByRouteNameAndStage`, {
    params,
    method: 'GET',
  });
}
/**
 * 查询过账機台
 * @returns
 */
export async function findAllMachineid(params: any) {
  return request(`base/select/getMachineId`, {
    params,
    method: 'GET',
  });
}
/**
 * 查询上線人員
 * @returns
 */
export async function findAllOnlineUser(params: any) {
  return request(`base/select/queryOnlineUser`, {
    params,
    method: 'GET',
  });
}


/**
 * 查询類型
 * @returns
 */
export async function findAllType(paramitem: any) {
  return request(`base/select/queryParametersFlag?paramitem=` + paramitem, {
    method: 'GET',
  });
}

/**
 * ByItemAndCode查询類型
 * @returns
 */
export async function findTypeByItemAndCode(params: any) {
  return request('base/select/queryMesParameterByItemAndCode', {
    params,
    method: 'GET',
  });
}

/** 获取数据 */
export async function getIpandStage(params: any) {
  return request('base/mesapconfig/queryList', {
    params,
    method: 'GET',
  });
}

/** 获取待料狀態 */
export async function getParameters(paramitem: string) {
  return request('base/select/queryParametersFlag', {
    method: 'GET',
    params: { paramitem },
  });
}

/** 获取mesparameters键值参数 */
export async function findAllRuletype(type: string) {
  return request('base/select/mesParameters', {
    method: 'GET',
    params: { type },
  });
}

/** 获取mesparameters键值参数 */
export async function findAllReseton(type: string) {
  return request('base/select/mesParameters', {
    method: 'GET',
    params: { type },
  });
}
/**
 * 獲取維修打包工單
 * @returns
 */
export async function findBrwPackMo(params: any) {
  return request('base/select/queryBrwPackMo', {
    params,
    method: 'GET',
  });
}

/**
 * 獲取LOT模式的內箱號
 * @returns
 */
export async function findAryLotByMo(params: any) {
  return request('base/select/queryAryLotByMoAndInfostatus', {
    params,
    method: 'GET',
  });
}
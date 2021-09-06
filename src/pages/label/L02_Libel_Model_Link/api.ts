import request from '@/utils/request';

/** 获取规则 */
export async function getOneRule(params: any) {
  return request('trans/L02/getOneRule', {
    params,
    method: 'GET',
  });
}

export async function getlistbyupn(params: any) {
  return request('trans/L02/getlistbyupn', {
    params,
    method: 'GET',
  });
}

/** 获取细项 */
export async function getDetail(params: any) {
  return request('trans/L02/getDetail', {
    params,
    method: 'GET',
  });
}

export async function save(data: any) {
  return request('trans/L02/save', {
    data,
    method: 'POST',
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

import request from '@/utils/request';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 添加规则
 * @returns
 */
export async function saveLabelRule(data: any) {
  return request(`trans/L01/addLabelRule`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询规则
 * @returns
 */
export async function findLabelRule(params: any) {
  return request(`trans/L01/queryLabelRule`, {
    method: 'GET',
    params,
  });
}

/**
 * 查询规则
 * @returns
 */
export async function findLabelRuleDetail(params: any) {
  return request(`trans/L01/queryLabelRuleDetail`, {
    method: 'GET',
    params,
  });
}

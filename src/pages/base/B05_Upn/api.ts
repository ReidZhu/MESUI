import request from '@/utils/request';

/** 获取数据 */
export async function getData(params: any) {
  return request('base/upn/selectallupn', {
    params,
    method: 'GET',
  });
}

/** 修改数据 */
export async function updateupn(data: any) {
  return request.post('base/upn/saveandupdateobj', {
    data,
    method: 'POST',
  });
}
export async function deleteByupn(upn: any) {
  return request(`base/upn/deletebyupn?upn=${upn}`, {
    method: 'DELETE',
  });
}

/** 批量添加 */
export async function saveexcelall(data: any) {
  return request.post('base/upn/saveexcelall', {
    data,
    method: 'POST',
  });
}

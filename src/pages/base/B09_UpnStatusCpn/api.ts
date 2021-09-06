import request from '@/utils/request';

/** 获取数据 */
export async function getDataB09(params: any) {
  return request('base/mesUpnItemCpn/queryList', {
    params,
    method: 'GET',
  });
}

/** 刪除数据 */
export async function removeB09(params: any) {
  return request('base/mesUpnItemCpn/delete', {
    params,
    method: 'DELETE',
  });
}

/** 插入数据 */
export async function addB09(params: any) {
  return request('base/mesUpnItemCpn/insert', {
    data: { data: params },
    method: 'POST',
  });
}

/** 修改数据 */
export async function editB09(params: any) {
  return request('base/mesUpnItemCpn/update', {
    data: { data: params },
    method: 'PUT',
  });
}

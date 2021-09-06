import request from '@/utils/request';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/line/selectallline', {
    params,
    method: 'GET',
  });
}

/** 修改数据/添加数据 */
export async function updateline(data: any) {
  return request.post('base/line/saveandupdateobj', {
    data,
    method: 'POST',
  });
}

/** 删除数据 */
export async function deletebyline(params?: any) {
  return request(`base/line/deletebyline`, {
    method: 'DELETE',
    params,
  });
}

export async function deleteByline(line: any) {
  return request(`base/line/deletebyline?line=${line}`, {
    method: 'DELETE',
  });
}

/** 批量添加 */
export async function saveexcelall(data: any) {
  return request.post('base/line/saveexcelall', {
    data,
    method: 'POST',
  });
}

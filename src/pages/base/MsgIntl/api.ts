import request from '@/utils/requesttrans';

/** 获取数据 */
export async function getData(params: any) {
  return request('base/intl/queryList', {
    params,
    method: 'GET',
  });
}

/** 保存数据 */
export async function add(data: any) {
  return request('base/intl/add', {
    data,
    method: 'POST',
  });
}
/** 保存数据 */
export async function edit(data: any) {
  return request('base/intl/edit', {
    data,
    method: 'PUT',
  });
}

/** 删除数据 */
export async function deleteData(tag: any) {
  return request(`base/intl/remove/${tag}`, {
    method: 'DELETE',
  });
}

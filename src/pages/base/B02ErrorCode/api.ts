import request from '@/utils/request';
/** 获取数据 */
export async function getData(params: any) {
  return request('base/errorcode/queryList', {
    params,
    method: 'GET',
  });
}

/** 修改数据 */
export async function update(data: any) {
  return request('base/errorcode/save', {
    data,
    method: 'POST',
  });
}

/** 批量添加 */
export async function addBatch(data: any) {
  return request('base/errorcode/batchSave', {
    data,
    method: 'POST',
  });
}

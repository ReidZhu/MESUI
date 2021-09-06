import request from '@/utils/request';

/** 获取数据 */
export async function getData(params: any) {
  return request('base/stage/queryList', {
    params,
    method: 'GET',
  });
}

/** 保存数据 */
export async function saveData(data: any) {
  return request('base/stage/save', {
    data,
    method: 'POST',
  });
}

/** 删除数据 */
export async function deleteData(stage: any) {
  return request(`base/stage/delete/${stage}`, {
    method: 'DELETE',
  });
}

/** 保存数据 */
export async function addBatch(data: any) {
  return request('base/stage/batchSave', {
    data,
    method: 'POST',
  });
}

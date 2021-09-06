import request from '@/utils/request';
/** 获取数据 */
export async function getData(params: any) {
  return request('trans/messtagematerial/queryList', {
    params,
    method: 'GET',
  });
}

/** 更新数据 */
export async function updateData(data: any) {
  return request('trans/messtagematerial/update', {
    data,
    method: 'PUT',
  });
}

/** 保存数据 */
export async function insertdata(data: any) {
  return request('trans/messtagematerial/insert', {
    data,
    method: 'POST',
  });
}

/**
 * 查询站点
 * @returns
 */
export async function findAllStage() {
  return request('select/stage', {
    method: 'GET',
  });
}
/**
 * 刪除數據
 * @returns
 */
export async function deleteByid(ids: any) {
  return request('trans/messtagematerial/deleteByIds', {
    params: { ids },
    method: "DELETE",
  })
}

// /** 批量添加 */
// export async function addBatch(data: any) {
//   return request('base/mesroute/insert', {
//     data,
//     method: 'POST',
//   });
// }
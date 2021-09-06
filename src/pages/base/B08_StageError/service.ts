import request from '@/utils/request';
import { MesStageErrorCode } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function findAllStageError(mesStageErrorCode: MesStageErrorCode) {
  return request(`base/mesStageErrorCode/queryList`, {
    method: 'GET',
    params: mesStageErrorCode,
  });
}
/**
 * 新增
 * @returns
 */
export async function AddStageError(data: any) {
  return request(`base/mesStageErrorCode/insert`, {
    method: 'POST',
    data: data,
  });
}
/**
 * 修改
 * @returns
 */
export async function FixStageError(data: any) {
  return request(`base/mesStageErrorCode/update`, {
    method: 'PUT',
    data: data,
  });
}
/**
 * 删除
 * @returns
 */
export async function DelStageError(data: any) {
  return request(`base/mesStageErrorCode/delete`, {
    method: 'DELETE',
    params: data,
  });
}
/**
 * 批量添加
 */
export async function addList(data: any) {
  return request('mesStageErrorCode/addList', {
    data: data,
    method: 'POST',
  });
}

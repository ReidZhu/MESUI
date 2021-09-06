import request from '@/utils/request';
import { MesUpnRoute } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function findAllFlow(mesupnroute: MesUpnRoute) {
  return request(`base/mesUpnRoute/queryList`, {
    method: 'GET',
    params: mesupnroute,
  });
}
/**
 * 新增
 * @returns
 */
export async function AddFlow(data: any) {
  return request(`base/mesUpnRoute/insert`, {
    method: 'POST',
    data: data,
  });
}
/**
 * 修改
 * @returns
 */
export async function FixFlow(data: any) {
  return request(`base/mesUpnRoute/update`, {
    method: 'PUT',
    data: data,
  });
}
/**
 * 删除
 * @returns
 */
export async function DelFlow(data: any) {
  return request(`base/mesUpnRoute/delete`, {
    method: 'DELETE',
    params: data,
  });
}

/**
 * 批量添加
 */
export async function addList(data: any) {
  return request('base/mesUpnRoute/addList', {
    data: data,
    method: 'POST',
  });
}

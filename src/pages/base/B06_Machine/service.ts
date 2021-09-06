import request from '@/utils/request';
import { MesStageMachine } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function findAllMachine(mesStageMachine: MesStageMachine) {
  return request(`base/mesStageMachine/queryList`, {
    method: 'GET',
    params: mesStageMachine,
  });
}
/**
 * 新增
 * @returns
 */
export async function AddMachine(data: any) {
  return request(`base/mesStageMachine/insert`, {
    method: 'POST',
    data: data,
  });
}
/**
 * 修改
 * @returns
 */
export async function FixMachine(data: any) {
  return request(`base/mesStageMachine/update`, {
    method: 'PUT',
    data: data,
  });
}
/**
 * 删除
 * @returns
 */
export async function DelMachine(data: any) {
  return request(`base/mesStageMachine/delete`, {
    method: 'DELETE',
    params: data,
  });
}

/**
 * 获取Tree
 * @returns
 */
export async function findTree() {
  return request(`base/mesStageMachine/tree`, {
    method: 'GET',
  });
}

/**
 * 批量添加
 */
export async function addList(data: any) {
  return request('base/mesStageMachine/addList', {
    data: data,
    method: 'POST',
  });
}

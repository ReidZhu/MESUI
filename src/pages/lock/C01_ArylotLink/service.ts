import request from '@/utils/request';
import { List } from 'lodash';
import { MesBeUpnLink } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function findAllUpnLink(mesBeUpnLink: MesBeUpnLink) {
  return request(`base/mesModelLink/query`, {
    method: 'GET',
    params: mesBeUpnLink,
  });
}
/**
 * 新增
 * @returns
 */
export async function AddUpnLink(data: any) {
  return request(`base/mesModelLink/add`, {
    method: 'POST',
    data: data,
  });
}
/**
 * 修改
 * @returns
 */
export async function FixUpnLink(data: any) {
  return request(`base/mesModelLink/update`, {
    method: 'PUT',
    data: data,
  });
}
/**
 * 删除
 * @returns
 */
export async function DelUpnLink(data: any) {
  return request(`base/mesModelLink/delete`, {
    method: 'DELETE',
    params: data,
  });
}

/**
 * 查询所有
 * @returns
 */
export async function findAllArrayidInfo(params: any) {
  return request(`base/mesModelLink/queryArrayidInfo`, {
    method: 'GET',
    params,
  });
}

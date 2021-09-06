import request from '@/utils/request';
import { List } from 'lodash';
import { MesMdlUpnLink } from './index';

//const serviceUrl = 'http://10.57.94.67:7001';

/**
 * 查询所有
 * @returns
 */
export async function findAllMdlLink(mesMdlUpnLink: MesMdlUpnLink) {
  return request(`base/mesMdlUpnLink/query`, {
    method: 'GET',
    params: mesMdlUpnLink,
  });
}
/**
 * 新增
 * @returns
 */
export async function AddMdlLink(data: any) {
  return request(`base/mesMdlUpnLink/insert`, {
    method: 'POST',
    data: data,
  });
}
/**
 * 修改
 * @returns
 */
export async function FixMdlLink(data: any) {
  return request(`base/mesMdlUpnLink/update`, {
    method: 'PUT',
    data: data,
  });
}
/**
 * 删除
 * @returns
 */
export async function DelMdlLink(data: any) {
  return request(`base/mesMdlUpnLink/delete`, {
    method: 'DELETE',
    params: data,
  });
}

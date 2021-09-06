import request from "@/utils/request";

/** 获取变量 */
export async function getlabelvariablelist(params: any) {
    return request('trans/L03/querySelective', {
        params,
        method: 'GET',
      });
}
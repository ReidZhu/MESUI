import { message } from 'antd';

export function commonResult(result: any, callback?: Function, showMsg: boolean = true) {
  if (result.status == 200) {
    if (showMsg) message.success(result.msg);
    if (callback) callback(result.data);
  } else {
    message.error(result.msg);
  }
}

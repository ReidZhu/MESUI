import * as XLSX from 'xlsx';
import { message } from 'antd';

/**
 *  通用下載Excle
 * @param array  默认对象数组第一个为Excle表头
 * @param fileName  生成的文件名称(后缀为 .xlsx)
 * @param diyHeader  自定义头部如['姓名','年龄']
 */

export function createExcle(array: any, fileName: string, diyHeader?: string[]) {
  const fistObj = {};
  const cols = [];
  const header = [];
  for (const key in array[0]) {
    header.push(key);
    cols.push({ width: 15 });
  }

  if (diyHeader && diyHeader != null && diyHeader != undefined) {
    for (let i = 0; i < header.length; i++) {
      fistObj[header[i]] = diyHeader[i];
    }
    array.unshift(fistObj);
  }

  // 创建book
  const wb = XLSX.utils.book_new();
  // json转sheet
  const ws = XLSX.utils.json_to_sheet(array, { header, skipHeader: true });
  // 设置列宽
  ws['!cols'] = cols;
  // sheet写入book
  XLSX.utils.book_append_sheet(wb, ws, 'file');
  // 输出
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
/**
 * 通用读取Excle并返回json格式数据
 * @param file 要读取的文件
 * @param keyArray 返回json格式的key数组如['name','age'],注意和文件头部位置对应
 * @param callback 回调函数会返回读出来的json数据
 * @param extraParams 额外的参数{key:value,key:value} 可选
 */
export function readerExcle(
  file: File,
  keyArray: Array<string>,
  callback: Function,
  extraParams?: any,
) {
  if (file.name.substring(file.name.length - 4) !== 'xlsx') {
    message.error('文件上传失败,请确认文件格式');
    return;
  }

  const excledata: any = [];
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = function (e: any) {
    const data = e.target.result;
    const excelFile = XLSX.read(data, {
      type: 'binary',
    });

    const str: any = XLSX.utils.sheet_to_json(excelFile.Sheets[excelFile.SheetNames[0]], {
      header: 1,
    });
    for (let i = 1; i < str.length; i++) {
      const obj: any = {};

      for (let y = 0; y < keyArray.length; y++) {
        const key = keyArray[y];
        obj[key] = str[i][y];
      }
      if (extraParams) Object.assign(obj, extraParams);
      excledata.push(obj);
    }
    callback(excledata);
  };
}
/**
 * 格式化上传数据
 * @param1 需要格式的数据
 * @param2 格式key的顺序
 */
export function dataFormat(data: any, key: string[]) {
  const newData = data.map((e: any) => {
    const obj = {};
    key.forEach((value) => {
      obj[value] = e[value];
    });
    return obj;
  });
  return newData;
}

export function toUpstring(pam: any) {
  var pattern = /[\u4e00-\u9fa5]*[A-Za-z0-9]*[-]*/;

  for (let obj in pam) {
    let temp = pam[obj].toUpperCase();

    pam[obj] = temp.replace(pattern, '');
  }
  console.log(pam);
  return pam;
}


export function toheavy(arr: []) {
  var ret: [] = [];
  for (var i = 0; i < arr.length; i++) {
    if (!ret.includes(arr[i])) {
      ret.push(arr[i]);
    }
  }
  return ret;
}

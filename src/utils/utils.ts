/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * 自动转大写并去除特殊字符 适用于(字符串，对象，数组)
 * @param params
 */
export const formatparams = (params: any): any => {
  if (typeof params === 'string') {
    return replaceAndToUpperCase(`${params}`);
  }
  console.log(params.length);
  if (typeof params === 'object') {
    if (params.length) {
      params.forEach((element: any) => {
        for (const key in element) {
          element[key] = replaceAndToUpperCase(`${element[key]}`);
        }
      });
    } else {
      for (const key in params) {
        params[key] = replaceAndToUpperCase(`${params[key]}`);
      }
    }
  }
  return params;
};

function replaceAndToUpperCase(value: String) {
  return value
    .toUpperCase()
    .replace(
      /\+|\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g,
      '',
    );
}
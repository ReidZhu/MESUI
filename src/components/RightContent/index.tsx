import { Space } from 'antd';
import React from 'react';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
const lang:{[key: string]: any} = {
  'en-US': {
    title:'English',
    icon:'🇺🇸'
  },
  'zh-CN': {
    title:'简体',
    icon:'🇨🇳'
  },
  'zh-TW': {
    title:'繁體',
    icon:'🇭🇰'
  },
};
const defaultLangUConfiga = ()=>{


  let temp = Object.keys(lang)
  let newLang = temp.map((key:any) =>{
    return{
      lang: key,
      label: lang[key].title,
      icon: lang[key].icon,
      title: lang[key].title,
    }
  })

  return newLang
}


const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }
  const { navTheme, layout } = initialState.settings;
  let className = styles.right;
  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <Avatar />
      <SelectLang className={styles.action} postLocalesData={defaultLangUConfiga} 
  />
    </Space>
  );
};
export default GlobalHeaderRight;

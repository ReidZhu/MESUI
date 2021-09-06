import storageUtils from './storageUtils';

/**
 * 权限化菜单
 * @param menus
 */
export  function checkMenu(menus: any): any {
  return menus.filter((item: any) => {
    if (storageUtils.getPermissions().includes(item.permission)) {
      if (item.children != null && item.children.length > 0) {
        item.children = checkMenu(item.children);
      }
      return true;
    } 
      return false;
    
  });
}

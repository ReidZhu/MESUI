const USER_STORAGE = 'user_storage';
const PERMISSIONS = 'permissions'
export default {
  saveUser(user: any) {
    localStorage.setItem(USER_STORAGE, JSON.stringify(user));
  },
  getUser() {
    return JSON.parse(localStorage.getItem(USER_STORAGE) || '{}');
  },
  removeUser() {
    localStorage.removeItem(USER_STORAGE);
  },
  savePermissions(permissions: any) {//更新保存权限列表
    localStorage.setItem(PERMISSIONS, JSON.stringify(permissions));
  },
  getPermissions(){//获取权限列表
    return JSON.parse(localStorage.getItem(PERMISSIONS) || '[]');
  },
};

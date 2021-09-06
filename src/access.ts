// src/access.ts
export default function access(initialState: { currentUser?: API.UserInfoType | undefined }) {
  const { currentUser } = initialState || {};
  /** 服务端返回的当前用户权限码 */
  const permissions = currentUser?.permissions || [];

  return {
    routeFilter: (route: any) => {
      return permissions.includes(route.permission);
    },
    lableFilter: (perm: string) => permissions.includes(perm),
  };
}

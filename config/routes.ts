import permissionMap from '../src/utils/permissionMap';

export default [
  {
    path: '/user',
    layout: false, // 不展示layout
    //permission:'mes',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        //permission:'mes',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome', // 对应菜单名,面包屑名,页面title
    icon: 'smile',
    component: './Welcome',
    //access: 'routeFilter',
    //permission: 'mes',
  },

  {
    path: '/base',
    name: 'base', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'intl',
        path: '/base/intl',
        component: './base/MsgIntl',
        permission: 'base:intl',
      },
      {
        name: 'stage',
        path: '/base/step',
        component: './base/B01Step',
        permission: 'base:stage',
        access: 'routeFilter',
      },
      {
        name: 'errorcode',
        path: '/base/errorcode',
        component: './base/B02ErrorCode',
        permission: 'base:errorcode',
        access: 'routeFilter',
      },
      {
        name: 'process',
        path: '/base/B03_Process',
        component: './base/B03_Process',
        permission: 'base:process',
        access: 'routeFilter',
      },
      {
        name: 'B04_line',
        path: '/base/B05_line',
        component: './base/B04_Line',
        permission: 'base:line',
        access: 'routeFilter',
      },
      {
        name: 'B05_upn',
        path: '/base/B05_upn',
        component: './base/B05_Upn',
        permission: 'base:upn',
        access: 'routeFilter',
      },
      {
        name: 'B06_Machine',
        path: '/base/B06_Machine',
        component: './base/B06_Machine',
        permission: 'base:machine',
        access: 'routeFilter',
      },
      {
        name: 'B07_Flow',
        path: '/base/B07_Flow',
        component: './base/B07_Flow',
        permission: 'base:flow',
        access: 'routeFilter',
      },
      {
        name: 'B08_StageError',
        path: '/base/B08_StageError',
        component: './base/B08_StageError',
        permission: 'base:stageerror',
        access: 'routeFilter',
      },
      {
        name: 'B09_UpnStatusCpn',
        path: '/base/B09_UpnStatusCpn',
        component: './base/B09_UpnStatusCpn',
        permission: 'base:B09',
        access: 'routeFilter',
      },
      {
        name: 'B10_Mo',
        path: '/base/B10_Mo',
        component: './base/B10_Mo',
        permission: 'base:B10',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'base',
  },
  {
    path: '/transaction',
    name: 'transaction', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'material',
        path: '/transaction/T01_Material',
        component: './transaction/T01_Material',
        permission: 'transaction:material',
        access: 'routeFilter',
      },
      {
        name: 'offline',
        path: '/transaction/T02_Offline',
        component: './transaction/T02_Offline',
        permission: 'transaction:offline',
        access: 'routeFilter',
      },
      {
        name: 'offlineLot',
        path: '/transaction/T02_OfflineLot',
        component: './transaction/T02_OfflineLot',
        // permission: 'transaction:offline',
      },
      {
        name: 'moveoutpcs',
        path: '/transaction/T03_MoveoutPcs',
        component: './transaction/T03_MoveoutPcs',
        permission: 'transaction:moveoutpcs',
        access: 'routeFilter',
      },
      {
        name: 'moveoutlot',
        path: '/transaction/T03_MoveoutLot',
        component: './transaction/T03_MoveoutLot',
        permission: 'transaction:moveoutlot',
        access: 'routeFilter',
      },
      {
        name: 'onlineuser',
        path: '/transaction/T04_OnlineUser',
        component: './transaction/T04_OnlineUser',
        permission: 'transaction:onlineuser',
        access: 'routeFilter',
      },
      {
        name: 'checkin',
        path: '/transaction/T05_Checkin',
        component: './transaction/T05_Checkin',
        permission: 'transaction:checkin',
        access: 'routeFilter',
      },
      {
        name: 'lcmoffline',
        path: '/transaction/T06_LcmOffline',
        component: './transaction/T06_LcmOffline',
        permission: 'transaction:lcmoffline',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'transaction',
  },
  {
    path: '/OQC',
    name: 'OQC', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'batch',
        path: '/OQC/Q01_Batch',
        component: './OQC/Q01_Batch',
        permission: 'OQC:batch',
      },
      {
        name: 'oqcmoveout',
        path: '/OQC/Q02_OQCMoveout',
        component: './OQC/Q02_OQCMoveout',
        permission: 'OQC:oqcmoveout',
        access: 'routeFilter',
      },
      {
        name: 'sortmoveout',
        path: '/OQC/Q03_SortMoveout',
        component: './OQC/Q03_SortMoveout',
        permission: 'OQC:sortmoveout',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'OQC',
  },
  {
    path: '/packagingcenter',
    name: 'packagingcenter', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'LCD_package',
        path: '/packagingcenter/P01_Package',
        component: './packagingcenter/P01_Package',
        boxtype: 'LCD',
        permission: 'packagingcenter:package',
        access: 'routeFilter',
      },
      {
        name: 'warehouse',
        path: '/packagingcenter/P02_WareHouse',
        component: './packagingcenter/P02_WareHouse',
        permission: 'packagingcenter:bepallet',
      },
      {
        name: 'LCM_package',
        path: `/packagingcenter/lcm_package`,
        boxtype: 'LCM',
        component: './packagingcenter/P01_Package',
        permission: 'packagingcenter:lcm_package',
        access: 'routeFilter',
      },
      {
        name: 'LCM_warehouse',
        path: '/packagingcenter/P04_LCMWareHouse',
        component: './packagingcenter/P04_LCMWareHouse',
        permission: 'packagingcenter:lcmpallet',
      },
      {
        name: 'box_devanning',
        path: '/packagingcenter/P05_BoxDevanning',
        component: './packagingcenter/P05_BoxDevanning',
        permission: 'packagingcenter:devanning',
      },
    ],
    access: 'routeFilter',
    permission: 'packagingcenter',
  },
  {
    path: '/lock',
    name: 'lock', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'arylot',
        path: '/lock/C01_ArylotLink',
        component: './lock/C01_ArylotLink',
        permission: 'lock:modellink',
      },
      {
        name: 'mdlupn',
        path: '/lock/C02_MDLLink',
        component: './lock/C02_MDLLink',
        permission: 'lock:mdlupn',
      },
      {
        name: 'holdrelease',
        path: '/lock/C03_HoldRelease',
        component: './lock/C03_HoldRelease',
        permission: 'lock:hold_release',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'lock',
  },
  {
    path: '/repair',
    name: 'repair', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'receipt',
        path: '/repair/R01_Receipt',
        component: './repair/R01_Receipt',
        permission: 'repair:receipt',
      },
      {
        name: 'repairpack',
        path: '/repair/R02_RepairPack',
        component: './repair/R02_RepairPack',
        permission: 'repair:repairpack',
        access: 'routeFilter',
      },
      {
        name: 'devanning',
        path: '/repair/R03_Devanning',
        component: './repair/R03_Devanning',
        permission: 'repair:devanning',
      },
      {
        name: 'repairoffline',
        path: '/repair/R04_RepairOffline',
        component: './repair/R04_RepairOffline',
        permission: 'repair:repairoffline',
        access: 'routeFilter',
      },
      {
        name: 'repairmoveoutlot',
        path: '/repair/R06_RepairMoveoutLOT',
        component: './repair/R06_RepairMoveoutLOT',
        permission: 'repair:repairmoveoutlot',
        access: 'routeFilter',
      },
      {
        name: 'reworkoffline',
        path: '/repair/R07_ReworkOffline',
        component: './repair/R07_ReworkOffline',
        permission: 'repair:reworkoffline',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'repair',
  },
  {
    path: '/report',
    name: 'report', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'wip',
        path: '/report/MR01_Wip',
        component: './report/MR01_Wip',
      },
      {
        name: 'capacity',
        path: '/report/MR02_Capacity',
        component: './report/MR02_Capacity',
      },
      {
        name: 'record',
        path: '/report/MR03_Record',
        component: './report/MR03_Record',
      },
    ],
  },
  {
    path: '/Label',
    name: 'label', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'L01_Label_Rule',
        path: '/label/L01_Label_Rule',
        component: './label/L01_Label_Rule',
      },
      {
        name: 'L02_Libel_Model_Link',
        path: '/label/L02_Libel_Model_Link',
        component: './label/L02_Libel_Model_Link',
        permission: 'label:labellinkmodel',
        access: 'routeFilter',
      },
      {
        name: 'L03_Label_variable',
        path: '/label/L03_Label_variable',
        component: './label/L03_Label_variable',
      },
    ],
    access: 'routeFilter',
    permission: 'label',
  },
  {
    path: '/exceptioncenter',
    name: 'exceptioncenter', // 对应菜单名,面包屑名,页面title
    icon: 'bars',
    routes: [
      {
        name: 'u01canceljob',
        path: '/exceptioncenter/U01_canceljob',
        component: './exceptioncenter/U01_canceljob',
        permission: 'exceptioncenter:U01',
        access: 'routeFilter',
      },
      {
        name: 'U02_Separate',
        path: '/exceptioncenter/U02_Separate',
        component: './exceptioncenter/U02_Separate',
        permission: 'exceptioncenter:U02',
        access: 'routeFilter',
      },
    ],
    access: 'routeFilter',
    permission: 'exceptioncenter',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

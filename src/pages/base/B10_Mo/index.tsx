import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message, Popover, Tag } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
import UserModal from './components/TableModal';
import {getDataB10,editB10 } from './api';

import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import {
  ctmfgprocesstypeIntl,
  mfgtypeIntl,
  modelIntl,
  moinfoIntl,
  moIntl,
  moTypeIntl,
  operationIntl,
  qtyIntl,
  RouteName,
  statusntl,
  storelocIntl,
  Upn,
} from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export type setDataSource = {
  id?: number;
  line?: string;
  createuser?: string;
  createtime?: string;
};

export default () => {
  const intl = useIntl();

  //列表数据
  const [dataSource, setDataSource] = useState([{
    mfgmotype:'03',
    mo:'123'
  }]);
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow, setEditRow] = useState({});
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();
  //操作刷新

  const columns: ProColumns[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 60,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage(moIntl), 
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(moTypeIntl),
      dataIndex: 'mfgmotype',
      hideInSearch: true,
      valueType:'select',
      valueEnum:()=>{
        return {
          '01': { text: '正常'},
          '03': { text: '重工'},
        }
      }
    },
    {
      title: intl.formatMessage(moinfoIntl),      
      dataIndex: 'moinfo',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(Upn),  
      dataIndex: 'upn',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(modelIntl),    
      dataIndex: 'model',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(qtyIntl),    
      dataIndex: 'qty',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(statusntl),     
      dataIndex: 'status',
      hideInSearch: true,
      render:(_,record)=>{
        
        return record.status == 'W'?<Tag children="作業中" color="green"/>:<Tag children="已結案" color="red"/>
      }
    },
    {
      title: intl.formatMessage(moTypeIntl),    
      dataIndex: 'mfgtype',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(ctmfgprocesstypeIntl),     
      dataIndex: 'mfgprocesstype',
      hideInSearch: true,
    },
    
    {
      title: intl.formatMessage(storelocIntl),      
      dataIndex: 'storeloc',
      hideInSearch: true,
    },
    
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('base:B10:edit')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>
      ],
    },
  ];

  
  return (
    <>
      <PageHeaderWrapper title={false}>
          <ProTable
            pagination={{ pageSize: 8 }}
         
            actionRef={actionRef}
            columns={columns}
            request={async (params, sorter, filter) => {
              params = formatparams(params);
              console.log(params)
              commonResult(
                await getDataB10(params ),
                (result: any) => {
                  setDataSource(result);
                },
                false,
              );
              return { data: dataSource };
            }}
            dataSource={dataSource}
          />
        {/**弹出层 */}
        <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />
      </PageHeaderWrapper>
    </>
  );
};

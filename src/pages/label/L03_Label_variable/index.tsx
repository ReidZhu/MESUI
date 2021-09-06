import React, { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useIntl } from 'umi';
import { Model, Upn, labeltypeIntl, variableIntl, tablenameIntl, fieldnameIntl, querykeyIntl, createuserIntl, createtimeIntl } from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getlabelvariablelist } from './service';
import { findAllUpn } from '@/services/select'
import { ProFormSelect } from '@ant-design/pro-form';

export type Member = {
  model: string;
  upn: string;
  labeltype: number;
  variable: string;
  tablename: string;
  fieldname: string;
  querykey: string;
  createuser: string;
  createtime: Date;
};

const MemberList: React.FC = () => {
  const [upn,setUpn] = useState<any>();
  useEffect(() => {
    init()
  }, []);
  const init = async()=>{
    const  upnList = await findAllUpn('');
    let arr = upnList.data;
    arr.unshift("*")
    setUpn(arr);
  }
  const intl = useIntl();
  const columns: ProColumns<Member>[] = [
    {
      title: intl.formatMessage(Model),
      dataIndex: 'model',
      search: false,
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
      renderFormItem:()=>{
        return <ProFormSelect options={upn} name ='upn'/>
      }
    },
    {
      title: intl.formatMessage(labeltypeIntl),
      dataIndex: 'labeltype',
      valueEnum:{
        1:{text:'制品'},
        2:{text:'包裝'},
        3:{text:'产品'}
      },
      search: false,
    },
    {
        title: intl.formatMessage(variableIntl),
        dataIndex: 'variable',
        search: false,
    },
    {
      title: intl.formatMessage(tablenameIntl),
      dataIndex: 'tablename',
      search: false,
    },
    {
      title: intl.formatMessage(fieldnameIntl),
      dataIndex: 'fieldname',
      search: false,
    },
    {
        title: intl.formatMessage(querykeyIntl),
        dataIndex: 'querykey',
        search: false,
    },
    {
        title: intl.formatMessage(createuserIntl),
        dataIndex: 'createuser',
        search: false,
    },
    {
        title: intl.formatMessage(createtimeIntl),
        dataIndex: 'createtime',
        search: false,
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
    <ProTable<Member>
      columns={columns}
      request={async(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        let result = await getlabelvariablelist(params)
        console.log(params, sorter, filter);
        return Promise.resolve({
          data: result.data,
          success: true,
        });
      }}
      rowKey="outUserNo"
      pagination={{
        showQuickJumper: true,
      }}
      search={{}}
    />
    </PageHeaderWrapper>
  );
};

export default MemberList;
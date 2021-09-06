import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm ,message} from 'antd';
import { DeleteOutlined, EditOutlined, PlusSquareFilled } from '@ant-design/icons';
import UserModal from './components/TableModal'
import {  Upn,cpnIntl,createuserIntl,createtimeIntl, deleteornoIntl, addIntl, operationIntl, selectIntl, statusntl } from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { findAllRuletype, findAllUpn } from '@/services/select';
import { ProFormSelect } from '@ant-design/pro-form';
import { formatparams } from '@/utils/utils';
import { getDataB09, removeB09 } from './api';
import { commonResult } from '@/utils/resultUtils';

const data = [
  {
    upn: '1',
    item: 'John Brown',
    cpn: 32,
    address: 'New York No. 1 Lake Park',
    index: 0,
  }

];

export default () => {
  const intl = useIntl();
  //列表数据 
  const [dataSource, setDataSource] = useState(data);
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow,setEditRow] = useState({});
  //机种
  const [upn,setUpn] = useState();
  //状态
  const [item,setItem] = useState();
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    init();
  }, []);

  /**
   * 初始化下拉框
   */
  const init = async()=>{
    const resultUpn = await findAllUpn("");
    const resultItem = await findAllRuletype("BRWSTATUS");
    setUpn(resultUpn.data)
    setItem(resultItem.data)
  }


  const columns: ProColumns[] = [
    
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
      renderFormItem:()=>{
        return (
           <ProFormSelect
              name="upn"
              options={upn}
              placeholder={intl.formatMessage(selectIntl)}
            />
        )
      }
    },
    {
      title: intl.formatMessage(statusntl),
      dataIndex: 'item',
      render:(_,record)=>[record.mesParameters.paramvalue],
      renderFormItem:()=>{
        return (
           <ProFormSelect
              name="item"
              options={item}
              placeholder={intl.formatMessage(selectIntl)}
            />
        )
      }
    },
    {
      title: intl.formatMessage(cpnIntl),
      dataIndex: 'cpn',
    },
    {
      title: intl.formatMessage(createuserIntl),
      dataIndex: 'createuser',
      hideInSearch:true
    },
    {
      title: intl.formatMessage(createtimeIntl),
      dataIndex: 'createtime',
      hideInSearch:true

    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_,record) => [ 
        <Access accessible={access.lableFilter("base:B09:edit")} >
          <Button type="text" icon={<EditOutlined />} onClick={()=>{setEditRow(record);setVisible(true);}}></Button>
        </Access>,
        <Access accessible={access.lableFilter("base:B09:remove")} >
            <Popconfirm
              title={intl.formatMessage(deleteornoIntl)}
              onConfirm={async()=>{
                record.createtime = undefined;
                commonResult(await removeB09({upn:record.upn,item:record.item}))
                actionRef.current?.reload();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
              </Button>
            </Popconfirm>
        </Access>
      ]
    },
  ];

  return (
    <>
      <PageHeaderWrapper title={false}>
      
        <ProTable
          actionRef={actionRef}
          columns={columns}
          pagination={{
            pageSize:8
          }}
          request={async(values:any)=>{
            let thisData:any;
            if(values.cpn)values.cpn = formatparams(values.cpn);
            commonResult(await getDataB09(values),(result:any)=>{
              thisData = result
            },false) ;
            return {data:thisData};
          }}
          toolBarRender={() => [
            <Access accessible={access.lableFilter("base:B09:add")} >
            <Button type="primary" icon={<PlusSquareFilled />} onClick={()=>{setEditRow({});setVisible(true);}}>
              {intl.formatMessage(addIntl)}
            </Button>
            </Access>
          ]}
        />
      
      {/**弹出层 */}
      <UserModal visible={{visible,setVisible}} editRow={editRow} tabRef={actionRef} selectOption={{upn,item}}/>
      </PageHeaderWrapper>
      
     
    </>
  );
};
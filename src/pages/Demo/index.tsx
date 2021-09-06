import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm ,message} from 'antd';
import { DeleteOutlined, EditOutlined, PlusSquareFilled } from '@ant-design/icons';
import UserModal from './components/TableModal'
import PrintDemo from './components/PrintDemo';
//import arrayMove from 'array-move';
import ReactToPrint from 'react-to-print';
import { uuid } from '@/utils/utils';




const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    index: 2,
  },

];

export default () => {
  //列表数据 
  const [dataSource, setDataSource] = useState(data);
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow,setEditRow] = useState({});
  //打印的element
  const [printContent,setPrintContent] = useState<any>();
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();



  const columns: ProColumns[] = [
    {
      title: '排序',
      dataIndex: 'key',
      width: 60,
      className: 'drag-visible',
      //render: () => <DragHandle />,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_,record) => [
        <Button type="text" icon={<EditOutlined />} onClick={()=>{setEditRow(record);setVisible(true);}}>
        </Button>,
  
        <Popconfirm
          title="是否删除"
          onConfirm={()=>{message.success("删除成功")}}
          onCancel={()=>{message.error("删除失败")}}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
          </Button>
        </Popconfirm>
  
      ]
    },
  ];

  return (
    <>
      <Access accessible={access.lableFilter("mes1")} fallback={<h2>你没有mes权限</h2>}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          request={async(values:any)=>{
            message.success("查询参数=>"+JSON.stringify(values))
            return {data:dataSource};
          }}
          toolBarRender={() => [
            <Button type="primary" icon={<PlusSquareFilled />} onClick={()=>{setEditRow({});setVisible(true);}}>
              新增
            </Button>
          ]}
        />
      </Access>
      {/**弹出层 */}
      <UserModal visible={{visible,setVisible}} editRow={editRow} tabRef={actionRef}/>
      {/**打印自定义组件内容 */}
      <div style={{display:"none"}}>
        <PrintDemo ref={(el:any)=>{setPrintContent(el)}} />
      </div>
      
      {/**打印触发器 */}
      <ReactToPrint
          trigger={() => {
            return <a href="#"><h1>打印测试</h1></a>;
          }}
          content={() => printContent}
      />
    </>
  );
};
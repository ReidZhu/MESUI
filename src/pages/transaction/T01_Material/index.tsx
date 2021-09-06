import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message, Popover } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
import ExcleUpload from '@/components/ExcleUpload';
import ChangeModal from './components/ChangeModel';
import { getData, deleteByid, insertdata } from './api';
import { commonResult } from '@/utils/resultUtils';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import storageUtils from '@/utils/storageUtils';
import { formatparams } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Model,
  addIntl,
  operationIntl,
  noIntl,
  stageIntl,
  stagematerialIntl,
  deleteornoIntl,
  faildeleteIntl,
  moIntl,
  Upn,
  flagIntl,
  materialIntl,
  qtyIntl,
} from '@/utils/intl';

export default () => {
  // 列表数据
  const [dataSource, setDataSource] = useState();
  // changeModel显示隐藏
  const [visiblechange, setchangeVisible] = useState(false);
  // 修改行
  const [editRow, setEditRow] = useState({});
  // 权限验证
  const access = useAccess();
  // 操作Table
  const actionRef = useRef<ActionType>();
  //國際化
  const intl = useIntl();

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(Model),
      dataIndex: 'model',
      // options = { stage },
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
      // options = { stage },
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(moIntl),
      dataIndex: 'mo',
      // options = { stage },
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
      // hideInSearch: true,
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(stagematerialIntl),
      dataIndex: 'stagematerial',
      // hideInSearch: true,
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(materialIntl),
      dataIndex: 'material',
      // hideInSearch: true,
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(flagIntl),
      dataIndex: 'flag',
      hideInSearch: true,
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(qtyIntl),
      dataIndex: 'inqty',
      hideInSearch: true,
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('transaction:material:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setchangeVisible(true);
            }}
          ></Button>
        </Access>,
        <Access accessible={access.lableFilter('transaction:material:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            // onConfirm={() => {
            //   message.success('删除成功');
            // }}
            onConfirm={async () => {
              deleteRow(record.id);
            }}
            onCancel={() => {
              message.error(intl.formatMessage(faildeleteIntl));
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  async function deleteRow(params: any) {
    const result = await deleteByid(params);
    if (result.status == 200) {
      message.success(result.msg);
      actionRef!.current!.reload();
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, ['model', 'stage', 'materialname']);

    createExcle(newData, 'T01_Date', ['机种', '站點', '料件']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '机种', b: '站點', c: '料件' }], 'T01Model');
    return 1;
  };
  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['model', 'stage', 'materialname'],
        async (result: any) => {
          const params = formatparams(result);
          commonResult(await insertdata(params));
          message.success(`${info.file.name} file uploaded successfully`);
          actionRef!.current!.reload();
        },
        { createuser: name },
      );
    }
  };
  return (
    <PageContainer title={false}>
      <ProTable
        headerTitle={
          <div>
            <Access accessible={access.lableFilter('transaction:material:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('transaction:material:batch')}>
              <a>
                <Popover
                  placement="bottom"
                  content={
                    <ExcleUpload
                      current={1}
                      downloadModel={dowonloadModel}
                      uploadModel={uploadExcle}
                    />
                  }
                  trigger="click"
                >
                  <ArrowUpOutlined />
                </Popover>
              </a>
            </Access>
          </div>
        }
        actionRef={actionRef}
        columns={columns}
        // request={async (values: any) => {
        //   message.success('查询参数=>' + JSON.stringify(values));
        //   return { data: dataSource };
        // }}
        request={async (params: any): Promise<any> => {
          console.log(params);
          const result = await getData(params);
          commonResult(
            result,
            (data: any) => {
              setDataSource(data);
            },
            false,
          );
          return { data: dataSource };
        }}
        pagination={{ pageSize: 10 }}
        dataSource={dataSource}
        toolBarRender={() => [
          <Access accessible={access.lableFilter('transaction:process:add')}>
            <Button
              type="primary"
              icon={<PlusSquareFilled />}
              onClick={() => {
                setEditRow({});
                setchangeVisible(true);
              }}
            >
              {intl.formatMessage(addIntl)}
            </Button>
            ,
          </Access>,
        ]}
      />

      {/* 弹出层 */}
      {/* <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} /> */}
      <ChangeModal
        visible={{ visiblechange, setchangeVisible }}
        editRow={editRow}
        tabRef={actionRef}
      />
    </PageContainer>
  );
};

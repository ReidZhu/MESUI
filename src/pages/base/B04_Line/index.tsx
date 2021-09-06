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
import UserModal from './components/TableModal';
import { deleteByline, getData, saveexcelall } from './api';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import ExcleUpload from '@/components/ExcleUpload';
import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import {
  addIntl,
  createtimeIntl,
  createuserIntl,
  deleteornoIntl,
  Line,
  operationIntl,
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
  const [dataSource, setDataSource] = useState([]);
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
      title: intl.formatMessage(Line),
      width: 160,
      dataIndex: 'line',
    },
    {
      title: intl.formatMessage(createuserIntl),
      width: 160,
      dataIndex: 'createuser',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createtimeIntl),
      width: 160,
      dataIndex: 'createtime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('base:line:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,
        <Access accessible={access.lableFilter('base:line:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={() => {
              deleteRow(record.line);
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
    commonResult(await deleteByline(params));
    actionRef!.current!.reload();
  }

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, ['line']);
    createExcle(newData, 'B04', ['线别']);
  };

  const dowonloadModel = () => {
    createExcle([{ a: '线别' }], 'B04');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['line', 'createuser', 'createtime'],
        async (result: any) => {
          commonResult(await saveexcelall({ data: result }));
          actionRef!.current!.reload();
          message.success(`${info.file.name} file uploaded successfully`);
        },
        { createuser: name },
      );
    }
  };
  return (
    <>
      <PageHeaderWrapper title={false}>
        <Access accessible={access.lableFilter('mes1')} fallback={<h2>你没有mes权限</h2>}>
          <ProTable
            pagination={{ pageSize: 8 }}
            headerTitle={
              <div>
                <Access accessible={access.lableFilter('base:line:download')}>
                  {' '}
                  <a style={{ margin: '0 10px' }}>
                    <ArrowDownOutlined onClick={dowonloadData} />
                  </a>
                </Access>

                {
                  <Access accessible={access.lableFilter('base:line:batch')}>
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
                }
              </div>
            }
            actionRef={actionRef}
            columns={columns}
            request={async (params, sorter, filter) => {
              params = formatparams(params);
              commonResult(
                await getData({ params }),
                (result: any) => {
                  setDataSource(result);
                },
                false,
              );
              return { data: dataSource };
            }}
            dataSource={dataSource}
            toolBarRender={() => [
              <Access accessible={access.lableFilter('base:line:add')}>
                <Button
                  type="primary"
                  icon={<PlusSquareFilled />}
                  onClick={() => {
                    setEditRow({});
                    setVisible(true);
                  }}
                >
                  {intl.formatMessage(addIntl)}
                </Button>
              </Access>,
            ]}
          />
        </Access>
        {/**弹出层 */}
        <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />
      </PageHeaderWrapper>
    </>
  );
};

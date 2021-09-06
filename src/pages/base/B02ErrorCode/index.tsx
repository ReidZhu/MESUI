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
  FormOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
import UserModal from './components/TableModal';
import { addBatch, getData, update } from './api';
import { commonResult } from '@/utils/resultUtils';
import ExcleUpload from '@/components/ExcleUpload';
import storageUtils from '@/utils/storageUtils';
import { formatparams } from '@/utils/utils';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import {
  addIntl,
  createtimeIntl,
  createuserIntl,
  deleteornoIntl,
  descriptionIntl,
  dutytypeIntl,
  errorcodeIntl,
  mfgtypeIntl,
  noIntl,
  operationIntl,
} from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default () => {
  const intl = useIntl();
  // 列表数据
  const [dataSource, setDataSource] = useState();
  // modal显示隐藏
  const [visible, setVisible] = useState(false);
  // 修改行
  const [editRow, setEditRow] = useState({});
  // 权限验证
  const access = useAccess();
  // 操作Table
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'id',
      width: 60,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      dataIndex: 'errorcode',
    },
    {
      title: intl.formatMessage(mfgtypeIntl),
      dataIndex: 'mfgtype',
    },
    {
      title: intl.formatMessage(dutytypeIntl),
      dataIndex: 'dutytype',
    },
    {
      title: intl.formatMessage(descriptionIntl),
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createuserIntl),
      dataIndex: 'createuser',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createtimeIntl),
      dataIndex: 'createtime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('base:errorcode:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,
        <Access accessible={access.lableFilter('base:errorcode:remove')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={() => {
              deleteRow({ id: record.id, flag: 'N' });
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

  /**
   * 逻辑删除
   * @param params
   */
  const deleteRow = async (params: any) => {
    const result = await update({ data: params });
    commonResult(result);
    actionRef!.current!.reload();
  };

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, ['errorcode', 'description']);

    createExcle(newData, 'B02-data', ['错误代码', '备注']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '错误代码', c: '备注' }], 'B02Model');
    return 1;
  };
  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['errorcode', 'description'],
        async (result: any) => {
          const params = formatparams(result);
          commonResult(await addBatch({ data: params }));
          message.success(`${info.file.name} file uploaded successfully`);
          actionRef!.current!.reload();
        },
        { createuser: name, flag: 'Y' },
      );
    }
  };

  return (
    <>
    <PageHeaderWrapper title={false}>
      <ProTable
        headerTitle={
          <div>
            <Access accessible={access.lableFilter('base:errorcode:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('base:errorcode:batch')}>
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
        request={async (params: any): Promise<any> => {
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

        
        dataSource={dataSource}
        toolBarRender={() => [
          <Access accessible={access.lableFilter('base:errorcode:add')}>
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
      {/** 弹出层 */}
      <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />
      </PageHeaderWrapper>
    </>
  );
};

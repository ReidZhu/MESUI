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
import TableModal from './components/TableModal';
import { deleteByupn, getData, saveexcelall } from './api';
import ExcleUpload from '@/components/ExcleUpload';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import {
  addIntl,
  BatchtypeIntl,
  createtimeIntl,
  createuserIntl,
  ctmfgprocesstypeIntl,
  Customer,
  CustomerExplain,
  deleteornoIntl,
  descriptionIntl,
  Model,
  oqcknotquantityIntl,
  packingquantityIntl,
  Upn,
} from '@/utils/intl';
import { Selectmfgprocesstype } from '@/components/FormItem';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
export type setDataSource = {
  id?: number;
  upn?: string;
  mfgprocesstype?: string;
  model?: string;
  customerupn?: string;
  customerupndesc?: string;
  createuser?: string;
  createtime?: string;
  oqcqty?: number;
  cartonqty?: number;
  infotype?: string;
  lotqty?: number;
  children?: setDataSource[];
};

export default () => {
  //列表数据
  const [dataSource, setDataSource] = useState([]);

  //國際化
  const intl = useIntl();
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow, setEditRow] = useState({});
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 60,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(ctmfgprocesstypeIntl),
      dataIndex: 'mfgprocesstype',
      renderFormItem: (key, row) => {
        return <Selectmfgprocesstype lable={1} />;
      },
    },

    {
      title: intl.formatMessage(Model),
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage(Customer),
      dataIndex: 'customerupn',
    },
    {
      title: intl.formatMessage(CustomerExplain),
      dataIndex: 'customerupndesc',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(oqcknotquantityIntl),
      dataIndex: 'oqcqty',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(packingquantityIntl),
      dataIndex: 'cartonqty',
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
      title: intl.formatMessage(BatchtypeIntl),
      dataIndex: 'infotype',
      hideInSearch: true,
    },
    {
      title: 'Runcard',
      dataIndex: 'lotqty',
      hideInSearch: true,
    },

    {
      title: intl.formatMessage(descriptionIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('base:upn:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,
        <Access accessible={access.lableFilter('base:upn:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              deleteRow(record.upn);
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
    commonResult(await deleteByupn(params));
    actionRef!.current!.reload();
  }

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, [
      'upn',
      'mfgprocesstype',
      'model',
      'customerupn',
      'customerupndesc',
      'oqcqty',
      'cartonqty',
      'infotype',
      'lotqty',
      'createuser',
      'createtime',
    ]);
    createExcle(newData, 'B05', [
      '機種Upn',
      '段別',
      '機種',
      '客戶料號',
      '客戶料號說明',
      'OQC結批數量',
      '包裝數量',
      'Runcard數量',
      '模式',
      '创建人',
      '创建时间',
    ]);
  };

  const dowonloadModel = () => {
    createExcle(
      [
        {
          a: '機種Upn',
          b: '段別',
          c: '機種',
          d: '客戶料號',
          e: '客戶料號說明',
          l: 'Oqc結批數量',
          s: '包裝數量',
          p: 'Runcard數量',
          v: '模式',
        },
      ],
      'B05',
    );
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        [
          'upn',
          'mfgprocesstype',
          'model',
          'customerupn',
          'customerupndesc',
          'oqcqty',
          'cartonqty',
          'infotype',
          'lotqty',
        ],
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
                <Access accessible={access.lableFilter('base:upn:download')}>
                  <a style={{ margin: '0 10px' }}>
                    <ArrowDownOutlined onClick={dowonloadData} />
                  </a>
                </Access>
                <Access accessible={access.lableFilter('base:upn:batch')}>
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
            request={async (params, sorter, filter) => {
              params = formatparams(params);
              commonResult(
                await getData(params),
                (result: any) => {
                  setDataSource(result);
                },
                false,
              );

              return { data: dataSource };
            }}
            dataSource={dataSource}
            toolBarRender={() => [
              <Access accessible={access.lableFilter('base:upn:add')}>
                {' '}
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
        <TableModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />{' '}
      </PageHeaderWrapper>
    </>
  );
};

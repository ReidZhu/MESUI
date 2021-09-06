import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message, Tag, Popover } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
import ExcleUpload from '@/components/ExcleUpload';
import UserModal from './components/TableModal';
import ChangeModal from './components/ChangeModel';
import { getData, deleteByid, insertdata } from './api';
import { commonResult } from '@/utils/resultUtils';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import storageUtils from '@/utils/storageUtils';
import { formatparams } from '@/utils/utils';
import {
  RouteName,
  createuserIntl,
  createtimeIntl,
  operationIntl,
  addIntl,
  noIntl,
  stageorderIntl,
  stageIntl,
  mstageIntl,
  flagIntl,
  stagematerialIntl,
  postingIntl,
  checkinIntl,
  deleteornoIntl,
  faildeleteIntl,
  oqcIntl,
  batchIntl,
  repairIntl,
  packIntl,
  storeIntl,
} from '@/utils/intl';
export default () => {
  // 列表数据
  const [dataSource, setDataSource] = useState();
  // modal显示隐藏
  const [visible, setVisible] = useState(false);
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
      title: intl.formatMessage(RouteName),
      dataIndex: 'routename',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
      hideInSearch: true,
      valueType: 'select',
    },
    {
      title: intl.formatMessage(mstageIntl),
      dataIndex: 'mstage',
      hideInSearch: true,
      valueType: 'select',
    },
    {
      title: intl.formatMessage(stagematerialIntl),
      dataIndex: 'stagematerial',
      hideInSearch: true,
      valueType: 'select',
    },
    {
      title: intl.formatMessage(stageorderIntl),
      hideInSearch: true,
      dataIndex: 'stageorder',
    },
    {
      title: intl.formatMessage(flagIntl),
      hideInSearch: true,
      dataIndex: 'flag',
      render: (_, record) => {
        if (record.flag == 'M') {
          return <Tag color="green">{intl.formatMessage(postingIntl)}</Tag>;
        } else if (record.flag == 'R') {
          return <Tag color="cyan">{intl.formatMessage(checkinIntl)}</Tag>;
        } else if (record.flag == 'O') {
          return <Tag color="blue">{intl.formatMessage(oqcIntl)}</Tag>;
        } else if (record.flag == 'B') {
          return <Tag color="purple">{intl.formatMessage(batchIntl)}</Tag>;
        } else if (record.flag == 'F') {
          return <Tag color="gold">{intl.formatMessage(packIntl)}</Tag>;
        } else if (record.flag == 'P') {
          return <Tag color="magenta">{intl.formatMessage(storeIntl)}</Tag>;
        } else if (record.flag == 'A') {
          return <Tag color="red">{intl.formatMessage(repairIntl)}</Tag>;
        }
      },
    },
    {
      title: intl.formatMessage(createuserIntl),
      hideInSearch: true,
      dataIndex: 'createuser',
    },
    {
      title: intl.formatMessage(createtimeIntl),
      hideInSearch: true,
      dataIndex: 'createtime',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Access accessible={access.lableFilter('base:process:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setchangeVisible(true);
            }}
          ></Button>
        </Access>,
        <Access accessible={access.lableFilter('base:process:delete')}>
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

  //刪除資料
  async function deleteRow(params: any) {
    const result = await deleteByid(params);
    // console.log(result);
    // message.success('删除成功');
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
    const newData = dataFormat(dataSource, [
      'routename',
      'stage',
      'mstage',
      'stageorder',
      'flag',
      'stagematerial',
    ]);

    createExcle(newData, 'B03data', [
      '流程名',
      '大站點',
      '小站點',
      '排序',
      '站點類型(過賬：Y/點收：N)',
      '料件信息',
    ]);
  };
  const dowonloadModel = () => {
    createExcle(
      [
        {
          a: '流程名',
          b: '大站點',
          c: '小站點',
          d: '排序',
          e: '站點類型(過賬：Y/點收：N)',
          f: '料件信息',
        },
      ],
      'B03Model',
    );
    return 1;
  };
  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['routename', 'stage', 'mstage', 'stageorder', 'flag', 'stagematerial'],
        async (result: any) => {
          const params = formatparams(result);
          commonResult(await insertdata({ data: params }));
          message.success(`${info.file.name} file uploaded successfully`);
          actionRef!.current!.reload();
        },
        { createuser: name },
      );
    }
  };
  return (
    <>
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
          <Access accessible={access.lableFilter('base:process:add')}>
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

      {/* 弹出层 */}
      <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />
      <ChangeModal
        visible={{ visiblechange, setchangeVisible }}
        editRow={editRow}
        tabRef={actionRef}
      />
    </>
  );
};

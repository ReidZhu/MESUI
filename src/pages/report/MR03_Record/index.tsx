import ProTable, { ProColumns } from '@ant-design/pro-table';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Col, FormInstance, Modal, Row, Upload } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { report03 } from './api';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { createExcle, readerExcle } from '@/utils/excleUtils';
import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import {
  BatchqueryIntl,
  createtimeIntl,
  createuserIntl,
  downloadtemplateIotl,
  errorcodeIntl,
  inputIntl,
  Line,
  Model,
  moIntl,
  qtyIntl,
  queryIntl,
  stageIntl,
  templateuploadIotl,
  Upn,
  usnIntl,
} from '@/utils/intl';
import { commonResult } from '@/utils/resultUtils';

type IPListProps = {
  usn: string;
  onChange: (id: string) => void;
};

const IPList: React.FC<IPListProps> = (props) => {
  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);
  const intl = useIntl();
  const [dis, setDis] = useState<any>('none');
  const [fromdis, setFromdis] = useState<any>('block');

  const columns: ProColumns[] = [
    {
      title: 'id',
      key: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: intl.formatMessage(usnIntl),
      key: 'infoid',
      dataIndex: 'infoid',
    },
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(Line),
      key: 'line',
      dataIndex: 'line',
    },
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(qtyIntl),
      key: 'inqty',
      dataIndex: 'inqty',
    },
    {
      title: 'Remark',
      key: 'remark',
      dataIndex: 'remark',
    },
    {
      title: 'mRemark',
      key: 'mremark',
      dataIndex: 'mremark',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      key: 'errorcode',
      dataIndex: 'errorcode',
    },

    {
      title: intl.formatMessage(Model),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage(createuserIntl),
      key: 'createuser',
      dataIndex: 'createuser',
    },
    {
      title: intl.formatMessage(createtimeIntl),
      key: 'createtime',
      dataIndex: 'createtime',
    },
  ];

  const dowonloadModel = () => {
    createExcle([{ a: 'infoids' }], 'MR03');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      readerExcle(info.file.originFileObj, ['infoids'], async (results: any) => {
        let item = [];
        for (var i = 0; i < results.length; i++) {
          item.push(results[i].infoids);
        }
        const result = await report03({ infoids: item });
        setDis('block');
        setFromdis('none');
        commonResult(
          result,
          (data: any) => {
            setDataSource(result.data);
          },
          false,
        );
      });
    }
  };

  const formRef = useRef<FormInstance>();
  return (
    <>
      <PageHeaderWrapper title={false}>
        <div style={{ display: dis }}>
          <ProTable
            pagination={{ pageSize: 8 }}
            // scroll={{ x: 3000 }}
            // style={{ height: '530px' }}
            columns={columns}
            dataSource={dataSource}
            title={() => (
              <Button
                style={{ display: dis }}
                onClick={() => {
                  setDis('none');
                  setFromdis('block');
                }}
              >
                {intl.formatMessage(queryIntl)}
              </Button>
            )}
            rowKey="usn"
            search={false}
          />
        </div>
        <div>
          <ProCard
            style={{ display: fromdis }}
            tabs={{
              type: 'card',
            }}
          >
            <ProCard.TabPane key="tab1" tab={intl.formatMessage(queryIntl)}>
              <ProForm
                submitter={{
                  render: (props, doms) => {
                    return [...doms];
                  },
                }}
                formRef={formRef}
                onFinish={async (values) => {
                  const result = await report03(values);
                  setDis('block');
                  setFromdis('none');
                  commonResult(
                    result,
                    (data: any) => {
                      setDataSource(result.data);
                    },
                    false,
                  );

                  return true;
                }}
              >
                <ProFormText
                  width="md"
                  name="infoids"
                  placeholder={intl.formatMessage(inputIntl)}
                />
              </ProForm>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab2" tab={intl.formatMessage(BatchqueryIntl)}>
              <Row justify="start">
                <Col span={4}>
                  <Button onClick={dowonloadModel} icon={<DownloadOutlined />}>
                    {intl.formatMessage(downloadtemplateIotl)}
                  </Button>
                </Col>
              </Row>
              <br />
              <Row justify="start">
                <Col span={4}>
                  {' '}
                  <Upload onChange={uploadExcle} accept=".xls, .xlsx">
                    <Button type="primary" icon={<UploadOutlined />}>
                      {intl.formatMessage(templateuploadIotl)}
                    </Button>
                  </Upload>
                </Col>
              </Row>
            </ProCard.TabPane>
          </ProCard>
        </div>
      </PageHeaderWrapper>
    </>
  );
};

export default IPList;

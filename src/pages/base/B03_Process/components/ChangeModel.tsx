import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useIntl } from 'umi';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { updateData } from '../api';
import { findAllStage } from '@/services/select';
import {
  RouteName,
  stageorderIntl,
  stageIntl,
  mstageIntl,
  stagematerialIntl,
  selectIntl,
  inputIntl,
  dataStorage,
} from '@/utils/intl';

interface TableModal {
  visible: {
    visiblechange: Boolean;
    setchangeVisible: Function;
  };
  editRow: any;
  tabRef: any;
}

export default (props: TableModal) => {
  const { visible, editRow, tabRef } = props;
  const [dataSource, setDataSource] = useState();
  // 獲取站点
  const [stage, setStage] = useState<[]>([]);
  //國際化
  const intl = useIntl();

  useEffect(() => {
    getAllStage();
  }, []);

  // 获取站点
  const getAllStage = async () => {
    const stages = await findAllStage();

    if (stages.status == 200) {
      setStage(stages.data);
    } else {
      message.error(stages.msg);
    }
  };
  useEffect(() => {}, [dataSource]);
  return (
    <div>
      <ModalForm<any>
        title={intl.formatMessage(dataStorage)}
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visiblechange}
        modalProps={{
          onCancel: () => {
            visible.setchangeVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          values.mstage = values.mstage.split(':')[0];
          values.stage = values.stage.split(':')[0];
          const result = await updateData({ data: values });

          if (result.status == 200) {
            message.success(result.msg);
            visible.setchangeVisible(false);
            tabRef.current.reload();
            return true;
          } else {
            message.error(result.msg);
            return false;
          }
        }}
      >
        <ProFormText width="md" name="id" label="id" placeholder="id" hidden />
        <ProFormText
          width="md"
          name="routename"
          label={intl.formatMessage(RouteName)}
          placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(RouteName)}
          disabled
        />
        <ProFormSelect
          options={stage}
          width="md"
          name="stage"
          label={intl.formatMessage(stageIntl)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl)}
        />
        <ProFormSelect
          options={stage}
          width="md"
          name="mstage"
          label={intl.formatMessage(mstageIntl)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(mstageIntl)}
        />
        <ProFormText
          width="md"
          name="stagematerial"
          label={intl.formatMessage(stagematerialIntl)}
          placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(stagematerialIntl)}
          disabled
        />
        <ProFormText
          width="md"
          name="stageorder"
          label={intl.formatMessage(stageorderIntl)}
          placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(stageorderIntl)}
        />
      </ModalForm>
    </div>
  );
};

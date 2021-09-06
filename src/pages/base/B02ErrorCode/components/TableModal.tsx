import React from 'react';
import { message } from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { update } from '../api';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import { useIntl } from 'umi';
import { dataStorage, descriptionIntl, dutytypeIntl, errorcodeIntl, inputIntl, mfgtypeIntl, noIntl } from '@/utils/intl';
import { Selectdutytype, Selectmfgprocesstype } from '@/components/FormItem';

interface TableModal {
  visible: {
    visible: Boolean;
    setVisible: Function;
  };
  editRow: any;
  tabRef: any;
}

export default (props: TableModal) => {
  const intl = useIntl();
  const { visible, editRow, tabRef } = props;
  return (
    <div>
      <ModalForm<any>
        title={intl.formatMessage(dataStorage)}
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visible}
        modalProps={{
          onCancel: () => {
            visible.setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          if (values.id == null || values.id == '' || values.id == undefined) {
            const user = storageUtils.getUser();
            values.createuser = user.name;
            values.flag = 'Y';
          }
          commonResult(await update({data:values}));
          tabRef.current.reload();
          visible.setVisible(false);
          return true;
        }}
      >
        <ProFormText width="md" name="id" label={intl.formatMessage(noIntl)} hidden placeholder={intl.formatMessage(inputIntl)} />
        <ProFormText width="md" name="errorcode" label={intl.formatMessage(errorcodeIntl)} placeholder={intl.formatMessage(inputIntl)} />
        <Selectmfgprocesstype currentName='mfgtype'/>
        <Selectdutytype/>
        <ProFormText width="md" name="description" label={intl.formatMessage(descriptionIntl)} placeholder={intl.formatMessage(inputIntl)} />
      </ModalForm>
    </div>
  );
};

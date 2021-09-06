import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { updateline } from '../api';
import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import { dataStorage, inputIntl, Line } from '@/utils/intl';
import { useIntl } from 'umi';

interface TableModal {
  visible: { visible: Boolean; setVisible: Function };
  editRow: any;
  tabRef: any;
}

export default (props: TableModal) => {
  const intl = useIntl();
  const { visible, editRow, tabRef } = props;
  return (
    <div>
      <ModalForm<{
        id: string;
        line: string;
        createuser: string;
      }>
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
          values.createuser = storageUtils.getUser().name;
          values = formatparams(values);
          commonResult(await updateline({ data: values }));
          visible.setVisible(false);
          tabRef.current.reload();
          return true;
        }}
      >
        <ProFormText width="md" name="id" hidden />
        <ProFormText width="md" name="createuser" hidden />
        <ProFormText
          width="md"
          name="line"
          label={intl.formatMessage(Line)}
          placeholder={intl.formatMessage(inputIntl)}
        />
      </ModalForm>
    </div>
  );
};

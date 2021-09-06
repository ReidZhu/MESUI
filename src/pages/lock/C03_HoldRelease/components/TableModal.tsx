import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import storageUtils from '@/utils/storageUtils';
import { inputIntl, ReleaseReasonIntl } from '@/utils/intl';
import { useIntl } from 'umi';
import { commonResult } from '@/utils/resultUtils';
import { save } from '../api';

interface TableModal {
  visible: { visible: Boolean; setVisible: Function };

  editRow: any;
  tabRef: any;
  dataSourceRelease: { dataSourceRelease: any; setDataSourceRelease: Function };
}
export default (props: TableModal) => {
  const intl = useIntl();
  const { visible, editRow, tabRef, dataSourceRelease } = props;
  return (
    <div>
      <ModalForm<{
        id: string;
        releasereason: string;
        holdtype: string;
        releaseuser: string;
        holdcontent: string;
        releasedate: Date;
        flag: string;
      }>
        title={intl.formatMessage(ReleaseReasonIntl)}
        width={500}
        initialValues={editRow}
        visible={visible.visible}
        modalProps={{
          onCancel: () => {
            visible.setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          console.log(values);
          values.releaseuser = storageUtils.getUser().name;

          values.flag = 'N';

          commonResult(
            await save({
              data: [values],
              ip: storageUtils.getUser().ip,
              name: storageUtils.getUser().name,
            }),
          );
          visible.setVisible(false);
          dataSourceRelease.setDataSourceRelease(
            dataSourceRelease.dataSourceRelease.filter((e: any) => {
              return e.holdcontent != editRow.holdcontent;
            }),
          );

          tabRef.current.reload();
          return true;
        }}
      >
        <ProFormText width="md" name="holdcontent" hidden />
        <ProFormText width="md" name="id" hidden />
        <ProFormText
          width="md"
          name="releasereason"
          label={intl.formatMessage(ReleaseReasonIntl)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
      </ModalForm>
    </div>
  );
};

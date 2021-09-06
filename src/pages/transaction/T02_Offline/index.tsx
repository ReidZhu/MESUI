import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess,useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Col, Form, Switch } from 'antd';
import { message, Row } from 'antd';
import { useModel } from 'umi';
import storageUtils from '@/utils/storageUtils';
//import UserModal from '../Demo/components/TableModal';
//import PrintDemo from '../Demo/components/PrintDemo';
//import arrayMove from 'array-move';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import {
  getMoList,
  getMachine,
  getNum,
  confirmList,
  getMoInfo,
} from './service';

import {
  repetitionIntl,
  selectIntl,
  inputIntl,
  numberIntl,
  resetIntl,
  submitIntl,
  idIntl,
  inputInfoIntl,
  modeIntl,
  numIntl,
  fekiIntl,
  usnIntl,
  offlineNumIntl,
  moselectIntl,
  inputUsnIntl,
  inputNumIntl,
  moinfoIntl,
  lotnoIntl,
  usnInfoIntl,
  offlineSuccIntl,
  offlinemodeIntl,
  printIntl
  
} from '@/utils/intl';
import { checkbox } from '@/pages/packagingcenter/P05_BoxDevanning/service';


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type ChipType = {
  id: React.Key;
  usn?: string;
  sheetid?: string;
  cutid?: string;
  arrayid?: string;
  inqty?: number;
  offqty?: number;
};

export type TypeNum = {
  id: React.Key;
  inputUsn?: string;
  type?: string;
  num?: number;
  fekinum?: number;
};

export default () => {
  //列表数据
  const [dataSource1, setDataSource1] = useState<TypeNum[]>([]);

  const [dataSource, setDataSource] = useState<MesStageErrorCode[]>([]);
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow, setEditRow] = useState({});
  //打印的element
  const [printContent, setPrintContent] = useState<any>();
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();
  //站点
  const [stage, setStage] = useState<[]>([]);
  //线体
  const [errorcode, setErrorcode] = useState<[]>([]);

  const { initialState } = useModel('@@initialState');

  const [mo, setMo] = useState<any[]>([]);

  const [machine, setMachine] = useState<any[]>([]);

  const [selectedMo, setSelectedMo] = useState();

  const [numState, setNumState] = useState(0);

  const intl = useIntl();

  const [moinfoState,setMoinfoState] = useState<String>();

  const [config,setconfig]=useState(null);

  const [selectDisableState,setSelectDisableState]=useState(false);

  const [lottype,setLottype]=useState(false);

  const [inputDisbleState,setInputDisableState]=useState(false);

  const [fekinum,setFekinum]=useState(0);

  const [lotinfo,setLotinfo]=useState<String>();

  const [offtype,setOfftype]=useState<String>();

  const [readtype,setReadtype]=useState(true);

  useEffect(() => {
    getMo();
  }, []);

  useEffect(() => {}, [dataSource]);

  const [form] = Form.useForm();

 const changeReadType=()=>{
    const type=readtype;
    setReadtype(type==false?true:false);
 }

 const printClick=()=>{
  let infoid= lotinfo;
  window.open("http://10.57.30.60:8080/koemes/print/showPdf?infoid="+infoid);
}
  const getMo = async () => {
    const moList = await getMoList();
    console.log(moList);
    if (moList.status == 200) {
      const moArray: any[] = [];
      
      const arr = moList.data;
      console.log(arr);
      arr.map((item: any, index) => {
        moArray.push({ label: item.mo, value: item.mo });
      });
      //moArray.push({label:moList.data.mo,value:moList.data.mo})
      setMo(moArray);
    } else {
      message.error(moList.msg);
      return;
    }
  };

  const reset =()=>{
    
    setInputDisableState(false);
    setSelectDisableState(false);
    setNumState(0);
    setFekinum(0);
    setDataSource1([]);
    setDataSource([]);
    setOfftype("");
    form.setFieldsValue({num:null});
    queryMoInfo(selectedMo);
  }

  
  const queryMoInfo = async (mo: String) => {
    
    const moinfo = await getMoInfo(mo);
    const result = moinfo.data;
    console.log(result);
    if(moinfo.status!=200){
      message.error(moinfo.msg);
      return;
    }
    let unit:String=result.unit.toString();
    const info:String=result.model.toString()+ " " + result.upn + " 工單總數:" + result.qty + " 已下線數量:" + result.inputqty;
    if(unit.toUpperCase()=="LOT"){
      setLottype(true);
      setOfftype(unit.toUpperCase());
    }else{
      setLottype(false);
      setOfftype(unit.toUpperCase());
    }
    setMoinfoState(info);
    console.log(moinfo);
  }

  // const print = async(infoid:String)=>{
  //   browserHistory.push("http://10.57.30.60:8080/koemes/print/showPdf?infoid="+infoid);
  // }

  const getMacs = async (mo: String) => {
    const macs = await getMachine(mo);
    if (macs.status == 200) {
      const arr = macs.data;
      const macArray: any[] = [];
      arr.map((item: any, index) => {
        macArray.push({ label: item.machineid, value: item.machineid });
      });
      setMachine(macArray);
    }
  };

  const getTable = async (inputusn: String) => {
    const mo: any = selectedMo;
    if (mo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    const lang: String=localStorage.getItem('umi_locale')
    setSelectDisableState(true);
    const result = await getNum(inputusn,mo,lang);
    if (result.status == 200) {
      const data = result.data.typenum;
      let fenum=fekinum;
      fenum+=result.data.fekinum
      setFekinum(fenum);
      const ll: TypeNum[] = JSON.parse(JSON.stringify(dataSource1));
      console.log(ll.length);
      if (ll.length > 0) {
        const ftype = ll[0].type;
        if (ftype != data.type) {
          message.error('刷入類型不同');
          return;
        } else {
          for (let i = 0; i < ll.length; i++) {
            if (ll[i].inputUsn == data.inputUsn) {
              message.error(intl.formatMessage(repetitionIntl));
              return;
            }
          }
        }
      }

      ll.push(data);
      setDataSource1(ll);
      const data2 = result.data.listchip;
      console.log(data2);
      const chiplist: ChipType[] = JSON.parse(JSON.stringify(dataSource));
      for (let i = 0; i < data2.length; i++) {
        chiplist.push(data2[i]);
      }
      form.setFieldsValue({ usn: null });
      if(lottype==true){
        setInputDisableState(true);
      }
      setNumState(chiplist.length);
      setDataSource(chiplist);
    } else {
      message.error(result.msg);
    }
  };

  const confirmBtn = async () => {
    let num = form.getFieldValue("num");
    if(lottype==false){
      num=numState;
    }
    const tablelist: TypeNum[] = JSON.parse(JSON.stringify(dataSource1));
    console.log(tablelist);
    const moinfo: any = selectedMo;
    if (moinfo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    let ip:String = storageUtils.getUser().ip;
    let user:String =storageUtils.getUser().name;
    const all = { tablelist: tablelist, mo: moinfo ,num: num,ip:ip,user:user };
    const result = await confirmList({ data: all });
    if (result.status != 200) {
      message.error(result.msg);
    } else {
      message.success(intl.formatMessage(offlineSuccIntl));
      setLotinfo(result.msg);
    }
    form.setFieldsValue({ usn: null });
    queryMoInfo(moinfo);
    reset();
    //setMoinfoState("-");
  };

  const cols1: ProColumns<TypeNum>[] = [
    {
      title: intl.formatMessage(idIntl),
      dataIndex: 'id',
      width: 100,
      className: 'drag-visible',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(inputInfoIntl),
      dataIndex: 'inputUsn',
      width: 200,
    },
    {
      title: intl.formatMessage(modeIntl),
      dataIndex: 'type',
      width: 150,
    },
    {
      title: intl.formatMessage(numIntl),
      dataIndex: 'num',
      width: 100,
    },
    {
      title: intl.formatMessage(fekiIntl)+intl.formatMessage(numIntl),
      dataIndex:'fekinum',
      width: 100
    }
  ];

  const columns: ProColumns<ChipType>[] = [
    {
      title: intl.formatMessage(idIntl),
      dataIndex: 'id',
      width: 100,
      className: 'drag-visible',
      hideInTable: true,
      hideInSearch: true,
      //render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(usnIntl),
      dataIndex: 'usn',
      width: 150,
    },
    {
      title: 'Sheet',
      dataIndex: 'sheetid',
      width: 150,
    },
    {
      title: 'Cut',
      dataIndex: 'cutid',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Array',
      dataIndex: 'arrayid',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(numIntl),
      dataIndex: 'inqty',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(offlineNumIntl),
      dataIndex: 'offqty',
      hideInSearch: true,
      width: 150,
    }
  ];

  return (
    <>
      <Row gutter={12}>
      <Col className="gutter-row" span={8} style={{ backgroundColor: 'white',minHeight:"500px"}}>
      {/* <Access accessible={access.lableFilter('mes1')} fallback={<h2>你没有mes权限</h2>}> */}
      <ProForm
        form={form}
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          // 配置按钮的属性
          resetButtonProps: {
            style: {
              // 隐藏重置按钮
              display: 'none',
            },
          },
          submitButtonProps: {},

          // 完全自定义整个区域
          render: (props, doms) => {
            console.log(props);
            return [
              <button
                type="button"
                className="ant-btn"
                key="reset"
                onClick={() => {
                  reset();
                  setLotinfo("");
                }}
              >
                {intl.formatMessage(resetIntl)}
              </button>,
              <button
                type="button"
                className="ant-btn ant-btn-primary"
                key="submit"
                onClick={() => {
                  confirmBtn();
                }}
              >
                {intl.formatMessage(submitIntl)}
              </button>,
              
            ];
          },
        }}
        layout="horizontal"
      >
        
          <ProForm.Group>
            <Row></Row>
          </ProForm.Group>
          <ProFormSelect
            disabled={selectDisableState}
            label={intl.formatMessage(moselectIntl)}
            options={mo}
            fieldProps={{
              onChange: (e) => {
                console.log(e);
                //getMacs(e);
                setSelectedMo(e);
                queryMoInfo(e);
              },
            }}
          ></ProFormSelect>
          {/* <ProFormSelect label="請選擇機台" width="xs" options={machine}></ProFormSelect> */}
            <ProFormText
              disabled={inputDisbleState}
              label={intl.formatMessage(inputUsnIntl)}
              placeholder={intl.formatMessage(inputIntl)}
              name="usn"
              fieldProps={{
                onPressEnter: (e) => {
                  //console.log(e.currentTarget.value);
                  getTable(e.currentTarget.value);
                },
              }}
            />
             <ProFormText
              hidden={!lottype}
              label={intl.formatMessage(inputNumIntl)}
              placeholder={intl.formatMessage(inputIntl)}
              name="num"
            />
            <ProFormText
              hidden={lottype}
              label={intl.formatMessage(numIntl)+":"}
              fieldProps={{ value: numState.toString() }}
              formItemProps={{ style: { color: 'blue' } }}
              width="xs"
              readonly
            ></ProFormText>
             <ProFormText
              label={intl.formatMessage(offlinemodeIntl)+":"}
              fieldProps={{ value: offtype }}
              formItemProps={{ style: { color: 'blue' } }}
              width="xs"
              readonly
            ></ProFormText>
            <ProFormText
              label={intl.formatMessage(moinfoIntl)+":"}
              fieldProps={{ value:moinfoState?.toString() }}
              readonly
            ></ProFormText>
          </ProForm>
          <div style={{width:"60%",float:'left',marginTop:"10px"}}>
          <ProFormText
              hidden={!lottype}
              label={intl.formatMessage(lotnoIntl)+":"}
              fieldProps={{ value:lotinfo,onChange:(e)=>{
                  //console.log(e.target.value);
                  setLotinfo(e.target.value);
              } }}
              readonly={readtype}
              name="formlot"
            ></ProFormText>
            </div>
            <div hidden={!lottype} style={{width:"15%",float:'left',marginLeft:"5px",marginTop:"12px"}}>
            <Switch onChange={changeReadType} />
            </div>
            <button
              type="button"
              hidden={!lottype}
              className="ant-btn ant-btn-primary"
              key="submit"
              style={{float:'left',marginTop:"10px"}}
              onClick={printClick}
            >
              {intl.formatMessage(printIntl)}
            </button>
        </Col>
        <Col className="gutter-row" span={16}>
        <div style={{ backgroundColor: 'white', paddingLeft: '20px' ,minHeight:'500px'}}>
          <ProForm.Group>
            <div hidden={lottype}>
            <ProTable
              
              pagination={{pageSize:5}}
              search={false}
              actionRef={actionRef}
              headerTitle={intl.formatMessage(inputInfoIntl)}
              //toolBarRender={false}
              options={false}
              columns={cols1}
              // request={async (params = {}, sort, filter) => {
              //   //message.success('查询参数=>' + JSON.stringify(values));
              //   console.log(params as MesStageErrorCode, 'MesStageErrorCode');
              //   const result = await findAllStageError(params as MesStageErrorCode);
              //   commonResult(
              //     result,
              //     (data: any) => {
              //       setDataSource(data);
              //     },
              //     false,
              //   );
              //   return { data: dataSource };
              // }}
              dataSource={dataSource1}
            />
            </div>
            <ProTable
              pagination={{pageSize:5}}
              search={false}
              actionRef={actionRef}
              headerTitle={intl.formatMessage(usnInfoIntl)}
              //toolBarRender={false}
              options={false}
              columns={columns}
              // request={async (params = {}, sort, filter) => {
              //   //message.success('查询参数=>' + JSON.stringify(values));
              //   console.log(params as MesStageErrorCode, 'MesStageErrorCode');
              //   const result = await findAllStageError(params as MesStageErrorCode);
              //   commonResult(
              //     result,
              //     (data: any) => {
              //       setDataSource(data);
              //     },
              //     false,
              //   );
              //   return { data: dataSource };
              // }}
              dataSource={dataSource}
            />
          </ProForm.Group>
        </div>
        </Col>
        </Row>
    </>
  );
};

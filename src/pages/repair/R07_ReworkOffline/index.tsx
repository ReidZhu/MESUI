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
  checkInput ,
  confirmList,
  getMoInfo,
  findAllRoute,
  findAllStep,
} from './service';

import {
  repetitionIntl,
  selectIntl,
  inputIntl,
  numberIntl,
  resetIntl,
  submitIntl,
  inputInfoIntl,
  lotnoIntl,
  moinfoIntl,
  numIntl,
  offlinemodeIntl,
  inputBoxIntl,
  moselectIntl,
  modeIntl,
  idIntl,
  RouteName,
  selectRouteIntl,
  pleasebrushdataIntl,
  offlineSuccIntl,
  selectStepIntl,
  printIntl
  
} from '@/utils/intl';


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type TypeNum = {
  id: React.Key;
  inputUsn?: string;
  type?: string;
  num?: number;
};

export default () => {
  //列表数据
  const [dataSource1, setDataSource1] = useState<TypeNum[]>([]);

  const actionRef = useRef<ActionType>();

  const [mo, setMo] = useState<any[]>([]);

  const [selectedMo, setSelectedMo] = useState();

  const [selectedStage, setSelectedStage] = useState();

  const [numState, setNumState] = useState(0);

  const intl = useIntl();

  const [moinfoState,setMoinfoState] = useState<String>();

  const [selectDisableState,setSelectDisableState]=useState(false);

  const [lottype,setLottype]=useState(false);

  const [inputDisbleState,setInputDisableState]=useState(false);

  const [lotinfo,setLotinfo]=useState<String>();

  const [offtype,setOfftype]=useState<String>();
  //流程
  //const [route, setRoute] = useState<any[]>([]);

  const [steplist,setSteplist] = useState<any[]>([]);

  //const [routename,setRoutename]=useState<String>();
  const [readtype,setReadtype]=useState(true);

  const changeReadType=()=>{
    const type=readtype;
    setReadtype(type==false?true:false);
 }

 const printClick=()=>{
  let infoid= lotinfo;
  window.open("http://10.57.30.60:8080/koemes/print/showPdf?infoid="+infoid);
}

  useEffect(() => {
    getMo();
  }, []);

  const [form] = Form.useForm();

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

  //获取流程
  const getAllStep = async (routename:String) => {
    
    const steps = await findAllStep(routename);
    if (steps.status == 200) {
      const stepArray: any[] = [];
      
      const arr = steps.data;
      arr.map((item: any, index) => {
        const sub= {label:item.stage,value:item.stage};
        console.log(index);
        if(stepArray.indexOf(sub)<0){
          stepArray.push(sub);
        }
      });
      var result = [];
      var obj = {};
      for(var i =0; i<stepArray.length; i++){
         if(!obj[stepArray[i].label]){
            result.push(stepArray[i]);
            obj[stepArray[i].label] = true;
         }
      }
      setSteplist(result);
    } else {
      message.error(steps.msg);
    }
  };

  const reset =()=>{
    
    setInputDisableState(false);
    setSelectDisableState(false);
    setNumState(0);
    setDataSource1([]);
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
    getAllStep(result.routename);
    console.log(moinfo);
  }

  const getTable = async (inputusn: String) => {
    const mo: any = selectedMo;
    if (mo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    const lang: String=localStorage.getItem('umi_locale')
    setSelectDisableState(true);
    let data={data:{inputInfo:inputusn,offlineMo:mo}};
    const result = await checkInput(data);
    //const result = await getNum(inputusn,mo,lang);
    if (result.status == 200) {
      const data = result.data;
      console.log(data);
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
      console.log(data);
      ll.push(data);
      setDataSource1(ll);
      let num_state=0;
      for(let i=0;i<ll.length;i++){
        num_state+=ll[i].num;
      }
      setNumState(num_state);
      //const data2 = result.data.listchip;
      //console.log(data2);
      form.setFieldsValue({ usn: null });
      // if(lottype==true){
      //   setInputDisableState(true);
      // }
    } else {
      message.error(result.msg);
    }
  };

  const confirmBtn = async () => {
    
    const tablelist: TypeNum[] = JSON.parse(JSON.stringify(dataSource1));
    console.log(tablelist);
    const moinfo: any = selectedMo;
    if (moinfo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    const stage:any=selectedStage;
    //console.log(routename);
    if(stage==null){
      message.error(intl.formatMessage(selectStepIntl));
      return;
    }
    let ip:String = storageUtils.getUser().ip;
    let user:String =storageUtils.getUser().name;
    if(tablelist.length==0){
      message.error(intl.formatMessage(pleasebrushdataIntl));
      return;
    }
    const all = { tablelist: tablelist, mo: moinfo ,ip:ip,user:user,stage:stage };
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
      title:intl.formatMessage(numIntl),
      dataIndex: 'num',
      width: 100,
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
          <ProFormSelect
          options={steplist}
          //width="md"
          name="step"
          label={intl.formatMessage(selectStepIntl)}
          placeholder={intl.formatMessage(selectIntl)}
          fieldProps={{
            onChange: (e) => {
              console.log(e);
              //getMacs(e);
              setSelectedStage(e);
            },
          }}
        />
          {/* <ProFormSelect label="請選擇機台" width="xs" options={machine}></ProFormSelect> */}
            <ProFormText
              disabled={inputDisbleState}
              label={intl.formatMessage(inputBoxIntl)+":"}
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
            <div>
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
          </ProForm.Group>
        </div>
        </Col>
        </Row>
    </>
  );
};

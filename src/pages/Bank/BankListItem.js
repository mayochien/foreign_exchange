import React from 'react';
import {withTranslation} from 'react-i18next';
import { apiPutBankEdit, apiDeleteBank } from '../../services/apiService'
import { MdDelete } from "react-icons/md";
import SweetAlert from 'sweetalert-react';
// import { CURRENCIES_STR } from '../../const'


class BankListItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      modifiable:false,
      account_name: props.account_name,
      alertShow:false
    }
  }


  // showIsBlock=(value)=>{
  //   let t = this.props
  //   if(value === false){
  //     return <span className="text-green">{t('app.available')}</span>
  //   }
  //   else{
  //     return <span className="text-red">{t('app.unavailable')}</span>
  //   }
  // }

  showNullLine=(value)=>{
    // console.log(value);
    if(value === ''|| value===null){
      return <span>-</span>
    }
    else{
      return value
    }
  }

  showRole =(value)=>{
    let {t} = this.props
    switch(value){
      case 10:
        return t('ROLE_STATUS.manager')
      case 11:
        return t('ROLE_STATUS.manager_helper')
      case 20:
        return t('ROLE_STATUS.generalAgent')
      case 30:
        return t('ROLE_STATUS.normal_member')
      case 31:
        return t('ROLE_STATUS.credit_member')
      case 40:
        return t('ROLE_STATUS.banker')
      case 41:
        return "41"
      case 42:
        return "42"
      case 43:
        return "43"
      default: 
        return value
    }
  }

  onClickEdit = () =>{
    this.setState({
      modifiable:true,
      account_name: this.props.account_name,
    })
  }

  onClickSave = () =>{
    this.setState({
      modifiable:false
    })
    this.putEditData()
  }

  // ---------- api:post 修改資料 ---------- 
  putEditData = async(e,key_id)=>{
    // console.log(this.state.account_name)
    let putData = {
      account_name:this.state.account_name
    }

    if(putData===null || putData==='' || putData===undefined){
      this.setState({
        account_name:this.props.account_name,
        modifiable:false
      })
    }else{
      // console.log('--put Data--',putData)
      try{
        let res = await apiPutBankEdit(key_id,putData)
        if(res.data.code === 1){
          console.log('修改成功:',putData)
          this.setState({
            modifiable:false,
            account_name:this.state.account_name
          })
        }
      }catch(err){
        console.log(err)
      }
      this.props.refreshData(this.props.activePage)
    }
  }

  cancelEdited= () => {// 取消(放棄編輯)
    this.setState({
      modifiable: false,
    });
  }

  submitDelete = async(key_id) => {
    try{
      let res = await apiDeleteBank(key_id)
      if(res.data.code ===1){
        console.log('刪除id ↓',key_id)
        this.props.refreshData()
      }
    }catch (err) {
      console.log(err)
    }
  }

    render(){
    let {t} = this.props
    let { modifiable } = this.state
    // console.log('this state:',this.state)
    // console.log('this props:',this.props)

      return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.showNullLine(this.props.bank_name)}</td>
          <td>{this.showNullLine(this.props.bank_code)}</td>
          {/* <td>{this.props.account_name}</td> */}

          <td>
            {modifiable?
            <input type="text" className="td-input"
              value={this.state.account_name}
              onChange={e=>this.setState({
                account_name:e.target.value
              })}
              />
            :
            this.props.account_name}
          </td>

          <td>{this.props.account_number}</td>

          <td>{this.showNullLine(this.props.bank_branch)}</td>
          <td>{this.showNullLine(this.props.country)}</td>
          <td>{this.showNullLine(this.props.swift_code)}</td>

          <td>{this.showNullLine(this.props.currency_type)}</td>
          <td>{this.showNullLine(this.props.payee_addr)}</td>
          <td>{this.showNullLine(this.props.bank_addr)}</td>
          <td>{this.showNullLine(this.props.beneficiary_addr)}</td>
          <td>{this.showNullLine(this.props.bank_state_code)}</td>
          <td>{this.showNullLine(this.props.payee_phone_number)}</td>

          <td>
            <button className="table-small-btn btn-delete"
             onClick={() => this.setState({ alertShow: true })}>
              <MdDelete/>
            </button>
          </td>

          <SweetAlert
            show={this.state.alertShow}
            title={t('app.confirm')+' '+t('app.delete')+' ?'}
            showCancelButton
            confirmButtonText={t('app.confirm')}
            cancelButtonText={t('app.cancel')}
            width={300}
            onConfirm={() => {
              this.submitDelete(this.props.id)
              this.setState({ alertShow: false });
            }}
            onCancel={() => {
              this.setState({ alertShow: false });
            }}
            onEscapeKey={() => this.setState({ alertShow: false })}
            onOutsideClick={() => this.setState({ alertShow: false })}
          />

        </tr>
      )
    }
}

export default withTranslation()(BankListItem);
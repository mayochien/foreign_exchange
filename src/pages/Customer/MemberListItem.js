import React from 'react';
import {withTranslation} from 'react-i18next';
import { apiPutUserEdit } from '../../services/apiService'
import { MdEdit,MdDone,MdClear,MdMenu} from "react-icons/md";
import { Link } from 'react-router-dom';


class MmberListItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      modifiable:false,
      UserGroup:[],
      state_is_block: props.is_block,
      remark:props.remark
    }
  }

  showIsBlock=(value)=>{
    let {t} = this.props
    if(value === false){
      return <span className="text-green">{t('app.available')}</span>
    }
    else{
      return <span className="text-red">{t('app.unavailable')}</span>
    }
  }


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
    })
  }

  cancelEdited= () => {// 取消(放棄編輯)
    this.setState({
      modifiable: false,
    });
  }

  onClickSave = () =>{
    this.setState({
      modifiable:false
    })
    this.putEditData()
  }

  // ********** put 修改資料 ********** 
  putEditData = async()=>{
    // console.log(this.state.nickname)
    let putData = {
      remark:this.state.remark
    }

    if(putData===null || putData==='' || putData===undefined){
      this.setState({
        remark:this.props.remark,
        modifiable:false
      })
    }else{
      try{
        let res = await apiPutUserEdit(this.props.id,putData)
        console.log(res.data)
        if(res.data.code === 1){
          this.setState({
            modifiable:false
          })
        }
      }catch (err) {
        console.log(err)
      }
      this.props.refreshData()
    }
  }


  render(){
  // let {t} = this.props
  let { modifiable } = this.state
  // console.log('get:remarkGroup ↓',this.state.UserGroup);
  // console.log('state:',modifiable)
  // console.log('state:',nickname)

    return (
      <tr>
        <td>{this.props.id}</td>
        {/* <td>{this.props.upline_username}</td> */}
        <td>{this.props.username}</td>
        <td>{this.props.nickname}</td>
        <td>{this.showRole(this.props.role)}</td>
        <td>{this.props.register_date}</td>
        <td>
          {modifiable?
            <input type="text" className="td-input"
              value={this.state.remark}
              onChange={e=>this.setState({
                remark:e.target.value
              })}
              />
            :
            this.showNullLine(this.props.remark)}
        </td>

        <td className="td-actions-icon">
          {!modifiable?
            <button className="table-small-btn"
            onClick={this.onClickEdit}>
            <MdEdit/>
          </button>
          :
          <span className="d-flex">
            <button className="table-small-btn table-small-done"
              onClick={()=>this.putEditData(this.props.id)}>
              <MdDone/>
            </button>
            <button className="table-small-btn btn-delete"
              onClick={this.cancelEdited}>
            <MdClear/>
            </button>
          </span>
          }
        </td>

        <td>{this.showIsBlock(this.props.is_block)}</td>

        <td>
          <button className="detail-btn">
            <Link to={`/member-sell-order-list/${this.props.id}?pageFrom=member`}>
              <MdMenu/>
            </Link>
          </button>
        </td>

      </tr>
    )
  }
}

export default withTranslation()(MmberListItem);

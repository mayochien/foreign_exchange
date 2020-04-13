import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiPostVerify, 
        apiPostUploadDepositReceipt,
        apiGetDepositBank,
        apiGetUploadReceipt } from '../../services/apiService';
import { HANDLING_FEE_TYPE} from '../../const';
import  Format  from '../../services/Format';


class WalletRecordItem extends Component {

  state = {
    modifiable: false,
    unverifiedDepositList: [],
    state_remark: this.props.remark,
    imagePreviewUrl:'',
    isOpenUploadPhoto:false,
    isOpenBankAccountVerify:false,
  }

  sendVerify = async(id, verify) => {
    const postData = {
      result: verify
    }
    let resp = await apiPostVerify(id, postData);
    if(resp.statusText === "OK") {
      alert('更新成功')
    }
  }

  onClickEdit = () => {
    this.setState({
      modifiable:true,
    })
  }

  cancelEdited= (id) => {
    this.setState({
      modifiable: false,
    });
  }

  // ========== 1. api-get:查看匯款的帳戶==========
  onOpenBankAccountVerify = async () => {
    console.log("選擇的單據id:",this.props.id)
    this.setState({ isOpenBankAccountVerify: true });
    try {
      let res = await apiGetDepositBank(this.props.id)
      if(res.data.code===1){
        let resultData = res.data.data.deposit_account
        console.log(resultData)
        this.setState({
          verify_account_name: resultData.account_name,
          verify_account_number: resultData.account_number,
          verify_bank_name: resultData.bank_name,
          verify_bank_branch: resultData.bank_branch,
          verify_bank_code: resultData.bank_code,
          verify_currency_type: resultData.currency_type,
          verify_id: resultData.id,
          verify_swift_code: resultData.swift_code,
          verify_type: resultData.type,
        })
      }
    }catch(err) {
      console.log(err);
    }
  };


  // ========== 2. 開啟上傳彈框 (or觀看我的已上傳的單據) ==========
  onOpenUploadPhoto = async() => {
    let {t} = this.props
    this.showLoading()
    console.log("選擇的單據id:",this.props.id)
    this.setState({ isOpenUploadPhoto: true });
    // 狀態大於30時，才能去抓上傳過的圖片 ↓
    if(this.props.status>20){
      try{ //---------- api:get:觀看我的單據----------
        let api_imageCode = await apiGetUploadReceipt(this.props.id)
        let api_imageStr = api_imageCode.data.data.image
        this.setState({
          getMyImage:api_imageStr,
          noImageText:'',
          imageGetError:false
        })
      }catch (err) {
        console.log(err)
        this.setState({
          noImageText:t('ERRORCODE.NO_IMAGE_1001'),
          imageGetError:true
        })
      }
    }
  }

  // ========== 功能:更換單據 ==========
  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

   // ========== submit成功訊息 ==========
   showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message:
      <span className="text-green">
        {t('app.success')}
      </span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:'',
        state_error_message:''
      });
      this.onCloseAllModal()
    }, 1500)
  }

  // ========== api-post:上傳我的單據  ==========
  submitUploadPhoto = async(e) => {
    e.preventDefault();
    let str64 = this.state.imagePreviewUrl
    // let new_str64 = str64.replace(`data:image/jpeg;base64,`, '')
    // console.log(new_str64)
    let postData={
      image: str64
    }
    console.log('postData:',postData)
    console.log('this.props.id:',this.props.id)
    try{
      let res = await apiPostUploadDepositReceipt(this.props.id,postData)
      if(res.data.code===1){
        console.log('上傳成功 ↓',postData)
        this.showSubmitSuccess()
      }
    }catch (err) {
      console.log(err);
      this.showSubmitError()
    }
  }

  // ========== 功能:關閉所有Modal ==========
  onCloseAllModal = () => {
    this.setState({ 
      isOpenUploadPhoto: false,
      isOpenBankAccountVerify:false
    });
  };

  showNullLine = (value) => {
    // console.log(value)
    if(value==='' || value===undefined || value===0 || value==="0.000"){
      return '-'
    }
    else{
      return value
    }
  }

    //  ========== submit失敗訊息 ==========
    showSubmitError = () =>{
      let {t} = this.props
      this.setState({
        state_error_message:<span className="text-red">
        {t('app.fail')}
        </span>
      })
      setTimeout(() => {
        this.setState({
          state_error_message:'',
          state_success_message:''
        })
      }, 1500)
    }


  render() {
    // console.log('this.props:',this.props)
    const { t } = this.props;

    return (
      <React.Fragment>
        <tr className={this.props.status===2?"text-failed tr-vertical-line":'tr-vertical-line'}>
          <td>{this.props.serial_number}</td>
          {/* <td>{CURRENCIES_STR[this.props.currency]}</td> */}
          <td className="text-green">{this.showNullLine(Format.thousandsMathRound3(this.props.income))}</td>
          <td className="text-red">{this.showNullLine(Format.thousandsMathRound3(this.props.outcome))}</td>
          <td>{Format.thousandsMathRound3(this.props.amount)}</td>
          <td>{t(HANDLING_FEE_TYPE[this.props.expense_item])}</td>
          <td>{this.props.create_datetime}</td>
          <td>{this.showNullLine(this.props.remark)}</td>
        </tr>
      </React.Fragment>
    );
  }
}

export default withTranslation()(WalletRecordItem);

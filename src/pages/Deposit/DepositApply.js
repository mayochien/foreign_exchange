import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiPostDeposit, 
        apiGetDepositCurrency, 
        apiGetDepositRate } from '../../services/apiService';
import { MdRemoveRedEye, MdDone } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
// import { ERRORCODE } from '../../const'
import  Format  from '../../services/Format';

class DepositApply extends Component {
  state = {
    currency: '',
    amount: '',
    remark: '',
    modifiable: false,
    state_success_message:'',
    state_error_message:'',
    isShowResultModal:false,
    currencyOptions:[],
    showRedirectBtn:false,
    toHKDRate:'',
    isRepeatClickStop:false,
    stateLanguage: this.props.i18n.language, //解決下拉"請選擇"，翻譯不即時問題
  }

  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message:<span className="text-green">
      <MdDone/> {t('app.add_success')}</span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:t('app.go')+t('app.list_page')+' ?',
        showRedirectBtn:true
      })
    }, 2000)
  }

  showInputDataMissing = () => {
    let {t} = this.props
    console.log('有欄位未填寫')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
   this.clearMessageAndCloseModal()
  }


  
  // ---------- get:可存款的幣別 ----------
  getOpenCurrencyList = async() => {
    try{
      let res = await apiGetDepositCurrency()
        if(res.data.code === 1){
            this.setState({
              currencyOptions:Object.keys(res.data.data.open_currency)
            })
        }
        else{
          this.setState({
            currencyOptions:[]
          })
        }
    }catch (err) {
      console.log(err)
    }
  }

  onChangeCurrency = (e) => {
    this.setState({
      currency:e.target.value
    }, ()=>{
      this.getExchangeRate() // 已經先填好數量時，切換幣別，也要換算顯示
    })
  }



  onChangeAmount = async(e) => { //開頭不能輸入0、不能輸入符號、負數、小數點
    let value = e.target.value.replace(/[^\d]/,'')
    if (value.startsWith('0')) {
      value = value.substring('1')
    }
    else{
      this.setState({
        amount:value
      },()=>{
        this.getExchangeRate()
      })
    }
  }

  // ---------- get:對港幣的匯率 ----------
  getExchangeRate = async() =>{
    // console.log(this.state.currency)
    try {
      let res = await apiGetDepositRate()
      // console.log('res.data:',res.data)
      if(res.data.code===1){
        this.setState({
          toHKDRate:res.data.data.rates[this.state.currency].toFixed(6)
        }
        // ,()=>{console.log(this.state.toHKDRate)}
        )
      }
    } catch (err) {
      console.log(err);
    }
  }

  onChangeRemark = (e) => {
    this.setState({
      remark: e.target.value
    })
  }


  stopRepeatClick = () => {
    this.setState({
      isRepeatClickStop:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop:false,
      })
    },2000)
  }

  // ---------- post:存款 ----------
  submitPost = async() => {
    let {t} = this.props
    let { amount, remark } = this.state;
    let postData = {
      currency: this.state.currency,
      amount: parseFloat(amount),
      remark: remark,
    }
    console.log('postData:',postData)

    this.stopRepeatClick()

    if(this.state.currency === ''
      || this.state.amount === ''
      ){
        this.showInputDataMissing() //有欄位未填時
    }
    else{
      try{
        let res = await apiPostDeposit(postData);
        if(res.data.code===1){
          this.setState({
            isShowResultModal:true
          })
          this.showSubmitSuccess()
          setTimeout(() => {
            this.clearStateData()
          }, 500);
        }
        else{
          // this.setState({
          //   isShowResultModal:true,
          //   state_error_message:t(ERRORCODE[res.data.code])
          // })
          // this.clearMessageAndCloseModal()
        }
      } catch(err) {
        console.log(err);
        this.setState({
          isShowResultModal:true,
          state_error_message:t('app.add_fail') //無法顯示後端錯誤時
        })
        this.clearMessageAndCloseModal()
      }
    }
  }

  clearStateData=()=>{
    let { t } = this.props
    this.setState({
      currencyOptions:[t('app.please_select')],
      currency: '',
      amount: '',
      remark: '',
    },()=>{setTimeout(() => {
      this.getOpenCurrencyList()
    }, 300)})
  }

  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
      state_error_message:'',
      state_success_message:'',
      showRedirectBtn:false,
    });
  };
  
  clearMessageAndCloseModal=()=>{
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
        showRedirectBtn:false,
      })
    }, 2000)
  }

  componentDidMount() {
    this.getOpenCurrencyList()
  }

  render() {
    let { t } = this.props;
    let { currencyOptions } = this.state;
    // console.log(this.props.i18n.language);
    // console.log(this.state.currency)
    // console.log(this.countConvertWalletAmount());
    // console.log(currencyOptions);
 
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <div className="card card-exchange">

            <div className="text-right">
              <Link to="/deposit/deposit-list"
                className="text-page-link">
                <MdRemoveRedEye/>
                <span className="ml-5">{t('app.see_list')}</span>
              </Link>
            </div>

              <div className="header text-center">
                <h4 className="title">{t('app.deposit_apply')}</h4>
              </div>

              <div className="content">
                <div className="form-horizontal">

                  {/* ----- 1.幣別 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.deposit_currency')}</label>
                    <div className="col-md-6">

                    {currencyOptions instanceof Array
                      && currencyOptions.length > 0 ?
                      <select
                        onChange={this.onChangeCurrency} 
                        className="table-select"
                      >
                        <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                          label={t('app.please_select')}>
                        </option> 
                        {currencyOptions.map((item,index) => 
                          <option key={index} value={item} label={item}>
                            {item}
                          </option>)
                        }
                      </select>
                      :
                      <select className="table-select">
                        <option key="" value=""  // 沒資料的話
                          label={t('app.no_options')}>
                        </option>
                      </select>
                    }

                    </div>
                  </div>

                  {/* ----- 2.數量 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.deposit_amount')}</label>
                    <div className="col-md-6">
                      <input
                        className="input-general"
                        type="text"
                        onChange={e=>this.onChangeAmount(e)}
                        value={this.state.amount}
                        maxLength={12}
                      />
                    </div>
                  </div>


                  {/* ----- 3.匯率 (HKD) ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">
                     {t('app.currency_rate')} (HKD)
                    </label>
                    <div className="col-md-6">
                      <div className="input-only-read">
                        {this.state.currency===""?
                          '' : this.state.toHKDRate/1
                        }
                      </div>
                    </div>
                  </div>

                  {/* ----- 4.轉換錢包數量 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">
                      {t('app.convert_wallet_amount')} (HKD)
                    </label>
                    <div className="col-md-6">
                      <div className="input-only-read">
                        {this.state.amount===""?
                          '':
                          <span>
                            {Format.thousandsToFix6(this.state.amount*this.state.toHKDRate)}
                          </span>
                          }
                      </div>
                    </div>
                  </div>

                  {/* ----- 5.備註 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.remark')}</label>
                    <div className="col-md-6">
                      <input
                        className="input-general"
                        type="text"
                        onChange={this.onChangeRemark}
                        value={this.state.remark}
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            this.submitPost()
                          }
                        }} 
                      />
                    </div>
                  </div>
                  
                  <br/>
                  {/* ----- 5.送出按鈕 ----- */}
                  <div className="form-group">
                    <label className="col-md-0"></label>
                    <div className="col-md-12">
                      <button 
                        type="button" 
                        className="card-submit-btn" 
                        onClick={this.state.isRepeatClickStop? '':this.submitPost}>
                        {t('app.submit')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={this.state.isShowResultModal} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body ">
              <span className="">
                {this.state.state_success_message}
              </span>
              <span className="text-red">
                {this.state.state_error_message}
              </span>
            </div>
            {this.state.showRedirectBtn?
              <div className="modal-footer">
                <button className="modal-action-button"
                  onClick={()=>window.location.href="/#/deposit/deposit-list"}>
                  <span className="btn-icon">
                    <GoArrowLeft/>{t('app.go')}
                  </span>
                </button>
                <button className="modal-action-button"
                  onClick={this.onCloseAllModal}>
                  {t('app.continue_to_add')}
                </button>
              </div>
              :''}
          </div>
        </Modal>

      </div>
    );
  }
}

export default withTranslation()(DepositApply);

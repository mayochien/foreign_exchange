import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// import styled from 'styled-components'
import { Input } from 'reactstrap';
import { apiGetBankerProfile, 
         apiPutBankerProfile, 
         apiResetPassword,
         apiPostSendVerifyEmail,
         apiPostSendVerifyPhone,
         apiPostVerifyPhoneCode
         } from '../../services/apiService';
import { ROLE_STATUS } from '../../const';
import ls from 'local-storage'
import Modal from "react-responsive-modal";
import { MdDone,MdClear } from "react-icons/md";
// import { ERRORCODE } from '../../const'
import { ClipLoader } from 'react-spinners';
import Format from '../../services/Format';   
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


class BankerProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileTab: '1',
      password: '',
      newPassword: '',
      checkedPassword: '',
      remark: '',
      editRemarkActive: false,
      remarkArea: false,
      isModify:false,
      nickname:'',
      email:'',
      phone:'',
      credit:'',
      amount:'',
      state_success_message:'',
      state_error_message:'',
      isShowResultModal:false,
      isEmailSent:false,
      loading: true,
      putData : {},
      isShowVerifyPhoneCodeModal:false,
      isPhoneSent:false,
      inputPhoneCode:'',
      country_code:'',
      putPhone:'',
      putCountyrCode:'',
    }
  }

  toggleProfileTab = tab => {
    if (this.state.profileTab !== tab) {
      this.showLoading()
      this.setState({
        profileTab: tab
      });
    }
  }

  onClickEdit = () => {
    this.setState({
      isModify:true
    })
  }
  
  clearMessageAndCloseModal = () => {
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
        isShowVerifyPhoneCodeModal:false,
        isModify:false,
      })
    }, 2000)
  }

  onCloseAllModal = () => {
    this.setState({ 
      state_error_message:'',
      state_success_message:'',
      isShowResultModal: false,
      isShowVerifyPhoneCodeModal:false,
      inputPhoneCode:'',
      isModify:false,

    });
  };

  showSubmitSuccess = () => {
    let {t} = this.props
    this.setState({
      state_success_message: t('app.change_success')
    })
    setTimeout(() => {
      this.setState({
        state_success_message: t('app.redirect_to_login_page')
      })
    }, 2000)
  }
  
  showLoading = () => {
    this.setState({
      showLoading:true,
    },()=> {
      setTimeout(() => {
        this.setState({
          showLoading:false,
        })
      }, 500);
    })
  }

  onClickEditCancel = () => {
    this.setState({
      isModify:false,
      nickname:this.props.bankerProfileData.nickname,
      email:this.props.bankerProfileData.email,
      phone:this.props.bankerProfileData.phone,
    })
  }

  onChange_nickname = (e) => {
    this.setState({
      nickname:e.target.value
    })
  }

  onChange_email = (e) => {
    this.setState({
      email: e.target.value
    },()=> {this.onMailBlur(this.state.email)})
  }

  onMailBlur = (key_email) => {
    let {t} = this.props
    const value = key_email;
    const regex = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    const pass = regex.test(value);
    if(!pass){
      this.setState({
        state_error_message: t('app.input_error')
      })
      // this.clearMessageAndCloseModal()
    }
    else{
      setTimeout(() => {
        this.setState({
          state_error_message: '',
        })
      }, 500);
    }
  }

  onChange_phone = (e) => {
    let regex = /^(\(?\+?[0-9]*\?)?[0-9_]*$/
    let value = e.target.value
    if (!(regex.test(value) || value === '')) 
    return false
    this.setState({
      phone:e.target.value
    },()=> {console.log(this.state.phone)})
  }
  
  // ******************** 發送Email驗證信 ↓ ********************
  onClickEmailVerify = async() => {
    let {t} = this.props
    let postData ={
      email:this.props.bankerProfileData.email
    }
    try {
      let res = await apiPostSendVerifyEmail(postData)
      // console.log(res.data)
      if(res.data.code===1){
        console.log('寄送驗證信')
        this.setState({
          isEmailSent:true,
          isShowResultModal:true,
          state_success_message: t('app.has_send') +" "+ t('app.please_check_your_mailbox')
        })
        this.clearMessageAndCloseModal()
      }
      // else if(res.data.code===404) {
      //   console.log('短時間發送:',res.data.code)
      //   this.setState({
      //     isShowResultModal:true,
      //     state_error_message:t('app.please_check_your_mailbox') 
      //   })
      //   this.clearMessageAndCloseModal()
      // }
    } catch(err) {
      console.log(err);
    }
  }
  getKeyDownCountryCode = (e,value) => {
    console.log(e.target.value)
    console.log(value)
  }

  onClickCountryCod = (e) => {
    console.log(e.target);
  }

  // ******************** 更改國碼 ↓ ********************
  onChangeCountryCode = (value,data) => {
    // console.log(value);
    // console.log(data.countryCode);
    this.setState({
      phone: value,
      country_code:data.countryCode
    }
    // ,()=> {console.log(this.state.country_code.toUpperCase())}
    )
  }

  // ******************** 發送手機驗證簡訊 ↓ ********************
  sendPhoneVerify = async() => {
    let {t} = this.props
    let postData ={
      phone:this.props.bankerProfileData.phone
    }
    console.log(postData);
    try {
      let res = await apiPostSendVerifyPhone(postData)
      console.log(res.data)
      if(res.data.code===1){
        console.log('寄送簡訊')
        this.setState({
          isPhoneSent:true,
          isShowResultModal:true,
          state_success_message: t('app.has_send') +" "+ t('app.please_check_your_phone')
        }
        ,() => {
          setTimeout(() => {  // 接著顯示驗證碼的輸入框
            this.setState({
              isShowVerifyPhoneCodeModal:true,
              state_success_message:''
              })
            }, 2500);
          }
        )
      }
      // else if(res.data.code===404) {
      //   console.log('短時間發送:',res.data.code)
      //   this.setState({
      //     isShowResultModal:true,
      //     state_error_message:t('app.please_check_your_mailbox') 
      //   })
      //   this.clearMessageAndCloseModal()
      // }
    } catch(err) {
      console.log(err);
    }
  }

  // ******************** 輸入簡訊驗證碼 ↓ ********************
  verifyPhoneCode = async() => {
    let {t} = this.props
    let postData ={
      code:this.state.inputPhoneCode
    }
    console.log(postData);
    try {
      let res = await apiPostVerifyPhoneCode(postData)
      console.log(res.data)
      if(res.data.code===1){
        this.setState({
          isPhoneSent:true,
          // isShowResultModal:true,
          state_success_message: t('app.verification_succeeded')
        })
        setTimeout(() => {
          this.getInitialData()
        }, 2000);
        this.clearMessageAndCloseModal()
      }
      // else if(res.data.code===402) {
      //   console.log('驗證碼錯誤::',res.data.code)
      //   this.setState({
      //     isShowResultModal:true,
      //     state_error_message:t('app.verification_code_error') 
      //   })
      //   this.clearMessageAndCloseModal()
      // }
    } catch(err) {
      console.log(err);
    }
  }

  // 檢查要送出的電話
  checkPhone = () => {
    // if(this.state.phone==='+'){ //
    //   // console.log('砍掉 套件預設的 + 符號');
    //   this.setState({
    //     putPhone:''
    //   })
    // }
    if(this.state.phone.length<7){ 
      // console.log('// 避免 沒填手機，但套件預設帶入的國碼，被塞進資料庫');
      this.setState({
        putPhone:''
      })
    }
    else{
      // console.log('取得的號碼要先移除空格 、 移除"-');
      this.setState({
        putPhone:this.state.phone.replace(/\s-*/g,"")
      })
    }
  }

  // 檢查要送出的國碼
  checkCountyrCode = () => {
    // if(typeof(this.state.country_code)==='string'&& this.state.phone.length>6){ 
      // console.log('// 避免country_code 未知型別先被轉為大寫');
      this.setState({
        putCountyrCode:this.state.country_code.toUpperCase()
      })
    // }
    // else{
    //   // console.log('國碼正確');
    //   this.setState({
    //     putCountyrCode:''
    //   })
    // }
  }

  // ******************** put 修改【基本資料】 ↓ ********************
  handlePutData = () => {
    // console.log(this.state.country_code);
    this.checkPhone()
    this.checkCountyrCode()
    setTimeout(() => {
      // console.log(this.state.putPhone);
        this.setState({
          putData : {
            nickname:this.state.nickname,
            email:this.state.email,
            phone:this.state.putPhone,
            country_code:this.state.putCountyrCode
          }
        },()=> {this.putSaveData()}) 
    }, 100);
  }

  // 經由上方判斷後，才進行put
  putSaveData = async() => {
    console.log('putData:',this.state.putData);
    try {
      let res = await apiPutBankerProfile(this.state.putData);
      if(res.data.code===1){
        this.showLoading()
        const bankerProfileData = res.data.data
        this.props.saveBankerProfile(bankerProfileData);
        this.setState({
          isModify:false
        })
      }
    } catch(err) {
      console.log(err);
    }
    this.getInitialData()
  }

  
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ Tab-2 修改密碼 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  onPasswordChange = e => {
    let regex = /^[A-Za-z0-9]+$/
    let value = e.target.value
    if (!(regex.test(value) || value === '')) return false
    this.setState({
      password: e.target.value
    })
  }

  onNewPasswordChange = e => {
    let regex = /^[A-Za-z0-9]+$/
    let value = e.target.value
    if (!(regex.test(value) || value === '')) return false
    this.setState({
      newPassword: e.target.value
    })
  }

  onCheckedPasswordChange = e => {
    let regex = /^[A-Za-z0-9]+$/
    let value = e.target.value
    if (!(regex.test(value) || value === '')) return false
    this.setState({
      checkedPassword: e.target.value
    })
  }
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ Tab-2 修改密碼 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  
  // ******************** api:post 修改密碼 ********************
  submitPassword = async() => {
    const { password, newPassword, checkedPassword } = this.state;
    let {t} = this.props

    if(password === '' || newPassword === '' || checkedPassword === '') {
      this.setState({
        isShowResultModal:true,
        state_error_message:t('app.please_check_required_fields')
      })
      this.clearMessageAndCloseModal()
    }
    else if(newPassword !== checkedPassword){
      this.setState({
        isShowResultModal:true,
        state_error_message:t('app.please_confirm_password_again')
      })
      this.clearMessageAndCloseModal()
    }
    else{
      let putData = {
        password: password,
        new_password: newPassword,
        check_password: checkedPassword
      }
      console.log('putData:',putData)
      try {
        let res = await apiResetPassword(putData);
        if(res.data.code === 1){
          this.setState({ 
            isShowResultModal:true,
          })
          this.showSubmitSuccess()
          setTimeout(() => {
            ls.clear()
            window.location.reload()
          }, 3500);
        }
        else{
          console.log('後端錯誤訊息:',res.data.code)
          // this.setState({
          //   isShowResultModal:true,
          //   state_error_message:t(ERRORCODE[res.data.code]) 
          // })
          // this.clearMessageAndCloseModal()
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  // ******************** 修改密碼 ↑↑ ********************

  getInitialData = async() => { // 初始載入
    this.showLoading()
    try {
      let res = await apiGetBankerProfile()
      // console.log('api get',res.data.data)
      if(res.data.code===1){
        const bankerProfileData = res.data.data
        this.props.saveBankerProfile(bankerProfileData);
        this.setState({ 
          nickname: bankerProfileData.nickname,
          email: bankerProfileData.email,
          phone: bankerProfileData.phone,
          country_code: bankerProfileData.country_code,
          state_success_message:'',
          state_error_message:'',
        })
      }
    } catch(err) {
      this.props.clearBankerProfile();
    }
  }
  

  componentDidMount() {
    this.getInitialData()
    this.onCloseAllModal()
    if(this.state.isModify===true){ //編輯時不要刷新
      this.refresCredit = setInterval(()=> {
        this.getInitialData()
        console.log('刷新-額度',new Date().getMinutes(),':',new Date().getSeconds())
      },6000)
    }
  }

  componentWillUnmount(){
    clearInterval(this.refresCredit);
  }


  render() {
    const { t, bankerProfileData } = this.props;
    const { password, newPassword, checkedPassword } = this.state;

    return (
      <div className="container-fluid container-fluid-profile">
        <div className="row">

          <div className="profile-header col-md-11">
            <button className={this.state.profileTab ==='1'?"header-btn btn-active":"header-btn"}
              onClick={() => { this.toggleProfileTab('1');}}>
              {t('app.profile')}
            </button>
            <button className={this.state.profileTab === '2'?"header-btn btn-active":"header-btn"}
              onClick={()=> { this.toggleProfileTab('2');}}>
              {t('app.revisedPassword')}
            </button>
          </div>
     
          {this.state.profileTab === '1' &&
            <div className="card card-exchange col-md-11 card-profile">
              <div className="header ">
                {/* <h4 className="title text-center">{t('app.profile')}
                </h4> */}
              </div>
              {this.state.showLoading?
                <div className="content">
                  <div className="form-horizontal col-md12 text-center m-tb-190">
                      <ClipLoader
                        sizeUnit={"px"}
                        size={40}
                        color={'#999'}
                        loading={this.state.loading}
                      />
                    </div>
                </div>
                :
                <div className="content">
                  {bankerProfileData === null || bankerProfileData === undefined ?
                    <div className="form-horizontal text-center m-tb-190">
                      <div className="form-group">
                        <label className="col-md-12 text-center">
                          {t('app.no_data')}
                        </label>
                      </div>
                    </div>
                    :
                    <div className="form-horizontal form-profile"><br/>

                      {/* ********** 帳號 ********** */}
                      <div className="form-group mb-22">
                        <label className="col-md-4 label-exchange">{t('app.account')}</label>
                        <div className="col-md-5">
                          <input 
                            className="input-only-read"
                            value={bankerProfileData.username}/>
                        </div>
                      </div>

                      {/* ********** 身份 ********** */}
                      <div className="form-group mb-20">
                        <label className="col-md-4 label-exchange">{t('app.role')}</label>
                        <div className="col-md-5">
                          <input 
                            className="input-only-read"
                            value={t(ROLE_STATUS[bankerProfileData.role])} />
                        </div>
                      </div>

                      {/* ********** 暱稱 ********** */}
                      <div className="form-group mb-20">
                        <label className="col-md-4 label-exchange">
                          {t('app.nickname')}
                        </label>
                        <div className="col-md-5">
                          {this.state.isModify?
                            <input
                              className=""
                              type="text"
                              name="nickname"
                              onChange={this.onChange_nickname}
                              value={this.state.nickname}
                              autoComplete="off"
                              // placeholder={bankerProfileData.nickname}
                            />
                            :
                            <input 
                              className="input-only-read"
                              value={bankerProfileData.nickname} 
                            />
                            }
                        </div>
                      </div>

                      {/* ********** Eamil ********** */}
                      <div className="form-group mb-0">
                        <label className="col-md-4 label-exchange">
                          {t('app.email')}
                        </label>
                        <div className="col-md-5">
                          {this.state.isModify ?
                          // && bankerProfileData.is_email_verified===false? //沒驗證過才能修改
                            <input 
                              className=""
                              type="text"
                              name="email"
                              onChange={this.onChange_email}
                              // onBlur={e=>this.onMailBlur(e)}
                              value={this.state.email}
                              autoComplete="off"
                              // placeholder={bankerProfileData.email}
                            />
                            :
                            <input 
                              className="input-only-read"
                              value={bankerProfileData.email}/>
                            }
                        </div>
                      </div>

                      {/* ********** 發送Email驗證按鈕 ********** */}
                      <div className="form-group mb-20 form-group-verify-action-section">
                      <label className="col-md-4 label-exchange verify-action-label"></label>
                        <div className="col-md-5">
                          {bankerProfileData.is_email_verified?
                            <div className="text-green font-12">
                              <MdDone/> {t('app.has_verified')}
                            </div>
                            :
                            <span className="verify-action-box">
                              {/* <MdClear/> */}
                              {t('app.unverified')}
                              {this.state.isEmailSent?
                                  // 已發送過Email驗證
                                <button 
                                  className="profile-btn-verify-readonly">
                                  {t('app.has_send')}
                                </button>
                              :
                                  // 發送Email驗證
                                <button  onClick={this.state.isModify?"":this.onClickEmailVerify}
                                  className={this.state.isModify || this.state.email===''||this.state.email===null?
                                  "profile-btn-verify-readonly":"profile-btn-verify"}>
                                  {t('app.send_verification')}
                                </button>
                              }
                            </span>
                          }
                        </div>
                      </div> 

                      {/* ********** 手機 ********** */}
                      <div className="form-group mb-0">
                        <label className="col-md-4 label-exchange">
                          {t('app.mobile')}
                        </label>
                        <div className="col-md-5">
                          {this.state.isModify?
                            <PhoneInput
                              inputClass="form-control-edit" //再更內層的input樣式class
                              buttonClass="flag-dropdown-edit"
                              country={'my'}
                              value={this.state.phone}
                              onChange={this.onChangeCountryCode}
              
                            />
                            :
                            <PhoneInput
                              inputClass="form-control-disable" //再更內層的input樣式class
                              buttonClass="flag-dropdown-disable"
                              value={bankerProfileData.phone}
                              // value={this.state.phone}
                              country={'my'}
                              disabled={true}
                            />
                          }
                        </div>
                      </div>


                      {/* ********** 發送手機簡訊驗證按鈕 ********** */}
                      <div className="form-group mb-20 form-group-verify-action-section">
                        <label className="col-md-4 label-exchange verify-action-label"></label>
                        <div className="col-md-5">
                          {bankerProfileData.is_phone_verified?
                            // ▅▅▅▅▅▅▅▅▅▅ 已驗證 ↓ ▅▅▅▅▅▅▅▅▅▅
                            <div className="text-green font-12">
                              <MdDone/> {t('app.has_verified')}
                            </div>
                            :
                            // ▅▅▅▅▅▅▅▅▅▅ 還沒驗證完成 ↓ ▅▅▅▅▅▅▅▅▅▅
                            <span className="verify-action-box">
                              {/* <MdClear/> */}
                              {t('app.unverified')}
                              {this.state.isPhoneSent?
                                // ▂▂▂▂▂▂▂▂ 已經寄出的狀態 ↓ ▂▂▂▂▂▂▂▂
                                <React.Fragment>
                                  <button 
                                    className="profile-btn-verify"
                                    onClick={()=>this.setState({isShowVerifyPhoneCodeModal:true})}
                                    >
                                    {t('app.enter_verification_code')}
                                  </button>
                                </React.Fragment>
                                :
                                // ▂▂▂▂▂▂▂▂ 還沒寄出的狀態 ↓ ▂▂▂▂▂▂▂▂
                                <React.Fragment>
                                  <button  onClick={this.state.isModify?"":this.sendPhoneVerify}
                                    className={this.state.isModify || this.state.phone===''||this.state.phone.length<7?
                                    "profile-btn-verify-readonly":"profile-btn-verify"}
                                  >
                                    {t('app.send_verification')}
                                  </button>
                                  <button 
                                    className={this.state.isModify || this.state.phone===''||this.state.phone.length<7?
                                    "profile-btn-verify-readonly":"profile-btn-verify"}
                                    onClick={()=>this.setState({isShowVerifyPhoneCodeModal:true})}
                                    >
                                    {t('app.enter_verification_code')}
                                  </button>
                                </React.Fragment>
                              }
                            </span>
                          }
                        </div>
                      </div>

                      {/* ********** 額度 ********** */}
                      {/* <div className="form-group mb-20">
                        <label className="col-md-4 label-exchange">{t('app.credit_limit')}</label>
                        <div className="col-md-5">
                          <input 
                            className="input-only-read"
                            value={Format.thousandsMathRound3(bankerProfileData.credit)}/>
                        </div>
                      </div> */}

                      {/* ********** 押金 ********** */}
                      <div className="form-group mb-20">
                        <label className="col-md-4 label-exchange">{t('app.amount_limit')}</label>
                        <div className="col-md-5">
                          <input 
                            className="input-only-read"
                            value={Format.thousandsMathRound3(bankerProfileData.amount)} />
                        </div>
                      </div>

                      {/* ********** 錯誤訊息 ********** */}
                      <div className="col-md-12 text-red text-center mb-10">
                        {this.state.state_error_message}
                      </div>
                    
                      <br/>

                      {this.state.isModify?
                        <div className="form-group mb-20">
                          <div className="col-md-12">
                            <button className="card-submit-btn"
                              onClick={this.onClickEditCancel}>
                              <MdClear/> {t('app.cancel')}
                            </button>
                            <button className="card-submit-btn ml-10"
                              onClick={this.handlePutData}>
                              <MdDone/> {t('app.save')}
                            </button>
                          </div>
                        </div>
                        :
                        <div className="form-group mb-20">
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="card-submit-btn"
                            onClick={this.onClickEdit}
                          >
                            {t('app.edit')}
                          </button>
                        </div>
                      </div>
                    }
                    </div>
                  }
                </div>}
              </div>
            }
        
            {/* ▇▇▇▇▇▇▇▇▇▇ tab-2 修改密碼 ▇▇▇▇▇▇▇▇▇▇ */}
            {this.state.profileTab === '2' &&
              <div className="card card-exchange col-md-10 card-profile">

                <div className="header ">
                  {/* <h4 className="title text-center">{t('app.revisedPassword')} </h4> */}
                </div>
                {this.state.showLoading?
                  <div className="content">
                    <div className="form-horizontal col-md12 text-center m-tb-60">
                        <ClipLoader
                          sizeUnit={"px"}
                          size={40}
                          color={'#999'}
                          loading={this.state.loading}
                        />
                      </div>
                  </div>
                  :
                  <div className="content">
                    {bankerProfileData === null || bankerProfileData === undefined ?
                      <div className="form-horizontal text-center m-tb-60">
                        <div className="form-group">
                          <label className="col-md-12 text-center">
                            {t('app.no_data')}
                          </label>
                        </div>
                      </div>
                      :
                      <div className="form-horizontal"><br/>

                        <div className="form-group mb-20">
                          <label className="col-md-4 label-exchange">
                            {t('app.current_password')}
                          </label>
                          <div className="col-md-5">
                            <Input 
                            type="password"
                            value={password} 
                            onChange={this.onPasswordChange}
                            maxLength="20"
                            />
                          </div>
                        </div>

                        <div className="form-group mb-20">
                          <label className="col-md-4 label-exchange">
                            {t('app.new_password')}
                          </label>
                          <div className="col-md-5">
                            <Input 
                            type="password"
                            value={newPassword} 
                            onChange={this.onNewPasswordChange}
                            maxLength="20"
                            />
                          </div>
                        </div>

                        <div className="form-group mb-20">
                          <label className="col-md-4 label-exchange">
                            {t('app.confirm_new_password')}
                          </label>
                          <div className="col-md-5">
                            <Input 
                            type="password"
                            value={checkedPassword} 
                            onChange={this.onCheckedPasswordChange}
                            maxLength="20"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPassword()
                              }
                            }} 
                            />
                          </div>
                        </div>

                        <br/>

                        <div className="form-group">
                          <div className="col-md-12">
                            <button
                              type="button"
                              className="card-submit-btn"
                              onClick={this.submitPassword}
                            >
                              {t('app.submit')}
                            </button>
                          </div>
                        </div>

                      </div>
                    }
                  </div>
                }
              </div>
            }
          
        </div>

        <Modal open={this.state.isShowResultModal} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body ">
              <span className="text-red">
                {this.state.state_error_message}
              </span>
              <span className="text-green">
                {this.state.state_success_message}
              </span>
            </div>
          </div>
        </Modal>

        {/* 手機驗證碼輸入框 */}
        <Modal open={this.state.isShowVerifyPhoneCodeModal} 
          onClose={this.onCloseAllModal} closeIconSize={18} >
          <div className="modal-inside modal-phone-verify">
            <h5>{t('app.please_enter_the_message_verification_code')}</h5>
            {/* {console.log(this.state.inputPhoneCode)} */}
            <div className="modal-body ">
              <input className="phone-verify-input"
                value={this.state.inputPhoneCode}
                onChange={(e)=> {this.setState({inputPhoneCode:e.target.value})}}
                maxLength={8}
              >
              </input>
            </div>

            <div className="text-center">
              <span className="text-red">
                {this.state.state_error_message}
              </span>
              <span className="text-green">
                {this.state.state_success_message}
              </span>
            </div>

            <div className="modal-footer">
              {/* <button className="modal-action-button" onClick={this.onCloseAllModal}>
                {t('app.close')}
              </button> */}
              <button className="modal-action-button" onClick={this.verifyPhoneCode}>
                {t('app.verify')}
              </button>
            </div>

          </div>
        </Modal>

      </div>
    )
  }
}

export default withTranslation()(BankerProfile);


// const div = styled.div`
//   display: flex;
//   align-items: center;
// `
// const RevisedBtnWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   flex-direction: row;
// `
// const RevisedBtn = styled.button`
//   width: 150px;
//   height: 39px;
//   color: #fff;
//   background-color: #800e029c;
//   font-size: 14px;
//   font-weight: bold;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   -webkit-appearance: none;
//   border: none;
//   outline: none;
//   border-radius: 5px;
//   padding: 10px;
//   margin-bottom: 15px;
//   border: 1px solid #8c372e;
// `
// const EditBtn = styled.button`
//   width: 45px;
//   color: #fff;
//   background-color: transparent;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   -webkit-appearance: none;
//   border: none;
//   outline: none;
//   margin-left: 10px;
// `
// ;

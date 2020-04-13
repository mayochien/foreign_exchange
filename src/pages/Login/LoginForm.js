import React from 'react';
import {apiUserLogin} from '../../services/apiService'
import { css } from '@emotion/core';
import { PropagateLoader } from 'react-spinners';
import { withTranslation } from 'react-i18next';
import { ERRORCODE } from '../../const'
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
import store  from '../../store';
import ls from 'local-storage';
import { FiAlertCircle } from "react-icons/fi";
import i18n from '../../i18n';
import { IoIosWarning } from "react-icons/io";


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginSuccessMessage:'',
      loginErrMessage:'',
      loading: false,
      showLogoutErrMsg: false,
      errMsg: '',
    }
  }

  onChangeUsername = (e) => {
    let regex = /^[\u0391-\u9fa5_a-zA-Z0-9]+$/ //只能輸入中文、英文、數字 
    let value = e.target.value
    if (!(regex.test(value) || value === '')) 
    return false
    this.setState({
      username: e.target.value
    })
  }

  onChangePassword = (e) => {
    let regex = /^[A-Za-z0-9]+$/
    let value = e.target.value
    if (!(regex.test(value) || value === '')) 
    return false
    this.setState({
      password: e.target.value
    })
  }

  showSuccessMessage =()=>{ // 登入成功 => 顯示成功訊息
    let {t} = this.props
    this.setState({
      loginSuccessMessage: t('app.login') + t('app.success') //"登入成功"
    })
    setTimeout(() => {
      this.setState({
        loginSuccessMessage: t('app.redirect_to_homepage') //"即將跳轉至首頁"
      })
    }, 400)
  }

  showErrorRedBorder =(username,password)=>{ //帳號密碼空值時 => 顯示紅色框線
    if (username === ''){
      this.setState({
        usernameShowRedBorder: true
      }, () => {
        setTimeout(() => {
          this.setState({
            usernameShowRedBorder: false
          })
        }, 800)
      })
      return false
    }
    else if(password === ''){
      this.setState({
        passwordShowRedBorder: true
      }, () => {
        setTimeout(() => {
          this.setState({
            passwordShowRedBorder: false
          })
        }, 800)
      })
      return false
    }
  }

  closeErrorMsgForLogout = () => { //被登出的談窗
    this.setState({
      showLogoutErrMsg: false
    })
    ls.set('errCode', '')
  }
  
  clearErrMessage3000s = () => {  //底部的顯示文字
    setTimeout(() => {
      this.setState({
        loginErrMessage: '',
        loading:false
      })
    }, 3000)
  }

  doLogin = async() => {
    let {username, password} = this.state
    let {t} = this.props
    if(username !== '' && password !== ''){
      if(username.length<6){
        this.setState({
          loginErrMessage: t('ERRORCODE.GREATER_THAN_6_LESS_THAN_30_11')
        },()=>{this.clearErrMessage3000s()})
      }
      else{
        try {
          let res = await apiUserLogin(username, password)
          if(res.data.code===1){ //登入成功
            this.showSuccessMessage()
            this.setState({
              loading:true,
            })
            let postLoginData = res.data.data
            let user = {}
            user['user'] = {...postLoginData}
            this.props.actions.login(user)
          }
          else { // 登入失敗【1】res.data.code 不等於 1
            console.log('登入錯誤01');
            this.setState({
              loginErrMessage: t(ERRORCODE[res.data.code]),
               loading:false
              },()=>{this.clearErrMessage3000s()})  
          }

        } catch (err) { // 登入失敗【2】api 沒有回應
          console.log('錯誤位置 : try 以外的 catch ')
          let apiErrCode = store.getState().BankerProfile.errCode
          if(apiErrCode==='' || apiErrCode===null || apiErrCode===undefined ){
            this.setState({loginErrMessage: t('ERRORCODE.BASE_ERROR_2')
            },()=>{this.clearErrMessage3000s()})
          }
        }
      }
      
    }
    else if (username==='' || username===null) {
      this.showErrorRedBorder(username,password)
      this.setState({loading:false})
    }
    else if (password==='' || password===null) {
      this.showErrorRedBorder(username,password)
      this.setState({loading:false})
    }
  };


  componentDidMount = () => {
    if(ls.get('errCode') !== null && ls.get('errCode') !== ''){
      let lsErrCode = ls.get('errCode').errCode

      this.setState({
        showLogoutErrMsg: true,
        errMsg: i18n.t(ERRORCODE[lsErrCode])
      })
    }
  }


  render() {
      const {t} =this.props;
      let { usernameShowRedBorder, passwordShowRedBorder, showLogoutErrMsg, errMsg} = this.state
      let usernameShowRedBorderStyle = usernameShowRedBorder ? {border: "2px solid #C22"} : {border: "1.5px solid rgba(255, 255, 255, 0.8)"}
      let passwordShowRedBorderStyle = passwordShowRedBorder ? {border: "2px solid #C22"} : {border: "1.5px solid rgba(255, 255, 255, 0.8)"}
      const override = css`
        display: block;
        margin: 35px;
      `;


      return (
        <div className="login-page">
          <div className="gradient"></div>
            <div className="login-container">

              <div className="login-box">
                <div className="login-box-section" >
              
                  {/* ********** input:帳號 ********** */}
                  <div className="form-group">
                    <input 
                      type="text"
                      className="form-control"
                      id="Email"
                      onFocus={()=>{this.placeholder = ''}}
                      onBlur={()=>{this.placeholder = 'Username'}}
                      placeholder="username"
                      autoComplete="off"
                      onChange={(e) => {
                        this.onChangeUsername(e)
                      }} 
                      value={this.state.username}
                      style={usernameShowRedBorderStyle}
                      maxLength="30"
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          this.doLogin()
                        }
                      }}
                    />
                  </div>
              
                  {/* ********** input:密碼 ********** */}
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="password"
                      id="Password"
                      autoComplete="off"
                      onFocus={()=>{this.placeholder = ''}}
                      onBlur={()=>{this.placeholder = 'Password'}}
                      onChange={(e) => {
                        this.onChangePassword(e)
                      }}
                      value={this.state.password}
                      style={passwordShowRedBorderStyle}
                      maxLength="30"
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          this.doLogin()
                        }
                      }}
                    />
                  </div>

                  {/* ********** 登入按鈕 ********** */}
                  <button type="button" id="Login" 
                    className="btn" onClick={this.doLogin}>
                    {t('app.login')}
                  </button>

                  <div className="text-center">
                    {this.state.loading?
                      ''
                      :
                      <div>
                        <Link to="/user/send-reset-email">
                          {t('app.forgot_password')}
                        </Link>
                        <br/>
                      </div>
                      }
                  </div>

                  <div className="error-text-box  mt-10" >
                    <span className="text-white" >
                      {this.state.loginSuccessMessage}
                    </span>
                    <span className="text-red-dark font-bold d-flex">
                      {this.state.loginErrMessage!==''? <IoIosWarning/> : ''} {this.state.loginErrMessage}
                    </span> 
                  </div>

                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div className='sweet-loading'>
                      <PropagateLoader
                        css={override}
                        sizeUnit={"px"}
                        size={15}
                        color={'rgba(230, 243, 255, 0.44)'}
                        loading={this.state.loading}
                      />
                    </div>
                  </div>

              </div>
            </div>
          </div>
            {/* 顯示錯誤訊息*/}
            <Modal
              open={showLogoutErrMsg === true}
              closeIconSize={0}
            >
              <div className="modal-inside">
                <div className="warining-icon-section text-center">
                  <FiAlertCircle className="FiAlertCircle" />
                </div>
                <div className="modal-body">
                  {errMsg}
                </div>
                <div className="modal-footer-mini">
                <button className="modal-action-button" onClick={this.closeErrorMsgForLogout}>
                  {t('app.close')}
                </button>
                </div>
              </div>
            </Modal>
        </div>
      )
  }
}

export default withTranslation()(LoginForm);
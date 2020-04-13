import React from 'react';
import { apiPostRestPassword, 
        } from '../../services/apiService'
import { withTranslation } from 'react-i18next';
// import { ERRORCODE } from '../../const'
// import { Link } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";

class ResetPassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newPassword: '',
        checkPassword: '',
        state_error_message:'',
        state_success_message:'',
        changeSuccess:false,
      }
    }

    onChangeNewPassword = (e) => {
      let regex = /^[A-Za-z0-9]+$/
      let value = e.target.value
      if (!(regex.test(value) || value === '')) return false
      this.setState({
        newPassword: e.target.value
      })
    }
    
    onChangeCheckPassword = (e) => {
      let regex = /^[A-Za-z0-9]+$/
      let value = e.target.value
      if (!(regex.test(value) || value === '')) return false
      this.setState({
        checkPassword: e.target.value
      })
    }

    clearMessage=()=>{
      setTimeout(() => {
        this.setState({
          state_error_message:'',
          state_success_message:'',
        })
      }, 2000)
    }

    showSubmitSuccess = () =>{
      let {t} = this.props
      this.setState({
        state_success_message: t('app.change_success') //更改成功
      })
      setTimeout(() => { //即將跳傳至首頁
        this.setState({
          state_success_message: t('app.redirect_to_login_page')
        })
      }, 2000)
    }


    submitPost = async() => {
      let { newPassword, checkPassword } = this.state;
      let {t} = this.props
      //原始網址 www.banker.dcedex.com/forgetPassword/xxxxxx 
      // 必須擷取 "forgetPassword/" 後的token字串 ↓
      let originLink = window.location.href
      let where_forgetPassword = originLink.indexOf('d/') 
      let link_token = originLink.substring(where_forgetPassword+2)
      let link_token_deleteFinal2Words = link_token.substring(0,link_token.length-2)

      console.log(link_token_deleteFinal2Words);

      if( newPassword === '' || checkPassword === '' || originLink==='') {
        this.setState({
          state_error_message:t('app.please_check_required_fields')
        })
        this.clearMessage()
      }
      else{
        let putData = {
          token: link_token_deleteFinal2Words,
          new_password: newPassword,
          check_password: checkPassword
        }
        try {
          let res = await apiPostRestPassword(putData);
          console.log('進入api put:',putData)
          if(res.data.code === 1){
            this.setState({
              changeSuccess:true,
              state_error_message:''
            })
            this.showSubmitSuccess()
            setTimeout(() => {
              window.location.assign('/login') //跳轉至登入頁
            }, 3500);
          }
          else{
            // console.log('後端錯誤訊息:',res.data.code)
            // this.setState({
            //   state_error_message: t(ERRORCODE[res.data.code]),
            // })
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

  backToLogin = () => {
      window.location.href = '/login'
  }


    render() {
        const {t} =this.props;

        return (
          <div className="login-page">
            <div className="gradient"></div>
              <div className="login-container text-center">

                <div className="login-box">

                  <div className="login-head-info">
                    {this.state.state_hasClickSend?""
                      :
                      <div className="back-to-login-section">
                        <TiArrowBack/>
                        <button style={{backgroundColor: 'rgba(52, 52, 52, 0.0)'}} onClick={this.backToLogin}>{t('app.back_to_login')}</button> <br/>
                      </div>
                    }
                  </div>

                  <div className="login-box-section" >

                  <div className="form-group text-center title">
                  <span>{t('app.reset_password')}</span>
                  </div>

                  {/* ********** input:新密碼 ********** */}
                  <div className="form-group">
                    <input 
                      type="password"
                      className="form-control"
                      id="Email"
                      onFocus={()=>{this.placeholder = ''}}
                      onBlur={()=>{this.placeholder = 'NewPassword'}}
                      placeholder="New password"
                      autoComplete="off"
                      onChange={(e) => {
                        this.onChangeNewPassword(e)
                      }} 
                      value={this.state.newPassword}
                    />
                  </div>

                  {/* ********** input:確認新密碼 ********** */}
                  <div className="form-group">
                    <input 
                      type="password"
                      className="form-control"
                      id="Email"
                      onFocus={()=>{this.placeholder = ''}}
                      onBlur={()=>{this.placeholder = 'checkPassword'}}
                      placeholder="Confirm password"
                      autoComplete="off"
                      onChange={(e) => {
                        this.onChangeCheckPassword(e)
                      }} 
                      value={this.state.checkPassword}
                    />
                  </div>
                  
                  {/* ********** 送出按鈕 ********** */}
                  {this.state.changeSuccess? ""
                   :
                    <button type="button" id="Login" 
                      className="btn" onClick={this.submitPost}>
                      {t('app.submit')}
                    </button>
                  }

                  <div className="error-text-box" >
                    <span className="text-white" >
                      {this.state.state_success_message}
                    </span>
                    {this.state.state_error_message!==''? 
                    <i className="pe-7s-attention" /> : ''}
                    <span className="text-red" >
                      {this.state.state_error_message}
                    </span> 
                  </div>

                </div>
              </div>

            </div>
          </div>
        )
    }
}

export default withTranslation()(ResetPassword);
import React from 'react';
import {apiPostSendForgetEmail} from '../../services/apiService'
// import { css } from '@emotion/core';
// import { PropagateLoader } from 'react-spinners';
import { withTranslation } from 'react-i18next';
import { ERRORCODE } from '../../const'
import { Link } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";
// import { set } from 'gl-matrix/src/gl-matrix/quat';

class SendResetEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      state_success_message:'',
      state_error_message:'',
      state_hasClickSend:false
    }
  }

  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    },()=>{this.onMailBlur(this.state.email)})
  }

  onMailBlur = (key_email) => {
    let {t} = this.props
    const value = key_email;
    const regex = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    const pass = regex.test(value);
    if(!pass){
      this.setState({
        state_error_message: t('app.input_error'),
      })
    }
    else{
      setTimeout(() => {
        this.setState({
          state_error_message: '',
        })
      }, 200);
    }
  }


  showSuccessMessage = () => { // 成功 => 顯示成功訊息
    let {t} = this.props
    this.setState({
      state_success_message:  t('app.has_send') //"已發送"
    })
    setTimeout(() => {
      this.setState({
        state_success_message: t('app.please_check_your_mailbox') //請至信箱收信
      })
    }, 2000)
  }

  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        state_success_message:'',
        state_error_message:''
      })
    }, 2000);
  }

  submitPost = async() => {
    let {t} = this.props
    let postData = {
      email:this.state.email
    }
    if(this.state.email==='' || this.state.email===undefined){
      this.setState({
        state_error_message: t('app.please_check_required_fields'),
      })
      this.clearMessage()
    }
    else{
      try {
        let res = await apiPostSendForgetEmail(postData)
        console.log('postData:',postData)
        if(res.data.code===1){ 
          this.showSuccessMessage()
          this.setState({
            state_hasClickSend:true
          })
        }
        else{
          console.log('後端錯誤訊息:',res.data.code,t(ERRORCODE[res.data.code]))
          this.setState({
            state_error_message:t(ERRORCODE[res.data.code])
          })
          this.clearMessage()
        }
      } catch (err) {
        console.log(err)
      }
    }
  }


  render() {
    const {t} =this.props;

    return (
      <div className="login-page">
        <div className="gradient"></div>
          <div className="login-container">

            <div className="login-box">

              <div className="login-head-info">
                {this.state.state_hasClickSend?""
                  :
                  <div className="back-to-login-section">
                    <TiArrowBack/>
                    <Link to="/login">{t('app.back_to_login')}</Link> <br/>
                  </div>
                }
              </div>
            
              <div className="login-box-section" >

                <div className="form-group text-center title">
                  <span>{t('app.send_verification')}</span>
                </div>

                {/* ********** input:email ********** */}
                <div className="form-group">
                  <input 
                    type="text"
                    className="form-control"
                    id="Email"
                    onFocus={()=>{this.placeholder = ''}}
                    // onBlur={()=>{this.placeholder = 'Email'}}
                    // onBlur={e=>this.onMailBlur(e)}
                    placeholder="Email"
                    autoComplete="off"
                    onChange={this.onChangeEmail}
                    value={this.state.email}
                  />
                </div>
                
                {/* ********** 送出按鈕 ********** */}
                {this.state.state_hasClickSend?""
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

export default withTranslation()(SendResetEmail);
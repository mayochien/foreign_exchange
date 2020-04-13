import React from 'react';
import { apiPostMemberAdd } from '../../services/apiService'
import {withTranslation} from 'react-i18next';
import { MdRemoveRedEye, MdDone } from "react-icons/md";
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
// import { ERRORCODE } from '../../const'
import { GoArrowLeft } from "react-icons/go";

class MemberAdd extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      username:'',
      password:'',
      passwordConfirm:'',
      nickname:'',
      remark:'',
      state_success_message:'',
      state_error_message:'',
      isShowResultModal:false,
      isRepeatClickStop:false,
      showRedirectBtn:false,
    }
  }

  onChange_all = (e) => {
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  onChangeUsername = (e) => {
    let regex = /^[A-Za-z0-9]+$/ //只能輸入英文、數字 
    let value = e.target.value
    if (!(regex.test(value) || value === '')) {
      return false
    }
    else{
      this.setState({
        username:e.target.value
      })
    }
  }

  onChangePassword = (e) => {
    let regex = /^[A-Za-z0-9]+$/ //只能輸入英文、數字 
    let value = e.target.value
    if (!(regex.test(value) || value === '')) {
      return false
    }
    else{
      this.setState({
        password:e.target.value
      })
    }
  }
  
  clearStateData=()=>{
    setTimeout(() => {
      this.setState({
        username:'',
        password:'',
        passwordConfirm:'',
        nickname:'',
        remark:'',
      })
    }, 2000);
  }
  
  clearMessageAndCloseModal=()=>{
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
      })
    }, 2000)
  }

  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
      state_error_message:'',
      state_success_message:'',
      showRedirectBtn:false,
    });
  };

  showSubmitSuccess=()=>{
    let {t} = this.props
    this.setState({
      state_success_message: <span className="text-green">
      <MdDone/> {t('app.add_success')}</span>
    })
    setTimeout(() => {
      this.setState({
        showRedirectBtn:true,
        state_success_message:t('app.go')+t('app.list_page')+' ?',
      })
      this.clearStateData()
    }, 2000)
  }

  showInputDataMissing=()=>{
    let {t} = this.props
    console.log('有欄位未填寫')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
   this.clearMessageAndCloseModal()
  }

  showPasswordNotSame=()=>{
    let {t} = this.props
    console.log('兩次密碼不相符')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_confirm_password_again')
    })
   this.clearMessageAndCloseModal()
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

  //================= Api:post ===================//
   submitPost = async() => {
    let {t} = this.props
    let postData ={
      username: this.state.username,
      password: this.state.password,
      nickname: this.state.nickname,
      remark: this.state.remark,
    }
    console.log('postData:',postData)

    this.stopRepeatClick()

    if(this.state.username === ''
      ||this.state.password ===''
      ||this.state.passwordConfirm === ''
      ){
        this.showInputDataMissing() //有欄位未填時
    }
    else if(this.state.password !== this.state.passwordConfirm){
      this.showPasswordNotSame() //兩次輸入的密碼相同時
    }
    else{
      try {
        let res = await apiPostMemberAdd(postData)
        if(res.data.code === 1){
            console.log(res.data.code)
            this.setState({
              isShowResultModal:true
            })
            this.showSubmitSuccess()
            setTimeout(()=>{
              this.clearStateData()
            },500)
        }else{
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
  //=============================================//


  render(){
    let {t} = this.props
    // console.log(this.state);
    // console.log(this.state.username)

      return (
        <div className="container-fluid">
            <div className="row">
              <div className="col-md-10">
                <div className="card card-exchange">

                  <div className="text-right">
                    <Link to="/customer/member-list"
                      className="text-page-link">
                      <MdRemoveRedEye/>
                      <span className="ml-5">{t('app.see_list')}</span>
                    </Link>
                  </div>

                  <div className="header text-center">
                    <h4 className="title">{t('app.member_add')}</h4>
                  </div>

                  <div className="content">
                    <div className="form-horizontal">

                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.username')}
                        </label>
                        <div className="col-md-6">
                          <input
                            className=""
                            type="text"
                            onChange={this.onChangeUsername}
                            name="username"
                            value={this.state.username}
                            autoComplete="off"
                            maxLength="20"
                            placeholder={t('app.please_enter_6_20_characters')}
                            />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.password')}
                        </label>
                        <div className="col-md-6">
                          <input
                            className=""
                            type="password"
                            onChange={this.onChangePassword}
                            name="password"
                            value={this.state.password}
                            autoComplete="off"
                            maxLength="20"
                            />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.password_confirm')}
                        </label>
                        <div className="col-md-6">
                          <input
                            className=""
                            type="password"
                            onChange={this.onChange_all}
                            name="passwordConfirm"
                            value={this.state.passwordConfirm}
                            autoComplete="off"
                            maxLength="20"
                            />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {t('app.nickname')}
                        </label>
                        <div className="col-md-6">
                          <input
                            className=""
                            type="text"
                            onChange={this.onChange_all}
                            name="nickname"
                            value={this.state.nickname}
                            autoComplete="off"
                            maxLength="20"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {t('app.remark')}
                        </label>
                        <div className="col-md-6">
                          <input
                            className=""
                            type="text"
                            onChange={this.onChange_all}
                            name="remark"
                            value={this.state.remark}
                            autoComplete="off"
                            maxLength="20"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPost()
                              }
                            }} 
                          />
                        </div>
                      </div>

                      <br/>
                      <div className="form-group">
                        <label className="col-md-0"></label>
                        <div className="col-md-12">
                          <button  
                            type="button"
                            className="card-submit-btn"
                            onClick={this.state.isRepeatClickStop?'':this.submitPost}
                            >
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
                <div className="modal-body">
                  <span>
                    {this.state.state_success_message}
                  </span>
                  <span className="text-red">
                    {this.state.state_error_message}
                  </span>
                </div>
                  {this.state.showRedirectBtn?
                    <div className="modal-footer">
                      <button className="modal-action-button"
                        onClick={()=>window.location.href="/#/customer/member-list"}>
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
      )
  }
}

export default withTranslation()(MemberAdd);
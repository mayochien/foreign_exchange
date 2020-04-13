import React from 'react';
import {withTranslation} from 'react-i18next';
import { apiPostVerifyEmailToken } from '../../services/apiService'
// import { Link } from 'react-router-dom';
// import Modal from "react-responsive-modal";
import { ClipLoader } from 'react-spinners';
import { FiCheckCircle,FiXCircle } from "react-icons/fi";


class EmailVerifyResult extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      canDoingVerify:false,  // 有權限進行驗證 or 進來的連結有帶token
      doingVerifyNow:false,  // 正在進行驗證
      isVerifySuccess:false,  // 驗證結果:是否通過
    }
  }

  postTokentoVerify = async() => {
    let originToken = this.props.location.search
    let newToken = originToken.replace("?token=","")
    if(originToken===''||originToken===undefined||originToken===null){
      this.setState({
        canDoingVerify:false,
      })
    }
    // token不為空值才進行驗證
    else{
      this.setState({
        canDoingVerify:true,
        doingVerifyNow:true,
      })
  
      let postData ={
        token: newToken
      }
      try {
        let res = await apiPostVerifyEmailToken(postData)
        console.log('postData::',postData)
        if(res.data.code===1){
          setTimeout(() => {
            this.setState({
              isVerifySuccess:true,
            })
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
      setTimeout(() => {
        this.setState({
          doingVerifyNow:false,
        })
      }, 2000);
    }
  }

  componentDidMount(){
    this.postTokentoVerify()
  }

  render(){
    let {t} = this.props
    console.log(this.props.location.search)
    let originToken = this.props.location.search
    let newToken = originToken.replace("?token=","")
    console.log(newToken)

      return (
        <div className="container-fluid">
            <div className="row">
              <div className="col-md-10">
                <div className="card card-exchange">

                  <div className="header text-center">
                  </div>
              
                  <div className="content">
                    {!this.state.canDoingVerify?
                      <div className="form-horizontal verify-form">
                        <div className="header text-center">
                          <h4 className="title">{t('app.email_verification')}</h4>
                        </div>
                        <div className="form-group">
                          <label className="col-md-12">
                            {t('app.no_data')}
                          </label>
                        </div>
                      </div>
                      :
                      <div className="form-horizontal verify-form">
                        <div className="header text-center">
                          <h4 className="title">{t('app.email_verification')}</h4>
                        </div>
                        <br/><br/><br/><br/>
                        <div className="form-group">
                          {this.state.doingVerifyNow?
                            <div className="col-md-12">
                              <div className='sweet-loading'>
                                <ClipLoader
                                  // css={override}
                                  sizeUnit={"px"}
                                  size={30}
                                  color={'rgba(60, 66, 70)'}
                                  loading={this.state.loading}
                                />
                              </div>
                            </div>
                          :
                            <div className="col-md-12">
                              {this.state.isVerifySuccess?
                                <span className="text-green verify-animate">
                                  <FiCheckCircle/>
                                </span>
                                :
                                <span className="text-red verify-animate">
                                  <FiXCircle/>
                                </span>
                              }
                            </div>
                          }
                        </div>
                      
                        <div className="form-group">
                          {this.state.doingVerifyNow?
                            <div className="col-md-12">
                              <span>{t('app.verifying')}...</span>
                            </div>
                            :
                            <div className="col-md-12">
                              {this.state.isVerifySuccess?
                                <span className="text-green">
                                  {t('app.verification_succeeded')}
                                </span>
                                :
                                <span className="text-red">
                                  {t('app.verification_failed')}
                                </span>
                              }
                            </div>
                          }
                        </div>

                        <br/><br/>

                        <div className="form-group">
                          {this.state.doingVerifyNow?
                            <div className="col-md-12"></div>
                            :
                            <div className="col-md-12">
                              <button 
                                className="card-submit-btn mr-10"
                                onClick={()=>this.props.history.push('/')}
                              >
                                {t('app.go')}{t('app.homepage')}
                              </button>
                              <button 
                                className="card-submit-btn"
                                onClick={()=>this.props.history.push('/banker-profile')}
                              >
                                {t('app.go')}{t('app.myProfile')}
                              </button>
                            </div>
                          }
                        </div>
                      
                      </div>
                    }
                  </div>

                </div>
              </div>
            </div>
        </div>
      )
    }
}

export default withTranslation()(EmailVerifyResult);
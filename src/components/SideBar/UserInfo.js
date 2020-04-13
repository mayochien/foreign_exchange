import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Collapse } from 'react-bootstrap';
import { connect } from 'react-redux';
// import cx from 'classnames';
import { Translation } from 'react-i18next';
import { ROLE_STATUS } from '../../const';
import { apiGetBankerProfile } from '../../services/apiService';
import Format from '../../services/Format';   


class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowingUserMenu: false,
      state_bankerProfileData:{}
    }
  }

  getInitialData = async() => { // 初始載入
    try {
      const res = await apiGetBankerProfile();
      if(res.data.code===1){
        this.setState({
          state_bankerProfileData:res.data.data
        }  
        // ,()=>{console.log(this.state.state_bankerProfileData);}
        )
      }
      else{
        this.setState({
          state_bankerProfileData:{amount:0,credit:0,withhold_amount:0}
        })  
      }
    } catch(err) {
      console.log(err);
      this.setState({
        state_bankerProfileData:{amount:0,credit:0,withhold_amount:0}
      })  
    }
  }

  onClickToMyProfile= () => { //連結至個人資料
    window.location.href="/#/banker-profile"
  }

  componentDidMount() {
    this.getInitialData()
    this.refresCredit = setInterval(()=>{
      this.getInitialData()
    },6000)
  }

  componentWillUnmount(){
    clearInterval(this.refresCredit);
  }


  render() {
    const { user } = this.props;
    let { state_bankerProfileData
          // ,isShowingUserMenu
        } = this.state;

    return (
      <div className="user-wrapper">
        <div className="user">
          <div className="userinfo">
            <div className="username" onClick={this.onClickToMyProfile}>
              {user.username}
            </div>
            <div className="title">
              <Translation>
                {
                  (t) => <p>{t(ROLE_STATUS[user.role])}</p>
                }
              </Translation>
            </div>
            <div className="title">
              <Translation>
                {(t) => 
                  <p>
                    {t('app.amount_limit')}(HKD) : {Format.thousandsMathRound3(state_bankerProfileData.amount)}
                  </p>
                }
              </Translation>
            </div>
            {/* <div className="title">
              <Translation>
                {(t) => <p>{t('app.credit_limit')}(HKD) : {Format.thousandsMathRound3(state_bankerProfileData.credit)}</p>
                }
              </Translation>
            </div> */}
            <div className="title">
              <Translation>
                {(t) => 
                  <p>
                    {t('app.withholding_amount')}(HKD) : {Format.thousandsMathRound3(state_bankerProfileData.withhold_amount)}
                  </p>
                }
              </Translation>
            </div>
          </div>
          {/* <span
            onClick={() => this.setState({ isShowingUserMenu: !this.state.isShowingUserMenu })}
            className={cx("pe-7s-angle-down collapse-arrow", {
              active: isShowingUserMenu
            })}>
          </span> */}
        </div>
        {/* <Collapse in={isShowingUserMenu}>
          <ul className="nav user-nav">
            <li>
              <Link to="/banker-profile">
                <Translation>
                  {
                    (t) => <p>{t('app.myProfile')}</p>
                  }
                </Translation>
              </Link>
            </li>
          </ul>
        </Collapse> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.UserReducer.user
});

export default connect(mapStateToProps)(UserInfo);

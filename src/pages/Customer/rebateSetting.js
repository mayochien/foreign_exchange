import React from 'react';
import { apiGetBankAgentProportion, apiPutBankAgentProportion } from '../../services/apiService'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import { withTranslation } from 'react-i18next';


class rebateSetting extends React.Component{
   state = {
      proportionData: '',
      bankerValue: '',
      agentValue:'',
      isModify: false,
    }

  //================= api:get ===================//
  async componentDidMount() {
    try {
      let proportionData = await apiGetBankAgentProportion();
      // console.log(proportionData.data.data)
      this.setState({
        agentValue: proportionData.data.data.proportion_rate.agent,
        bankerValue: proportionData.data.data.proportion_rate.banker,
      })
      
    } catch(err) {
      console.log('客戶返水get: err',err);
    }
  }
  //================ ↑ ↑ ↑ ↑ ↑ ↑ =================//

  onClickModify = () => {
    this.setState({
      isModify: true
    })
  }

  onChangeValue = (value) => {
    this.setState({
      agentValue:parseFloat(value.toFixed(3),10),
      bankerValue:1-parseFloat(value.toFixed(3),10)
    }
    // ,()=>{console.log('change agent:',this.state.agentValue)}
    // ,()=>{console.log('change banker:',this.state.bankerValue)}
    )
  };

  //================= api:post ===================//
  onClickSave = async() =>{
    this.setState({
      isModify: false,
    })
    // api傳回修改值:
    let putData = {
      agent: this.state.agentValue,
      banker: parseFloat(this.state.bankerValue,10)
    }
    console.log('putData::',putData)
    await apiPutBankAgentProportion(putData)
  }
  //================ ↑ ↑ ↑ ↑ ↑ ↑ =================//


    render(){
    const { t } = this.props;

    let { agentValue, isModify} = this.state
    // console.log('初始bankerValue:',bankerValue)
    // console.log('初始agentValue:',agentValue)

    let showAgentValue = (agentValue*100).toFixed(1)

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-11">
            <div className="card card-exchange">
              <div className="header text-center">
                <h4 className="title">{t('app.rebate_setting')}</h4>
              </div>

              <div className="content">
                <div className="slider-box">
                  <div className="slider-info-box ">
                    {!isModify?
                    <button type="button" onClick={this.onClickModify}
                      className="card-submit-btn slider-btn">
                       {t('app.edit')}
                    </button>
                    :
                    <button type="button" onClick={this.onClickSave}
                      className="card-submit-btn slider-btn active-btn">
                      {t('app.save')}
                    </button>
                    }

                    <div className="show-value">
                      <span className="show-value-origin">
                        {/* <span className="mr-30">
                        {t('app.banker')}：{showBankValue}%
                        </span> */}
                        <span>
                        {t('app.rebate_setting')}：{showAgentValue}%
                          </span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={!isModify?
                    "fee-rate-slider-not-modify fee-rate-slider"
                    :"fee-rate-slider"}>
                    <Slider
                      min={0}
                      max={1}
                      value={agentValue}
                      step={0.005}
                      tooltip={false}
                      onChange={this.onChangeValue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default withTranslation()(rebateSetting);
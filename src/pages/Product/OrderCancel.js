import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import generateData from './generateData';

const data = generateData(1000);

class OrderCancel extends Component {

  state = {
    data: generateData(500, false)
  };

  removeItem = itemId => {
    this.setState({
      data: data.filter(item => item.id !== itemId)
    });
  }

  render() {
    const { data } = this.state;
    const options = {
      sizePerPage: 20,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              <div className="header  text-center">
                <h4 className="title">已取消訂單</h4>
              </div>
              <div className="content">
                <BootstrapTable
                  data={data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options}>
                  <TableHeaderColumn
                    dataField='id'
                    isKey
                    width="50px"
                    dataSort>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='name'
                    width="15%"
                    // filter={ { type: 'TextFilter'} }
                    dataSort>
                    Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='country'
                    width="15%"
                    dataSort>
                    Country
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='salary'
                    width="15%"
                    dataSort>
                    Salary
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='job'
                    width="15%">
                    Job
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='description'
                    width="30%">
                    Description
                  </TableHeaderColumn>
                  {/* <TableHeaderColumn width="20%"></TableHeaderColumn> */}
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default OrderCancel
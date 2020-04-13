import React from 'react';
import moment from 'moment';
import faker from 'faker';

export default class EmployeeEdit extends React.Component{

    render(){
      let data = [];
      let limit = 10
      let arrayData = false
      for (let i = 1; i <= limit; i++) {
        let row = null;
        if (arrayData) {
            row = [
            i,
            faker.name.findName(),
            faker.finance.amount(),
            faker.address.country(),
            faker.image.avatar(),
            faker.address.city(),
            faker.name.jobTitle(),
            faker.lorem.sentence(),
            faker.random.boolean(),
            faker.date.past()
            ];
        } else {
            row = {
            id: i,
            name: faker.name.findName(),
            salary: faker.finance.amount(),
            country: faker.address.country(),
            avatar: faker.image.avatar(),
            city: faker.address.city(),
            job: faker.name.jobTitle(),
            description: faker.lorem.sentence(),
            active: faker.random.boolean(),
            birthday: faker.date.past()
            };
        }
        data.push(row);
      }


      return (
        <div className="container-fluid">
        
          <div className="row">
            <div className="col-md-12">
              <div className="card card-exchange">

                <div className="header text-center">
                  <h4 className="title">編輯員工</h4>
                </div>
                
                <div className="content table-responsive table-full-width">
                  <table className="table table-bigboy table-exchange">
                    <thead>
                      <tr>
                        <th className="text-center">id</th>
                        <th>Name</th>
                        <th className="th-description">Description</th>
                        <th className="">Birth</th>
                        {/* <th className="text-right">Birthdate</th> */}
                        <th>photo</th>
                        <th>edit</th>
                        <th>delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(item => (
                        <tr>
                          <td>
                            <div className="img-container text-center">
                              <img src={item.avatar} alt={item.name} />
                            </div>
                          </td>
                          <td className="td-name">
                            {item.name}
                          </td>
                          <td>
                            {item.description}
                          </td>
                          <td className="td-number">{moment(item.birthdate).format('YYYY-MM-DD')}</td>
                          <td className="td-actions text-center">
                            <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                              <i className="fa fa-image"></i>
                            </button>
                          </td>
                          <td className="td-actions text-center">
                            <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td className="td-actions text-center">
                            <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                              <i className="fa fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
}
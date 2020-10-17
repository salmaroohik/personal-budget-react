import React from 'react';
import axios from 'axios';
import {Pie} from "react-chartjs-2";

export default class Chart extends React.Component {
    state = 
        {
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        '#ffcd56',
                        '#ff6384',
                        '#ff0000',
                        '#ff00ff',
                        '#00ff00',
                        '#0000ff',
                        '#00ccff'
                    ]
                }
            ],
            labels: []
        };
    

    getBudget = async() => {
            const res = await axios.get('http://localhost:3000/budget');
             
                for (var i = 0; i < res.data.myBudget.length; i++) {
                    this.state.datasets[0].data[i] = res.data.myBudget[i].budget;
                    this.state.labels[i] = res.data.myBudget[i].title;
                }
            return this.state;
        }

    componentDidMount(){
        if (!this.state.data) {
          (async () => {
              this.setState({ data: await this.getBudget() });
          })();
        }
      }

      render() {
        return (
          <div>
              {this.state.datasets[0].data.length===0 ? (
                  <div>Loading Data</div>
              ):(
              <Pie
              data={{labels: this.state.labels,
            datasets: this.state.datasets}}
            height='500%'
              />
              )}
          </div>
        )
      }
    }

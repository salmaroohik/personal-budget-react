import React from 'react';
/* import axios from 'axios';

export default class Hero extends React.Component {
    state = {
      persons: []
    }

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
          .then(res => {
            const persons = res.data;
            this.setState({ persons });
          })
      }

      render() {
        return (
          <ul>
            { this.state.persons.map(person => <li>{person.name}</li>)}
          </ul>
        )
      }
    }
 */
function Hero() {
  return (

    <div className="hero">
        <h1>Personal Budget</h1>
        <h2>A personal-budget management app</h2>
    </div>
  );
}

export default Hero;

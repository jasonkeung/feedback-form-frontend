import React from 'react'
import './Form.css'
import axios from 'axios'

class Form extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      lname: '',
      email: '',
      message: '',
      showErrors: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  validate(fname, lname, email, message) {
    return {
      fname: this.state.fname.length === 0,
      lname: this.state.lname.length === 0,
      email: !(this.state.email).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
      message: this.state.message.length > 500 || this.state.message.length === 0
    }
  }
  
  handleSubmit(e) {
    e.preventDefault()
    const { fname, lname, email, message} = this.state
    const errors = this.validate(fname, lname, email, message)
    if (!(errors.fname || errors.lname || errors.email || errors.message)) {
      var formData = new FormData();
      formData.set('first', fname)
      formData.set('last', lname)
      formData.set('email', email)
      formData.set('message', message)
      axios({
        method: 'post',
        url: 'https://52.15.184.142:80/feedback',
        data: formData
      })
      .then(function(response) {
        console.log('POST SUCCESS')
        console.log(response.data)
      })
      .catch(function(response) {
        console.log('POST ERROR:')
        console.log(response)
      })
      console.log('end')
    }
    this.setState({showErrors: true})
    return false
  }

  render() {
    const { fname, lname, email, message } = this.state
    var errors
    if (this.state.showErrors) {
      errors = this.validate(fname, lname, email, message)
    } else {
      errors = {
        fname: false,
        lname: false, 
        email: false,
        message: false
      }
    }
                                
     return <div>
      <form className="mx-auto" id="form">
        <h1 className="form-title">Feedback</h1>
        <div className="form-group">
          <input 
            type="text" 
            className={"form-control " + (errors.fname ? "error" : "")}
            name="fname" 
            placeholder="First Name" 
            value={fname}
            onChange={this.handleChange}
          /><br />
          <input 
            type="text" 
            className={"form-control " + (errors.lname ? "error" : "")} 
            name="lname" 
            placeholder="Last Name" 
            value={lname}
            onChange={this.handleChange}
          /><br />
          <input 
            type="email" 
            className={"form-control " + (errors.email ? "error" : "")}
            name="email" 
            placeholder="john@example.com" 
            value={email}
            onChange={this.handleChange}
          /><br />
          <TextWithCounter
            className={"form-control  " + (errors.message ? "error" : "")}
            name="message"
            onChange={this.handleChange}
            value={message}>
          </TextWithCounter><br />
          <button 
            type="submit" 
            className={"btn btn-primary"} 
            onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </form> 
    </div>
  }
}

function TextWithCounter(props) {
  return <div style={{'textAlign': 'left', color: '#666'}}>
            <textarea className={props.className} 
                      id="inputMessage" 
                      placeholder="Message" 
                      rows="4" 
                      name={props.name}
                      value={props.value} 
                      onChange={props.onChange} />
            <span>{props.value.length} / 500</span>
          </div>
}

export default Form;
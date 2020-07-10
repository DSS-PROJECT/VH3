import React, { Component } from 'react'
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react'

import { webapi } from './../config/index'

const divStyle = {
    marginTop: '100px',
};

export default class Login extends Component {

    state = {
        register: false,
        // pop_validate: false,
        messageIsOpenNegative: true,
        userlogin: {
            user: '',
            pass: ''
        },
        registerForm: {
            emp_id: '',
            password: '',
            confirm_password: ''
        },
        isOpen: {
            pop_emp_id: false,
            pop_password: false
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    handleChange = this.handleChange.bind(this)

    handleChange(event) {
        if (event.target.name === 'emp_id' || event.target.name === 'password' || event.target.name === 'confirm_password') {
            this.setState({
                registerForm: {
                    ...this.state.registerForm,
                    [event.target.name]: event.target.value
                }
            })
        }
        else {
            this.setState({
                userlogin: {
                    ...this.state.userlogin,
                    [event.target.name]: event.target.value
                }
            })
        }
    }

    Login() {
        let { userlogin } = this.state
        // console.log(userlogin)
        fetch(webapi + 'login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userlogin.user,
                pass: userlogin.pass
            })
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
            else if (res.status === 400) {
                console.log("Missing password")
            }
            else if (res.status === 522) {
                console.log("Server Not Found!!!!")
            }
            else if (res.status === 500) {
                console.log("Internal Server Error!!!!")
            }
        })
            .then(res => {
                console.log(res)
                if (res !== '[]') {
                    this.setState({ messageText: "SUCCESSS", messageIsOpenNegative: true })
                    this.SetlocalStore(res)
                    this.props.login.Onlogin()
                }
                else {
                    this.setState({ messageText: "Email or Password No SUCCESSS", messageIsOpenNegative: false })
                }

            });

        this.setState({ open: false })
    }



    SetlocalStore = (res) => {

        const data = JSON.parse(res)

        sessionStorage.setItem('myData', res)
        if (data) {
            data.map(e =>
                this.setState({ users: e })
            )
        }
    }

    OnRegister = () => {
        console.log('OnRegister')
        this.setState({
            register: true,
            registerForm: {
                emp_id: '',
                password: '',
                confirm_password: ''
            }
        })
    }
    OnRegisterBack = () => {
        this.setState({ register: false })
    }

    _validate = () => {
        let { registerForm: { emp_id, password, confirm_password } } = this.state
        this.setState({
            ...this.state,
            isOpen: {
                pop_emp_id: (emp_id.length !== 8),
                pop_password: (password.length !== 0|| confirm_password !== 0 || password !== confirm_password)
            }
        })

    }

    // componentWillUpdate(nextProps, nextState) {
    //     console.log(nextState)
    // }



    render() {

        const { register, messageText, messageIsOpenNegative, userlogin: { user, pass }, registerForm: { emp_id, password, confirm_password }, isOpen: { pop_emp_id, pop_password } } = this.state

        return !register ? (
            <div className='login-form' style={divStyle}>

                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Log-in to your account VH3
        </Header>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' name="user" value={user} onChange={this.handleChange} />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name="pass"
                                    value={pass}
                                    onChange={this.handleChange}
                                />

                                <Button color='teal' fluid size='large' onClick={() => this.Login()}>
                                    Login
            </Button>
                            </Segment>
                            <Header as='h4'>Best viewed with Chrome</Header>
                            <Message hidden={messageIsOpenNegative} negative>{messageText}</Message>
                        </Form>
                        {/* <Message>

                            Don't have an account? <Button basic color='blue' size='mini' content='Sign Up' onClick={() => this.OnRegister()} />
                            {/* <Button basic content='Next' icon='right arrow' labelPosition='right' /> */}
                            {/* <a href="#" onClick={() => this.OnRegister()}>
                                Sign Up
</a> */}
                        {/* </Message> */}
                    </Grid.Column>
                </Grid>
            </div >
        ) :

            (<div style={divStyle}>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Register to account VH3
</Header>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='User Employee'
                                    type='text'
                                    name="emp_id"
                                    value={emp_id}
                                    maxLength={8}
                                    error={pop_emp_id}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name="password"
                                    value={password}
                                    error={pop_password}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Confirm Password'
                                    type='password'
                                    name="confirm_password"
                                    value={confirm_password}
                                    error={pop_password}
                                    onChange={this.handleChange}
                                />
                                <Button color='teal' fluid size='large' onClick={() => { this._validate() }} >
                                    Submit
    </Button>
                                {/* onClick={() => this.SubmitsearchEmail()}  */}
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
            )
    }
}

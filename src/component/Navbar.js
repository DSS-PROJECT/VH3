import React, { Component } from 'react'
import {
    // Container,
    // Modal,
    // Dimmer,
    // Form,
    Menu,
    Button,
    Image,
    // Segment,
    // Message,
    // Loader
} from 'semantic-ui-react/dist/commonjs'

import { fetchapi } from './../config/index'

import logo from './../image/1566294312822.png'
import { NavLink } from "react-router-dom";

class Navbar extends Component {

    state = {
        activeItem: 'home',
        users: true,
        admin: true
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    checkadmin = () => {
        let { users } = this.state
        let items = fetchapi('vh3/checkadmin', users)
        items.then(res => res.json())
            .then(res => {
                if(res){
                    this.setState({
                        admin: true
                    })
                }
                else {
                    this.setState({
                        admin: false
                    })   
                }
            })
        // this.setState({ admin: (Promise.resolve(fetchapi('vh3/checkadmin',users.user_empid))) ? true : false })
    }


    componentWillMount() {
        // console.log("withNavbar componentDidMount")
        const data = JSON.parse(sessionStorage.getItem('myData'))
        if (data) {
            data.map(e =>
                this.setState({ users: e })
            )
        }
    }

    render() {
        let { activeItem, users } = this.state
        return (
            <div>
                {/* 2 */}
                <Menu fixed="top" inverted>
                    <Menu.Item as="a" header>
                        <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
                        Project VH3
            </Menu.Item>
                    <Menu.Item
                        name="home"
                        active={activeItem === 'home'}
                        as={NavLink} to="/" content="Home"
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item

                        name="Information"
                        active={activeItem === 'Information'}
                        as={NavLink} to="/vh3information" content="Information VH3"
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item

                        name="summarycar"
                        active={activeItem === 'summarycar'}
                        as={NavLink} to="/summarycar" content="Summary Car"
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name="users"
                        active={activeItem === 'users'}
                        as={NavLink} to="/analysis" content="Analysis"
                        onClick={this.handleItemClick}
                    />
                    <Menu.Menu position="right">
                        <Menu.Item>
                            {users.user_fnamet + " " + users.user_lnamet}
                        </Menu.Item>
                        <Menu.Item>
                            <Button onClick={() => this.props.logout()}>SignOut</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        )
    }
}

export default Navbar
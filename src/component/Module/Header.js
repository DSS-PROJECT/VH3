import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Header,
    // Form,
    Button,
    Input,
    Segment,
    Label,
    Divider,
    Grid,
    Message,
    Image,
    // Select,
    Placeholder,
    Dimmer,
    Loader,
    List,
    Icon
} from 'semantic-ui-react/dist/commonjs'

// api config
import { fetchapi } from '../../config/index'

// ...
import Action from '../../actions';

export class HeaderForm extends Component {

    state = {
        textinput: {
            search: '',
        },
        active: false,
        messageIsOpen: true,
        messageText: '',
        data: null,
        user: null,
        data_car: null,
        num: 1,
        to: 12,
    }

    handleChange = this.handleChange.bind(this)

    handleChange(event, { name, value }) {
        // console.log(value)
        this.setState({
            textinput: {
                ...this.state.textinput,
                [event.target.name]: event.target.value

            }
        }, () => this.OnloadCar())
    }

    handleRef = (c) => {
        this.inputRef = c
    }

    focus = () => {
        this.inputRef.focus()
        this.OnClaer()
    }

    OnClaer() {
        this.setState({ data: null, data_car: null })
        this.props.clearment()
    }

    OnloadCar() {
        let { textinput: { search } } = this.state
        // console.log(search)
        if (search === '' || search.length === 0 || search === null) {
            this.setState({ messageIsOpen: false, messageText: 'Please enter', textinput: { search: '' }, data_car: null }, this.focus)
        }
        else {
            let items = fetchapi('car/get_car', { search: search.replace(/ /gi, "") })
            items.then(res => res.json())
                .then(res => this.setState({ data_car: res, messageIsOpen: true }))
        }

    }

    OnloadData() {
        let { textinput } = this.state
        this.setState({ active: true, data: null, data_car: null })


        if (textinput.search === '' || textinput.search.length === 0 || textinput.search === null) {
            this.setState({ messageIsOpen: false, messageText: 'Please enter', textinput: { search: '' } }, this.focus)
        } else {
            let items = fetchapi('car/get_car', { search: textinput.search.replace(/ /gi, "") })
            // let items = fetchapi('car/get_car/', { search: textinput.search.replace(/ /gi, "") })
            items.then(res => res.json())
                .then(res => this.CheckDatareturn(res))
                .then(posts => posts.map(e => {
                    this.props.searchment(posts)
                    this.forceUpdate();
                    return setTimeout(() => {
                        this.setState({ active: false, data: e, textinput: { search: '' }, messageIsOpen: true })
                    }, 500)
                }))
        }
    }

    CheckDatareturn(data) {
        // console.log(data)

        if (data.length === 0) {
            this.setState({ messageIsOpen: false, messageText: 'ไม่มีข้อมูลรถคันนี้อยู่ในระบบ หรือรถคันนี้ไม่มีสถานะพร้อมใช้งาน', textinput: { search: '' } })

        }
        return data
    }

    renderCar = () => {
        let { data_car, to, num } = this.state

        let Data = []

        // console.log(data_car)
        if (data_car) {
            Data.push(data_car.slice((to * num) - to, (to * num)).map((items, key) => (

                <Grid.Column key={key}>
                    <Segment onClick={() => this.setState({ textinput: { search: items.licence_plate_num } }, () => this.OnloadData())}>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='car' size='huge' />
                                <List.Content>
                                    <List.Header as='a' ><Image src={`https://rm.wwit.info/storage/image/empimg/${items.user_empid}.jpg`} size='mini' avatar />{items.licence_plate_num}</List.Header>

                                    <List.Description>{items.user_initt + ' ' + items.user_fnamet + '  ' + items.user_lnamet}</List.Description>
                                    <List.Description>
                                        {items.user_deptn}
                                    </List.Description>
                                </List.Content>

                            </List.Item>
                        </List>
                    </Segment>
                </Grid.Column>

            )))
        }
        return Data
    }

    render() {
        let { active, data, textinput: { search }, messageIsOpen, messageText } = this.state

        let loadData
        // console.log(data)

        if (data) {
            loadData = (
                <Grid columns={2} stackable>
                    <Grid.Column>
                        <Segment color="black">Name : {data.user_initt + "" + data.user_fnamet + " " + data.user_lnamet}</Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment color="black">EmployeeID : {data.user_empid} </Segment>
                    </Grid.Column>
                    <Grid.Row columns={3}>
                        <Grid.Column>
                            <Segment color="black">Division : {data.user_deptn} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment color="black">Department : {data.user_section} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment color="black">
                                Register No. : {data.licence_plate_num}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment color="black">Brand : {data.car_brand} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment color="black">Oil Type : {data.car_fuel} </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        } else {
            loadData = (
                <div>
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                </div>
            )
        }

        return (
            <div>
                <Header size="huge">HEADER</Header>
                <Label content='License Plate' size='big' color='blue' />
                <Input
                    action={<Button onClick={() => this.OnloadData()}>Search</Button>}
                    ref={this.handleRef}
                    required
                    value={search}
                    name="search"
                    placeholder='Search...'
                    // onClick={}
                    onChange={this.handleChange} />
                <Button floated='right' negative circular icon='close' onClick={() => this.OnClaer()} />
                <Message hidden={messageIsOpen} negative>{messageText}</Message>
                <Divider />
                <Grid columns={4} divided>
                    <Grid.Row >
                        {this.renderCar()}
                    </Grid.Row>
                </Grid>
                <Divider />
                <Dimmer.Dimmable dimmed={active}>
                    <Dimmer inverted active={active}>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    {loadData}
                </Dimmer.Dimmable>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    post: state.post

})

const mapDispatchToProps = dispatch => ({
    // increment: () => dispatch({ type: Action.INCREMENT, text: "INCREMENT Redux" }),
    // decrement: () => dispatch({ type: Action.DECREMENT, text: "DECREMENT Redux" }),
    // postment: (posts) => dispatch({ type: Action.ADDDATA, text: "ADDDATA Redux", post: posts }),
    // despostment: () => dispatch({ type: Action.DEDATA, text: "DEDATA Redux" , post: {} }),

    searchment: (datas) => dispatch({ type: Action.SEARCH, text: "SEARCH Redux", data: datas }),
    clearment: () => dispatch({ type: Action.CLEAR, text: "CLEAR Redux" })
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderForm)

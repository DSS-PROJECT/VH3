import React, { Component } from 'react'
import { connect } from 'react-redux'
import Action from '../../actions';

import {
    Header,
    Button,
    Divider,
    Dropdown,
    Input,
    Icon,
    Image,
    Modal,
    List,
    Grid,
    Segment
} from 'semantic-ui-react/dist/commonjs'

// import PDF from './../PDF';

// import { webapi } from '../../config/index'
import { fetchapiGet, fetchapi } from '../../config/index'

const options = [
    { key: 'JAN', text: 'JAN', value: '01' },
    { key: 'FEB', text: 'FEB', value: '02' },
    { key: 'MAR', text: 'MAR', value: '03' },
    { key: 'APR', text: 'APR', value: '04' },
    { key: 'MAY', text: 'MAY', value: '05' },
    { key: 'JUN', text: 'JUN', value: '06' },
    { key: 'JUL', text: 'JUL', value: '07' },
    { key: 'AUG', text: 'AUG', value: '08' },
    { key: 'SEP', text: 'SEP', value: '09' },
    { key: 'OCT', text: 'OCT', value: '10' },
    { key: 'NOV', text: 'NOV', value: '11' },
    { key: 'DEC', text: 'DEC', value: '12' },

]

// const DataYear = [
//     { key: '2019', text: '2019', value: '2019' },
//     { key: '2020', text: '2020', value: '2020' }
// ]

export class Search extends Component {

    state = {
        textinput: {
            search: '',
            sumnow: '',
            yearnow: ''

        },
        openModel: false,
        active: false,
        // messageIsOpen: true,
        messageText: '',
        // dropdownclear: false
        errorOption: {
            errorSearch: false,
            errorMonths: false,
            errorYear: false
        },
        options_year: [],
        data_car: null,
        num: 1,
        to: 12
    }

    closeModel = () => this.setState({ openModel: false })
    handleItemClick = (e) => console.log(e)


    handleChange = this.handleChange.bind(this)

    handleChange(event, { name, value }) {
        this.setState({
            textinput: {
                ...this.state.textinput,
                [name]: value
                // [event.target.name]: event.target.value

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
        this.setState({ data: null, textinput: { search: '', sumnow: '', yearnow: '' } })
        // this.handleFocus()
        this.props.clearment()
    }

    OnloadData() {
        let { textinput } = this.state
        // console.log(textinput)
        this.setState({
            active: true,
            data: null,
            errorOption: {
                errorSearch: (textinput.search === '' || textinput.search.length === 0 || textinput.search === null),
                errorMonths: (textinput.sumnow === '' || textinput.sumnow.length === 0),
                errorYear: (textinput.yearnow === '' || textinput.yearnow.length === 0)
            }
        }, () => {
            let { errorOption: {
                errorSearch,
                errorMonths,
                errorYear
            } } = this.state

            // console.log(errorSearch, errorMonths, errorYear)
            // console.log((!errorSearch && !errorMonths && !errorYear))
            if (!errorSearch && !errorMonths && !errorYear) {
                this.props.searchment(textinput)
            }
            else {
                this.setState({ openModel: true, messageText: 'รบกวนตรวจสอบข้อมูล ทะเบียนรถ เดือน และปี', textinput: { search: '', sumnow: '', yearnow: '' } }, this.focus)

            }
        })
    }

    Option_Year = data => {
        // console.log(data)

        // console.log(data)
        data.map((items, key) => {
            return this.setState({
                options_year: [
                    ...this.state.options_year,
                    {
                        key: key,
                        text: items.YEAR,
                        value: items.YEAR
                    }
                ]
            });
        });
    };

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

    OnloadDataCar = () => {

    }



    componentDidMount() {
        let items = fetchapiGet('vh3/get_year/')
        items.then(res => res.json())
            .then(res => this.Option_Year(res))

    }

    // componentWillUpdate(nextProps, nextState) {
    //     console.log(nextState)
    // }

    renderCar = () => {
        let { data_car, to, num } = this.state

        let Data = []

        // console.log(data_car)
        if (data_car) {
            Data.push(data_car.slice((to * num) - to, (to * num)).map((items, key) => (

                <Grid.Column key={key}>
                    <Segment onClick={() => this.setState({ textinput: { search: items.licence_plate_num } }, () => this.OnloadDataCar())}>
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
        let { textinput: { search, sumnow, yearnow }, openModel, messageText, errorOption: { errorSearch, errorMonths, errorYear }, options_year } = this.state
        return (
            <div>
                <Input
                    error={errorSearch}
                    ref={this.handleRef}
                    required
                    value={search}
                    name="search"
                    placeholder='Search...'
                    onChange={this.handleChange} >
                </Input>
                <Dropdown
                    clearable
                    error={errorMonths}
                    name="sumnow"
                    value={sumnow}
                    selection
                    options={options}
                    onChange={this.handleChange}
                    // onFocus={this.handleFocus}
                    placeholder='Select Months'
                />
                <Dropdown
                    clearable
                    error={errorYear}
                    name="yearnow"
                    value={yearnow}
                    selection
                    options={options_year}
                    onChange={this.handleChange}
                    // onFocus={this.handleFocus}
                    placeholder='Select Year'
                />

                <Button color='blue' onClick={() => this.OnloadData()}>
                    <Icon name='search' />
                    Search
                    </Button>
                <Button negative onClick={() => this.OnClaer()} >
                    <Icon name='close' />Cancel</Button>
                {/* <PDF /> */}
                <Divider />
                < Modal
                    open={openModel}
                    onClose={this.closeModel}
                >
                    <Header icon='archive' content='รบกวนตรวจสอบข้อมูล' />
                    <Modal.Content>
                        <p>{messageText} </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.setState({ openModel: false })}>
                            <Icon name='checkmark' /> Yes
      </Button>
                    </Modal.Actions>
                </Modal >
                <Grid columns={4} divided>
                    <Grid.Row >
                        {/* {this.renderCar()} */}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({
    searchment: (datas) => dispatch({ type: Action.SEARCH, text: "SEARCH Redux", data: datas }),
    clearment: () => dispatch({ type: Action.CLEAR, text: "CLEAR Redux" })
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)

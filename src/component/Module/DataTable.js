import React, { Component } from 'react'
import {
    Button,
    Form,
    Table,
    Header,
    Segment,
    Icon,
    Message,
    Divider,
    Popup,
    // Dimmer,
    Modal,
    // Input
} from 'semantic-ui-react/dist/commonjs'



// .... Connect Redux ....
import { connect } from 'react-redux'

// .... API ....
import { fetchapi, fetchapiDelete, fetchapiUpData } from '../../config/index'

import PDF from './../PDF'

import moment from 'moment';
import { kCopyLengthPrefixCode } from 'pdfmake/build/pdfmake'
import { f } from 'pdfmake/build/pdfmake'

const FromStyleGroup = {
    //height: "100px",
    overflow: 'scroll'
}



class DataTable extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)


        this.state = {
            // dataTable: null,
            header: [],
            data: [],
            dataProcess: null,
            rm_no_contorl: false,
            openModel_message: false,
            dataEdit: null,
            messageIsOpenPositive: true,
            messageIsOpenNegative: true,
            messageTextUpdata: '',
            messageText: '',
            form: {
                user_empid: '',
                des: '',
                check_out: '',
                data_time_out: '',
                check_in: '',
                data_time_in: '',
                rm_no: '',
                litr: '',
                bath: '',
                expressway: '',
                carpark: '',
                otherexpenses: '',
                tax_id: '',
                branch: '',
                tax_inv_no: ''
            },
            isOpen: {
                pop_des: false,
                pop_check_out: false,
                pop_data_time_out: false,
                pop_check_in: false,
                pop_data_time_in: false,
                pop_rm_no: false,
                pop_litr: false,
                pop_bath: false,
                pop_time_outs: false,
                pop_time_in: false
            }

        }
    }


    closeModel_Del = () => this.setState({ openModel_Del: false })
    closeModel_Edit = () => this.setState({ openModel_Edit: false })
    closeModel_Message = () => this.setState({ openModel_message: false })

    openModel_Del = () => this.setState({ openModel_Del: true })
    openModel_Edit = () => this.setState({ openModel_Edit: true })

    handleChange = (e, { name, value }) => this.setState({
        form: {
            ...this.state.form,
            [name]: value
        }
    })

    // 

    DeleteData = () => {
        let { dataProcess, keyData, data } = this.state
        if (dataProcess) {
            let items = fetchapiDelete('vh3/delete_data', { dataProcess })
            items.then(res => res.json())
                .then(res => this.setState({ messageText: res.affectedRows })
                )
            data.splice(keyData, 1)
            // console.log(data)
            data.sort()
            this.setState({ data: data, openModel_Del: false, openModel_message: true, dataProcess: null })


        }
    }

    getmin = (times) => {

        return moment(times).unix()
    }

    validation = () => {
        let { form: { des,
            check_out,
            data_time_out,
            check_in,
            data_time_in,
            rm_no,
            litr,
            bath,
            expressway,
            carpark,
            otherexpenses,
            // tax_id,
            // branch,
            // tax_inv_no
        } } = this.state
        // console.log(tax_id, branch, tax_inv_no)

        this.setState({
            isOpen: {
                pop_des: (des === '' || des.length === 0 || des === null) ? true : false,
                pop_check_out: (check_out === '' || check_out.length === 0 || check_out === null) ? true : false,
                pop_data_time_out: (data_time_out === '' || data_time_out.length === 0 || data_time_out === null || moment(data_time_out).format('YYYY') > moment().format('YYYY')) ? true : false,
                pop_check_in: (check_in === '' || check_in.length === 0 || check_in === null || parseInt(check_in) < parseInt(check_out)) ? true : false,
                pop_data_time_in: (data_time_in === '' || data_time_in.length === 0 || data_time_in === null || this.getmin(data_time_out) > this.getmin(data_time_in) || moment(data_time_in).format('YYYY') > moment().format('YYYY')) ? true : false,
                // pop_tax_id: (tax_id.length !== 13),
                // pop_branch: (branch.length !== 5),
                // pop_tax_inv_no: (tax_inv_no.length === 0) ? true : false
            },
            form: {
                ...this.state.form,
                rm_no: (rm_no === '' || rm_no.length === 0 || rm_no === null) ? 0 : rm_no,
                litr: (litr === '' || litr.length === 0 || litr === null) ? 0 : litr,
                bath: (bath === '' || bath.length === 0 || bath === null) ? 0 : bath,
                expressway: (expressway === '' || expressway.length === 0 || expressway === null) ? 0 : expressway,
                carpark: (carpark === '' || carpark.length === 0 || carpark === null) ? 0 : carpark,
                otherexpenses: (otherexpenses === '' || otherexpenses.length === 0 || otherexpenses === null) ? 0 : otherexpenses
            }
        }, () => {
            let { form: { rm_no } } = this.state
            this.setState({
                rm_no_contorl: (rm_no === 0) ? true : false
            }, () => {
                let { rm_no_contorl, form: {
                    data_time_out,
                    data_time_in,
                    time_in,
                    time_outs,
                    litr,
                    bath,
                    tax_id,
                    branch,
                    tax_inv_no

                } } = this.state

                // console.log("object")

                let a = moment(`${data_time_out} ${time_outs}`, "YYYY-MM-DD HH:mm").valueOf()
                let b = moment(`${data_time_in} ${time_in}`, "YYYY-MM-DD HH:mm").valueOf()
                let c = a > b

                // console.log(c)

                if (!rm_no_contorl) {
                    this.setState({
                        isOpen: {
                            pop_time_outs: c,
                            pop_time_in: c,
                            pop_litr: (litr === 0),
                            pop_bath: (bath === 0),
                            pop_tax_id: (tax_id.length !== 13),
                            pop_branch: (branch.length !== 5),
                            pop_tax_inv_no: (tax_inv_no.length === 0) ? true : false
                        }
                    }, () => {
                        let { isOpen: { pop_des,
                            pop_time_outs,
                            pop_time_in,
                            pop_check_out,
                            pop_data_time_out,
                            pop_check_in,
                            pop_data_time_in,
                            pop_rm_no,
                            pop_litr,
                            pop_bath,
                            pop_tax_id,
                            pop_branch,
                            pop_tax_inv_no
                        } } = this.state

                        if (!pop_des && !pop_check_out && !pop_data_time_out && !pop_check_in && !pop_data_time_in && !pop_time_outs && !pop_time_in
                            && !pop_rm_no && !pop_litr && !pop_bath && !pop_tax_id && !pop_branch && !pop_tax_inv_no) {
                            // console.log("object")
                            this.changeDesc()
                        }
                    })
                }
                else {
                    // console.log("object")
                    // console.log(c)
                    this.setState({
                        isOpen: {
                            ...this.state.isOpen,
                        pop_time_outs: c,
                        pop_time_in: c
                        }
                    }, () => {
                        let { isOpen: { pop_des,
                            pop_check_out,
                            pop_data_time_out,
                            pop_check_in,
                            pop_data_time_in,
                            pop_rm_no,
                            pop_time_outs,
                            pop_time_in
                        } } = this.state
                        // console.log(pop_time_in)
                        // console.log(pop_time_outs)

                        if (!pop_des && !pop_check_out && !pop_data_time_out && !pop_check_in && !pop_data_time_in && !pop_rm_no && !pop_time_outs && !pop_time_in) {
                            // console.log("object 2")
                            this.changeDesc()

                        }
                    })
                }
            })
        })

    }

    changeDesc = () => {
        // console.log(this.props)
        let { post: { data: { search, sumnow, yearnow } } } = this.props
        let { data, form, keyData } = this.state
        // console.log(keyData)
        // console.log(form.des.replace(/'/gi, '\''))
        data[keyData]['des'] = form.des.replace(/'/gi, '\'')
        // console.log(data)
        const updataArray = [...data]
        updataArray[keyData] = form
        // console.log(updataArray[keyData])

        // this.setState({ data: updataArray })
        let items = fetchapiUpData('vh3/update_data', updataArray[keyData])

        items.then(res => res.json())
            .then(res =>
                this.setState({
                    messageIsOpenPositive: false,
                    messageTextUpdata: `Updata ข้อมูลแล้ว : ${res.affectedRows} `,
                    // data: updataArray,
                    dataEdit: null
                }, () => {
                    // console.log(search, sumnow, yearnow)
                    let itemsData = fetchapi('vh3/get_load_description', { search: search.replace(/ /gi, ""), process: 'summerycar', sumnow: sumnow, yearnow: yearnow })
                    itemsData.then(res => res.json())
                        .then(res => this.setState({
                            data: res
                        }))
                })
            )
        setTimeout(() => {
            this.setState({
                messageIsOpenPositive: true
            })
        }, 3000)

    }

    setload = (data, key) => {

        this.setState({
            dataEdit: data,
            // openModel_Edit: true,
            keyData: key,
            form: {
                id: data.id,
                user_empid: data.user_empid,
                user_fnamet: data.user_fnamet,
                user_lnamet: data.user_lnamet,
                des: data.des,
                check_out: data.check_out,
                data_time_out: moment(data.data_time_out, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                time_outs: moment(data.data_time_out).utcOffset('+00:00').format('HH:mm'),
                check_in: data.check_in,
                data_time_in: moment(data.data_time_in, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                time_in: moment(data.data_time_in).utcOffset('+00:00').format('HH:mm'),
                rm_no: data.rm_no,
                litr: data.litr,
                bath: data.bath,
                expressway: data.expressway,
                carpark: data.carpark,
                otherexpenses: data.otherexpenses,
                car_licence: data.car_licence,
                tax_id: data.tax_id,
                branch: data.branch,
                tax_inv_no: data.tax_inv_no
            }
        })
    }


    // componentWillUpdate(nextProps, nextState) {
    //     console.log(nextState)
    // }

    componentWillReceiveProps(nextProps) {

        if (JSON.stringify(nextProps.post.data) !== '{}') {
            // console.log(nextProps.post.data)
            let header = fetchapi('car/get_car/', { search: nextProps.post.data.search.replace(/ /gi, "") })
            header.then(res => res.json())
                .then(res => this.setState({
                    header: (res === '' || res.length === 0 || res === null) ? [] : res[0], messageIsOpenNegative: (res === '' || res.length === 0 || res === null) ? false : true, messageText: (res === '' || res.length === 0 || res === null) ? 'ไม่มีข้อมูลรถคันนี้' : ''
                }))

            let items = fetchapi('vh3/get_load_description', { search: nextProps.post.data.search.replace(/ /gi, ""), process: 'summerycar', sumnow: nextProps.post.data.sumnow, yearnow: nextProps.post.data.yearnow })
            // let items = fetchapi('vh3/get_special', { search: nextProps.post.data.search.replace(/ /gi, ""), process: 'summerycar', sumnow: nextProps.post.data.sumnow, yearnow: nextProps.post.data.yearnow })
            // get_special
            items.then(res => res.json())
                // .then(res => console.log(res))
                .then(res => this.setState({
                    dataEdit: null,
                    data: (res === '' || res.length === 0 || res === null) ? [] : res, messageIsOpenNegative: (res === '' || res.length === 0 || res === null) ? false : true, messageText: (res === '' || res.length === 0 || res === null) ? 'ไม่มีข้อมูลเดือนนี้' : ''
                }))
        }
        else {
            this.setState({ data: [], header: [] })
        }
    }

    renderViewEdit() {
        let { dataEdit, isOpen: {
            pop_des,
            pop_check_out,
            pop_data_time_out,
            pop_time_outs,
            pop_check_in,
            pop_data_time_in,
            pop_time_in,
            pop_rm_no,
            pop_litr,
            pop_bath,
            pop_tax_id,
            pop_branch,
            pop_tax_inv_no
        },
            form: { des, check_out, data_time_out, time_outs, check_in, data_time_in,
                time_in, rm_no, litr, bath, expressway, carpark, otherexpenses, tax_id, branch, tax_inv_no }
        } = this.state
        if (dataEdit) {
            return (
                <Form>
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="des"
                            value={des}
                            onChange={this.handleChange}
                            label="OBJECTIVE / DESCRIPTION"
                            placeholder="OBJECTIVE / DESCRIPTION"
                            required
                            autoFocus
                            error={pop_des}
                        />
                    </Form.Group>
                    <Divider />
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="check_out"
                            value={check_out}
                            onChange={this.handleChange}
                            label="CHECK OUT"
                            placeholder="CHECK OUT"
                            required
                            error={pop_check_out}
                            type="number"
                        />
                        <Form.Input
                            required
                            fluid
                            name="data_time_out"
                            value={data_time_out}
                            type="date"
                            data-date-format="DD MMMM YYYY"
                            onChange={this.handleChange}
                            label="DATE-TIME-OUT"
                            error={pop_data_time_out}
                        />
                        <Form.Input
                            required
                            fluid
                            name="time_outs"
                            value={time_outs}
                            type="time"
                            data-date-format="DD MMMM YYYY"
                            onChange={this.handleChange}
                            label="TIME-OUT"
                            error={pop_time_outs}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Input
                            required
                            fluid
                            name="check_in"
                            value={check_in}
                            onChange={this.handleChange}
                            label="CHECK IN"
                            placeholder="CHECK IN"
                            error={pop_check_in}
                            type="number"
                        />
                        <Form.Input
                            required
                            fluid
                            name="data_time_in"
                            value={data_time_in}
                            type="date"
                            data-date-format="DD MMMM YYYY"
                            onChange={this.handleChange}
                            label="DATE-TIME-IN"
                            error={pop_data_time_in}
                        />
                        <Form.Input
                            required
                            fluid
                            name="time_in"
                            value={time_in}
                            type="time"
                            data-date-format="DD MMMM YYYY"
                            onChange={this.handleChange}
                            label="TIME-IN"
                            error={pop_time_in}
                        />
                    </Form.Group>


                    <Divider />
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="rm_no"
                            value={rm_no}
                            label="RM No."
                            placeholder="RM No."
                            onChange={this.handleChange}
                            type="number"
                            error={pop_rm_no}
                        />
                        <Form.Input
                            fluid
                            name="litr"
                            value={litr}
                            label="LITR"
                            placeholder="LITR"
                            onChange={this.handleChange}
                            type="number"
                            error={pop_litr}
                        />
                        <Form.Input
                            fluid
                            name="bath"
                            value={bath}
                            label="BATH"
                            placeholder="BATH"
                            onChange={this.handleChange}
                            type="number"
                            error={pop_bath}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="expressway"
                            value={expressway}
                            label="Expressway"
                            placeholder="Expressway"
                            onChange={this.handleChange}
                            type="number"
                        />
                        <Form.Input
                            fluid
                            name="carpark"
                            value={carpark}
                            label="Carpark"
                            placeholder="Carpark"
                            onChange={this.handleChange}
                            type="number"
                        />
                        <Form.Input
                            fluid
                            name="otherexpenses"
                            value={otherexpenses}
                            label="Otherexpenses"
                            placeholder="Otherexpenses"
                            onChange={this.handleChange}
                            type="number"
                        />
                    </Form.Group>
                    <Divider />
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            name="tax_id"
                            value={tax_id}
                            label="เลขประจำตัวผู้เสียภาษี (TAX ID)"
                            placeholder="TAX ID"
                            onChange={this.handleChange}
                            maxLength={13}
                            // minLength={13}
                            error={pop_tax_id}
                            type="number"
                        />
                        <Form.Input
                            fluid
                            name="branch"
                            value={branch}
                            label="เลขที่สาขา ( Head Office ให้ใส่ 00000 )"
                            placeholder="เลขที่สาขา"
                            onChange={this.handleChange}
                            maxLength={5}
                            error={pop_branch}
                            type="number"
                        />
                        <Form.Input
                            fluid
                            name="tax_inv_no"
                            value={tax_inv_no}
                            label="เลขที่ใบกำกับภาษี (TAX INV NO.)"
                            placeholder="TAX INV NO."
                            onChange={this.handleChange}
                            error={pop_tax_inv_no}
                        />
                    </Form.Group>
                    <Divider />
                    <Form.Group>
                        <Button color='green' onClick={() => { this.validation() }}>
                            <Icon name='checkmark' /> Save Table
      </Button>
                        <Button color='red' onClick={() => { this.setState({ dataEdit: null }) }}>
                            <Icon name='close' /> Cancel
      </Button>
                    </Form.Group>

                </Form>
            )

        }

    }
    // componentWillUpdate(nextProps, nextState) {
    //     console.log(nextState)
    // }

    renderData() {
        let { data,
            openModel_Del,
        } = this.state

        // console.log(data)
        if (data) {
            return (
                data.map((number, key) => (
                    <Table.Row style={{ backgroundColor: (number.bank_id) ? '#22aaaa50' : '#FF555550' }} key={key} >
                        <Table.Cell textAlign='center'>{key + 1}</Table.Cell>
                        <Table.Cell collapsing>{number.user_fnamet + ' ' + number.user_lnamet}</Table.Cell>
                        <Table.Cell fixed="true">{number.des}</Table.Cell>
                        <Table.Cell>{moment(number.data_time_out, 'YYYY-MM-DDTHH:mm:00').format('DD/MM/YYYY')}</Table.Cell>
                        <Table.Cell>{moment(number.data_time_out, 'YYYY-MM-DDTHH:mm:00').format('HH:mm')}</Table.Cell>
                        <Table.Cell>{this.formatNumber(number.check_out)}</Table.Cell>
                        <Table.Cell>{moment(number.data_time_in, 'YYYY-MM-DDTHH:mm:00').format('DD/MM/YYYY')}</Table.Cell>
                        <Table.Cell>{moment(number.data_time_in, 'YYYY-MM-DDTHH:mm:00').format('HH:mm')}</Table.Cell>
                        <Table.Cell>{this.formatNumber(number.check_in)}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.check_in - number.check_out)}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.rm_no)}</Table.Cell>
                        <Table.Cell textAlign='right'>{number.litr}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.bath)}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.expressway)}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.carpark)}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.formatNumber(number.otherexpenses)}</Table.Cell>

                        <Table.Cell collapsing>
                            <Popup
                                trigger={<Button color='blue' size="mini" icon="edit" onClick={() => this.setload(data[key], key)} ></Button>
                                }
                                content="Edit" />

                            {/* //////////////////////////////////////////// */}

                            < Modal
                                open={openModel_Del}
                                onClose={this.closeModel_Del}
                                trigger={< Button color='red' size="mini" icon="cancel" onClick={() => this.setState({ dataProcess: data[key].id, keyData: key, openModel_Del: true })}></Button >}

                            > <Header icon='archive' content='Confirm the delete data?' />
                                <Modal.Content>
                                    <p>ยืนยันการลบข้อมูล?</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='red' onClick={() => this.setState({ openModel_Del: false })}>
                                        <Icon name='remove' /> No
      </Button>
                                    <Button color='green' onClick={() => this.DeleteData()}>
                                        <Icon name='checkmark' /> Yes
      </Button>
                                </Modal.Actions>
                            </Modal >
                        </Table.Cell >
                    </Table.Row >
                ))
            )
        }
    }

    renderFoots = () => {
        let { data } = this.state
        // console.log(data)

        if (data.length !== 0) {


            const numbers = data.map(e => {

                const num = {
                    sum_working_distance: Number(e.check_in) - Number(e.check_out),
                    sum_litr: Number(e.litr),
                    sum_baht: Number(e.bath),
                    sum_expressway: Number(e.expressway),
                    sum_carpark: Number(e.carpark),
                    sum_otherexpenses: Number(e.otherexpenses)
                }

                return num

            })
            // let to = data.length - 1
            // let sum = data[to].check_in - data[0].check_out
            // let sum_working_distance = numbers.map(val => val.sum_working_distance).reduce((sum, num) => sum + num)
            // // console.log(sum)
            // console.log(sum_working_distance)

            // if (sum === sum_working_distance) {
            //     this.setState({ messageIsOpenNegative: false, messageText: `จำนวนเลขไมล์รวมไม่ถูกต้อง รบกวนตรวจสอบด้วยครับ ${sum} != ${sum_working_distance}` })
            // }


            return (
                <Table.Footer>
                    <Table.Row >
                        <Table.HeaderCell colSpan='3' />
                        <Table.HeaderCell colSpan='6' textAlign='center'>Grand Total</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_working_distance).reduce((sum, num) => sum + num))}</Table.HeaderCell>
                        <Table.HeaderCell />
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_litr).reduce((sum, num) => sum + num).toFixed(3))}</Table.HeaderCell>
                        {/* <Table.HeaderCell textAlign='right'>5940.3</Table.HeaderCell> */}
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_baht).reduce((sum, num) => sum + num).toFixed(2))}</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_expressway).reduce((sum, num) => sum + num))}</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_carpark).reduce((sum, num) => sum + num))}</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{this.formatNumber(numbers.map(val => val.sum_otherexpenses).reduce((sum, num) => sum + num))}</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Footer>
            )

        }
    }
    formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    renderPDF = () => {
        let { data, header } = this.state
        if (data.length !== 0 && header.length !== 0) {
            return (
                <div>

                    <PDF header={header} data={data} />

                    <Divider />
                </div>
            )
        }

    }


    render() {
        // console.log(this.state)
        let { messageText, openModel_message, messageIsOpenPositive, messageIsOpenNegative, messageTextUpdata } = this.state

        return (
            <div>
                {/* {(dataTable && dataTable.length > 0) ? dataTable : null} */}
                <Segment color="red">
                    <Message hidden={messageIsOpenPositive} positive>{messageTextUpdata}</Message>
                    <Message hidden={messageIsOpenNegative} negative>{messageText}</Message>
                    {this.renderViewEdit()}
                    {this.renderPDF()}
                    <Form>
                        <Form.Group style={FromStyleGroup}>
                            <Table celled selectable size='small'>
                                <Table.Header>
                                    <Table.Row >
                                        <Table.HeaderCell rowSpan='2' textAlign='center' >No.</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2' textAlign='center' >USER NAME</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2'>
                                            OBJECTIVE / PLACE / DESCRIPTION
    </Table.HeaderCell>
                                        <Table.HeaderCell colSpan='3' textAlign='center'>CHECK OUT</Table.HeaderCell>
                                        {/* <Table.HeaderCell rowSpan='2'>DATE-TIME</Table.HeaderCell> */}
                                        <Table.HeaderCell colSpan='3' textAlign='center'>CHECK IN</Table.HeaderCell>
                                        {/* <Table.HeaderCell rowSpan='2'>DATE-TIME</Table.HeaderCell> */}
                                        <Table.HeaderCell rowSpan='2' textAlign='center'>WORKING DISTANCE KM.</Table.HeaderCell>
                                        <Table.HeaderCell colSpan='3' textAlign='center'>REFUEL</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2'>Expressway</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2'>Carpark</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2'>Otherexpenses</Table.HeaderCell>
                                        <Table.HeaderCell rowSpan='2' />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell>D/M/Y</Table.HeaderCell>
                                        <Table.HeaderCell>TIME</Table.HeaderCell>
                                        <Table.HeaderCell>RM No.</Table.HeaderCell>
                                        <Table.HeaderCell>D/M/Y</Table.HeaderCell>
                                        <Table.HeaderCell>TIME</Table.HeaderCell>
                                        <Table.HeaderCell>RM No.</Table.HeaderCell>
                                        <Table.HeaderCell>RM NO.</Table.HeaderCell>
                                        <Table.HeaderCell>LITR</Table.HeaderCell>
                                        <Table.HeaderCell>BATH</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.renderData()}
                                </Table.Body>
                                {this.renderFoots()}
                            </Table>
                        </Form.Group>
                        <Modal
                            open={openModel_message}
                            onClose={this.closeModel_Message}
                        > <Header icon='checkmark' content='Delete successfully' />
                            <Modal.Content>
                                ลบข้อมูลออกแล้ว : {messageText} Record
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='green' onClick={() => { this.setState({ openModel_message: false }) }}>
                                    <Icon name='checkmark' /> Yes
      </Button>
                            </Modal.Actions>
                        </Modal>
                    </Form>
                </Segment>
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

    // searchment: (datas) => dispatch({ type: Action.SEARCH, text: "SEARCH Redux", data: datas }),
    // clearment: () => dispatch({ type: Action.CLEAR, text: "CLEAR Redux" })
})

export default connect(mapStateToProps, mapDispatchToProps)(DataTable)
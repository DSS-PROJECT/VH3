import React, { Component } from "react";
import {
  Button,
  Container,
  //   Divider,
  Header,
  Segment,
  Icon,
  Dropdown,
  Grid,
  Table,
  Input
} from "semantic-ui-react/dist/commonjs";

import moment from "moment";

import { fetchapi, fetchapiGet, fetchapiUpData } from "../config/index";


export default class Analysis extends Component {
  constructor(props) {
    super(props);
    this.handleChangeDropdown = this.handleChangeDropdown.bind(this);

    this.state = {
      options: [],
      value: "",
      dis_bank: [],
      datalist: [],

      loop_A: null,
      loop_B: 0,
      sumTotal: 0,
      Vh3_Total_amount: 0,
      pause: false,
      inputOut: null,
      inputIn: null,
      valueOut: null,
      valueIn: null,
      filter: {
        diff: false
      }

    };
    this.refs = {}
  }

  handleChange = this.handleChange.bind(this)
  handleChangeDropdown = (e, { value }) => this.setState({ value });
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });


  escFunction(event) {

    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      console.log("ESC");
      // let { dis_bank, loop_A, inputOut, inputIn, valueOut, valueIn
      // } = this.state;
      // dis_bank[loop_A].objectVH3[inputOut].data_time_out = valueOut
      // dis_bank[loop_A].objectVH3[inputIn].data_time_in = valueIn

      // this.setState({ dis_bank, valueOut: null, valueIn: null, inputOut: null, inputIn: null })


    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  Option_MonthCode = data => {

    // console.log(data)
    data.map((items, key) => {
      return this.setState({
        options: [
          ...this.state.options,
          {
            key: key,
            text: items.month_code,
            value: items.month_code
          }
        ]
      });
    });
  };

  handleChange(event, loop_A, loop_B) {
    console.log(event.target.value);
    let { dis_bank } = this.state;
    if (event.target.name === 'valueOut') {
      dis_bank[loop_A].objectVH3[loop_B].data_time_out = event.target.value
    } else if (event.target.name === 'valueIN') {
      dis_bank[loop_A].objectVH3[loop_B].data_time_in = event.target.value
    }
    this.setState({
      dis_bank
    })
  }

  keyPressed(event, id) {
    console.log(event.key)
    if (event.key === "Enter") {
      // this.submitMessage()
      // console.log("event Enter")

      if (event.target.name === 'valueOut') {
        // console.log("TestInputOut")
        // console.log(event.target.value)
        // console.log(id)
        this.setState({
          InputOut: null
        })
      }
      else if (event.target.name === 'valueIN') {
        // console.log("TestInputIN")
        // console.log(event.target.value)
        // console.log(id)
        this.setState({
          InputIn: null
        })
      }
      // this.setState({})
    }
    // else if (event.key === "Escape") {
    //   console.log("object")

    //  }
  }

  OnShowData = () => {
    let { value } = this.state;

    fetchapi("resource/showData", {
      month_code: value
    })
      .then(res => res.json())
      .then(res =>
        this.setState(
          {
            dis_bank: res,
            sumTotal: res.map(items => items.SUM_Total_Amount)
              .reduce((sum, num) => sum + num).toFixed(2),
            Vh3_Total_amount: res.map(items => items.Vh3_Total_amount)
              .reduce((sum, num) => sum + num).toFixed(2),
          }))
  }


  OnShowDatalist = (FleetCard, index) => {
    let { value } = this.state;
    fetchapi("resource/showData_Bank-VH3", {
      month_code: value,
      Fleet_Card_Num: FleetCard
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res)
        let { dis_bank } = this.state;
        dis_bank[index].objectBank = res.bank;
        dis_bank[index].objectVH3 = res.vh3;

        this.setState({
          dis_bank,
          loop_A: index
        })

      })
  }

  OnProcessAnalysis = () => {
    this.setState({ pause: false }, () => {
      let { value } = this.state;
      fetchapi("resource/sum_total_amount", {
        month_code: value
      })
        .then(res => res.json())
        .then(res =>
          this.setState(
            {
              loop_A: 0,
              dis_bank: res,
              sumTotal: res
                .map(items => items.SUM_Total_Amount)
                .reduce((sum, num) => sum + num).toFixed(2)
            },
            () => {
              this.loop_data();
            }
          )
        );
    });
  };



  loop_data() {
    let { dis_bank, loop_A, value } = this.state;
    console.log("loop_data")
    const obnum = dis_bank[loop_A];
    if (obnum) {
      fetchapi("resource/list_fleet_card", {
        month_code: value,
        Fleet_Card_Num: dis_bank[loop_A].Fleet_Card_Num
      }).then(res =>
        res.json().then(res => {
          let { loop_A, dis_bank } = this.state;
          dis_bank[loop_A] = { ...dis_bank[loop_A], objectBank: res };
          this.setState({ dis_bank }, () => {
            this.loop_object();
          });
        })
      );
    }
  }

  loop_object() {
    let { value, dis_bank, loop_A, loop_B } = this.state;

    const qnum = dis_bank[loop_A].objectBank[loop_B];
    if (!qnum) {
      this.setState({ loop_A: loop_A + 1, loop_B: 0 }, () => {
        return this.loop_data();
      });
    } else {
      fetchapi("resource/checkTotal", {
        id_bank: qnum.id,
        month_code: value,
        Fleet_Card_Num: qnum.Fleet_Card_Num,
        Transaction_Date: qnum.Transaction_Date,
        Time: qnum.Time,
        Total_Amount: qnum.Total_Amount
      })
        .then(res => res.json())
        .then(res => {
          fetchapi("resource/checkVH3", {
            month_code: value,
            Fleet_Card_Num: dis_bank[loop_A].objectBank[loop_B].Fleet_Card_Num,
          })
            .then(ress => ress.json())
            .then(ress => {
              console.log(ress)
              let { loop_A, dis_bank } = this.state;
              dis_bank[loop_A] = {
                ...dis_bank[loop_A],
                objectVH3: ress,

              };
              // console.log(dis_bank);

              this.setState({ dis_bank })
              // console.log(dis_bank)
            })
          this.setOjectLoop(res);
        });
    }
  }

  setOjectLoop(res) {
    let { value, loop_A, loop_B, dis_bank, pause } = this.state;
    dis_bank[loop_A].objectBank[loop_B] = {
      ...dis_bank[loop_A].objectBank[loop_B],
      num: res,
      vh3_id: res
    };

    if (res) {
      dis_bank[loop_A].Vh3_Total_amount =
        parseFloat(dis_bank[loop_A].Vh3_Total_amount || 0) +
        parseFloat(dis_bank[loop_A].objectBank[loop_B].Total_Amount);
    }

    // console.log(value)
    // console.log(dis_bank[loop_A].objectBank[loop_B].Fleet_Card_Num)





    this.setState(
      {
        dis_bank,
        loop_B: loop_B + 1,
        Vh3_Total_amount: dis_bank
          .map(items => parseFloat(items.Vh3_Total_amount || 0))
          .reduce((sum, num) => sum + num)
          .toFixed(2)
      },
      () => {
        if (pause) {
          return false;
        } else {
          this.loop_object();
        }
      }
    );
  }

  componentDidMount = () => {
    fetchapiGet("resource/month_code")
      .then(res => res.json())
      .then(res => this.Option_MonthCode(res));
    document.addEventListener("keydown", this.escFunction, false);



  };


  renderDataSum = () => {
    let { dis_bank, loop_A, filter: { diff } } = this.state;
    if (diff) {
      dis_bank = dis_bank.filter((item) => (item.SUM_Total_Amount != item.Vh3_Total_amount))
    }
    return dis_bank.map((items, key) =>
      <Table.Row key={key}   >
        <Table.Cell>
          {items.Fleet_Card_Num}
        </Table.Cell>
        <Table.Cell>
          {items.Unit}
        </Table.Cell>
        <Table.Cell>
          <b style={{ color: (items.SUM_Total_Amount == items.Vh3_Total_amount) ? 'green' : '#FF5555' }}>{items.SUM_Total_Amount}</b>
        </Table.Cell>
        <Table.Cell>
          <b style={{ color: (items.SUM_Total_Amount == items.Vh3_Total_amount) ? 'green' : '#FF5555' }}>{items.Vh3_Total_amount ? items.Vh3_Total_amount : 0}</b>
        </Table.Cell>
        <Table.Cell style={{ textAlign: 'center' }} >
          {loop_A == key ? <Icon name="search" /> : <Button size='mini' color="blue" onClick={() => { this.OnShowDatalist(items.Fleet_Card_Num, key) }}><Icon name="search" /> View</Button>}
        </Table.Cell>
      </Table.Row >
    );
  };

  renderVH3listSum = () => {
    let { dis_bank, loop_A, inputOut, inputIn } = this.state;

    return dis_bank[loop_A] && dis_bank[loop_A].objectVH3
      ? dis_bank[loop_A].objectVH3.map((items, key) =>
        <Table.Row style={{ backgroundColor: (items.bank_id) ? '#22aaaa50' : '#FF555550' }} key={key} >
          <Table.Cell>
            {key + 1}
          </Table.Cell>
          <Table.Cell colSpan={2} onDoubleClick={() => this.setState({ inputOut: key, inputIn: null, valueOut: moment(items.data_time_out).format("YYYY-MM-DDTHH:mm:ss") })}>
            {(inputOut == key) ?
              <>
                <Input
                  type="datetime-local"
                  name='valueOut'
                  style={{ fontSize: 10 }}
                  onKeyPress={(e) => this.keyPressed(e, items.id)}
                  onChange={(e) => this.handleChange(e, loop_A, key)}
                  value={moment(items.data_time_out).format("YYYY-MM-DDTHH:mm:ss")} />
              </>

              :
              <>
                {moment(items.data_time_out).utcOffset('+00:00').format("DD/MM/YYYY HH:mm ")}{' '}<Icon name="calendar" />
                {/* {console.log(items.data_time_out)}
                {console.log(items.data_time_in)} */}
              </>
            }

          </Table.Cell>
          <Table.Cell colSpan={2} onDoubleClick={() => this.setState({ inputIn: key, inputOut: null, valueIn: moment(items.data_time_in).format("YYYY-MM-DDTHH:mm:ss") })}>
            {(inputIn == key) ?
              <>
                <Input
                  type="datetime-local"
                  name='valueIN'
                  style={{ fontSize: 10 }}
                  onKeyPress={(e) => this.keyPressed(e, items.id)}
                  onChange={(e) => this.handleChange(e, loop_A, key)}
                  value={moment(items.data_time_in).format("YYYY-MM-DDTHH:mm:ss")} />
              </>
              :
              <>
                {moment(items.data_time_in).utcOffset('+00:00').format("DD/MM/YYYY HH:mm")}{' '}<Icon name="calendar" />
              </>
            }

          </Table.Cell>
          <Table.Cell>
            {items.bath}
          </Table.Cell>
          {/* <Table.Cell> */}

          {/* {items.num ? <Icon circular inverted color='teal' name='check' /> : <Icon circular inverted color='red' name='close' />} */}
          {/* </Table.Cell> */}
        </Table.Row >
      )
      : null;

  }

  renderlistSum = () => {
    let { dis_bank, loop_A } = this.state;

    // console.log(dis_bank[loop_A])

    return dis_bank[loop_A] && dis_bank[loop_A].objectBank
      ? dis_bank[loop_A].objectBank.map((items, key) =>
        <Table.Row style={{ backgroundColor: (items.vh3_id) ? '#22aaaa50' : '#FF555550' }} key={key} >
          <Table.Cell>
            {key + 1}
          </Table.Cell>
          {/* <Table.Cell>
              {items.Fleet_Card_Num}
            </Table.Cell> */}
          <Table.Cell colSpan={2}>
            {moment(items.Transaction_Date).utcOffset('+00:00').format("DD/MM/YYYY")} {items.Time}
          </Table.Cell>
          <Table.Cell>
            {items.Total_Amount}
          </Table.Cell>
          {/* <Table.Cell>

            {items.num ? <Icon circular inverted color='teal' name='check' /> : <Icon loading color='red' name='spinner' />}
          </Table.Cell> */}
        </Table.Row>
      )
      : null;
  };

  renderFooter() {
    let { Vh3_Total_amount, sumTotal } = this.state;

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell textAlign="right">Total_SUM</Table.HeaderCell>

          <Table.HeaderCell>
            Bank
            <hr />
            {sumTotal}
          </Table.HeaderCell>
          <Table.HeaderCell>
            VH3
            <hr />
            {Vh3_Total_amount}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <a href="javascript:void(0)" onClick={() => this.setState({ loop_A: null, filter: { ...this.state.filter, diff: !this.state.filter.diff } })} >Diff
            <hr />
              {sumTotal - Vh3_Total_amount}
            </a>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log(nextState)
  // }

  render() {
    let { options, value, dis_bank, loop_A } = this.state;
    console.log(dis_bank)

    return (
      <div  >
        <Container style={{ marginTop: "5em", width: '95%' }}>
          <Header size="huge">Analysis Data</Header>
          <Segment color="red">
            <Dropdown
              clearable
              value={value}
              selection
              search
              options={options}
              placeholder="Month Code"
              onChange={this.handleChangeDropdown}
              onSearchChange={this.handleSearchChange}
            />
            <Button color="blue" onClick={() => this.OnProcessAnalysis()}>
              <Icon name="recycle" />
              Analysis Data
            </Button>
            <Button color="red" onClick={() => this.setState({ pause: true })}>
              <Icon name="stop" />
              Pause
            </Button>
            <Button color="green" onClick={() => this.OnShowData()}>
              <Icon name="zoom" />
              ShowData
            </Button>
            <Button color="black" onClick={() => this.setState({
              // options: [],
              value: "",
              dis_bank: [],
              datalist: [],
              loop_A: null,
              loop_B: 0,
              sumTotal: 0,
              Vh3_Total_amount: 0,
              pause: false,
              inputOut: null,
              inputIn: null,
              valueOut: null,
              valueIn: null,
              filter: {
                diff: false
              }
            })}>
              <Icon name="reply" />
              ClearData
            </Button>
          </Segment>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column width={6}>
                <Grid.Row style={{ overflowY: "auto", height: 470 }}>
                  <Table celled padded compact fixed selectable size="small">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell style={{ width: 100 }}>Fleet Card Num</Table.HeaderCell>
                        <Table.HeaderCell style={{ width: 50 }}>
                          Unit
                        </Table.HeaderCell>
                        <Table.HeaderCell style={{ width: 70 }} >SUM Total Amount</Table.HeaderCell>
                        <Table.HeaderCell style={{ width: 70 }} >VH3 Total Amount</Table.HeaderCell>
                        <Table.HeaderCell style={{ width: 50 }}>
                          Status
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.renderDataSum()}
                    </Table.Body>
                  </Table>
                </Grid.Row>
                <Grid.Row style={{ marginTop: 10 }}>
                  <Table celled padded compact fixed selectable size="small">
                    {this.renderFooter()}
                  </Table>
                </Grid.Row>
              </Grid.Column>

              {/* BANK */}
              <Grid.Column width={10}>
                <Grid divided="vertically">
                  <Grid.Row style={{ overflowY: "auto", height: 573 }}>
                    <Grid.Column width={6}>
                      <Grid.Row >
                        <Table celled padded compact fixed selectable size="small">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan={1} style={{ width: 60 }} >BANK</Table.HeaderCell>
                              <Table.HeaderCell colSpan={3}>
                                {dis_bank && dis_bank.length > 0 && dis_bank[loop_A] && dis_bank[loop_A].Fleet_Card_Num
                                  ? dis_bank[loop_A].Fleet_Card_Num
                                  : "..."}  /   {dis_bank && dis_bank.length > 0 && dis_bank[loop_A] && dis_bank[loop_A].Fleet_Card_Num
                                    ? dis_bank[loop_A].licence_plate_num
                                    : "..."}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell style={{ width: 50 }}>
                                No.
                        </Table.HeaderCell>
                              {/* <Table.HeaderCell>Fleet Card Num</Table.HeaderCell> */}
                              <Table.HeaderCell style={{ width: 100 }} colSpan={2} >Transaction Date</Table.HeaderCell>
                              <Table.HeaderCell style={{ width: 50 }} >Total Amount</Table.HeaderCell>
                              {/* <Table.HeaderCell style={{ width: 50 }}>
                          Unit
                        </Table.HeaderCell> */}
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {this.renderlistSum()}
                          </Table.Body>
                        </Table>
                      </Grid.Row>
                    </Grid.Column>


                    {/* VH3 */}
                    <Grid.Column width={10}>
                      <Grid.Row >
                        <Table celled padded compact fixed selectable size="small">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan={1} style={{ width: 50 }} >VH3</Table.HeaderCell>
                              <Table.HeaderCell colSpan={5}>
                                {dis_bank && dis_bank.length > 0 && dis_bank[loop_A] && dis_bank[loop_A].Fleet_Card_Num
                                  ? dis_bank[loop_A].Fleet_Card_Num
                                  : "..."}  /  {dis_bank && dis_bank.length > 0 && dis_bank[loop_A] && dis_bank[loop_A].Fleet_Card_Num
                                    ? dis_bank[loop_A].licence_plate_num
                                    : "..."}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell style={{ width: 50 }}>
                                No.
                        </Table.HeaderCell>
                              <Table.HeaderCell style={{ width: 100 }} colSpan={2}>Date Out</Table.HeaderCell>
                              <Table.HeaderCell style={{ width: 100 }} colSpan={2}>Date In</Table.HeaderCell>
                              <Table.HeaderCell style={{ width: 50 }} >Total Amount</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {this.renderVH3listSum()}
                          </Table.Body>
                        </Table>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>


            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

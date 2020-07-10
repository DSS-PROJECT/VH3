import React, { Component, Children } from "react";
import { Segment, Icon, Form } from "semantic-ui-react/dist/commonjs";

import logo from "./../image/Picture1.png";

// .....
import { connect } from "react-redux";

import moment from "moment";
// import pic from './../image/Picture1.png'
import { fetchapi, fetchapiGet, fetchapiUpData } from "./../config/index";
// import _ from 'lodash'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: "THSarabunNew.ttf",
    bold: "THSarabunNew-Bold.ttf",
    italics: "THSarabunNew-Italic.ttf",
    bolditalics: "THSarabunNew-BoldItalic.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};

// const options_name = [
//   { key: "angular", text: "Angular", value: "angular" },
//   { key: "css", text: "CSS", value: "css" },
//   { key: "design", text: "Graphic Design", value: "design" },
//   { key: "ember", text: "Ember", value: "ember" },
//   { key: "html", text: "HTML", value: "html" },
//   { key: "ia", text: "Information Architecture", value: "ia" },
//   { key: "javascript", text: "Javascript", value: "javascript" },
//   { key: "mech", text: "Mechanical Engineering", value: "mech" },
//   { key: "meteor", text: "Meteor", value: "meteor" },
//   { key: "node", text: "NodeJS", value: "node" },
//   { key: "plumbing", text: "Plumbing", value: "plumbing" },
//   { key: "python", text: "Python", value: "python" },
//   { key: "rails", text: "Rails", value: "rails" },
//   { key: "react", text: "React", value: "react" },
//   { key: "repair", text: "Kitchen Repair", value: "repair" },
//   { key: "ruby", text: "Ruby", value: "ruby" },
//   { key: "ui", text: "UI Design", value: "ui" },
//   { key: "ux", text: "User Experience", value: "ux" },
// ];

// const getOptions = () => {

//   return new Promise((resolve, reject) => {
//     let items = fetchapiGet('resource/getOptions_cc')
//     items.then(res => res.json()
//       .then((res) => {
//         let arr = []
//         res.map(item => {
//           // console.log(item)
//           return arr.push({ key: item.cc_number, text: item.cc_number, value: item.cc_number })
//         })
//         // { return resolve(arr) }
//       }))

//   })

// .then(res => console.log(res))
// return { key: name, text: name, value: name }
// }

// const options = [
//   { key: "option1", value: "option1", text: "Option one" },
//   { key: "option2", value: "option2", text: "Option two" },
//   { key: "option3", value: "option3", text: "Option three" },
//   { key: "option4", value: "option4", text: "Option four" }
// ];

class PDF extends Component {
  constructor(props) {
    super(props);
    this.printPDF = this.printPDF.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    this.handleChangeDropdown_Multiple = this.handleChangeDropdown_Multiple.bind(
      this
    );
    this.toDataURL = this.toDataURL.bind(this);

    this.state = {
      remake: "",
      costcenter: "",
      left_licence: "",
      right_licence: "",
      pop_costcenter: false,
      value_multiple: [],
      value_costcenter: "",
      value: [],
      options: [],
      options_multiple: [],
    };
  }

  handleRef = (c) => {
    this.inputRef = c;
  };

  focus = () => {
    this.inputRef.focus();
  };

  handleChangeDropdown = (e, { value }) =>
    this.setState({ value_costcenter: value });
  handleChangeDropdown_Multiple = (e, { value }) =>
    this.setState({ value_multiple: value });
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  renderDataPDF = (data, number, to, num) => {
    // let alc = data.length + 1

    let DataTable = data.slice(number, to).map((item) => {
      // console.log(item.des.length)
      return [
        { text: `${num++}`, alignment: "center" },
        {
          text: `${item.user_fnamet} ${item.user_lnamet}`,
          alignment: "center",
        },
        { text: `${item.des}` },
        {
          text: `${moment(item.data_time_out)
            .utcOffset("+00:00")
            .format("DD/MM/YYYY")}`,
          alignment: "center",
        },
        {
          text: `${moment(item.data_time_out)
            .utcOffset("+00:00")
            .format("HH:mm")}`,
          alignment: "center",
        },
        { text: `${this.formatNumber(item.check_out)}`, alignment: "center" },
        {
          text: `${moment(item.data_time_in)
            .utcOffset("+00:00")
            .format("DD/MM/YYYY")}`,
          alignment: "center",
        },
        {
          text: `${moment(item.data_time_in)
            .utcOffset("+00:00")
            .format("HH:mm")}`,
          alignment: "center",
        },
        { text: `${this.formatNumber(item.check_in)}`, alignment: "center" },
        {
          text: this.formatNumber(`${item.check_in} ` - `${item.check_out}`),
          alignment: "center",
        },
        {
          text: `${
            item.rm_no === null || item.rm_no === 0
              ? ""
              : this.formatNumber(item.rm_no)
          }`,
          alignment: "center",
        },
        {
          text: `${item.litr === null || item.litr === 0 ? "" : item.litr}`,
          alignment: "center",
        },
        {
          text: `${
            item.bath === null || item.bath === 0
              ? ""
              : this.formatNumber(item.bath)
          }`,
          alignment: "center",
        },
        {
          text: `${
            item.expressway === null || item.expressway === 0
              ? ""
              : item.expressway
          }`,
          alignment: "center",
        },
        {
          text: `${
            item.carpark === null || item.carpark === 0 ? "" : item.carpark
          }`,
          alignment: "center",
        },
        {
          text: `${
            item.otherexpenses === null || item.otherexpenses === 0
              ? ""
              : item.otherexpenses
          }`,
          alignment: "center",
        },
      ];
    });
    return DataTable;
  };

  renderDataGrandTotal = (cal, data, total) => {
    // console.log(cal, data, total)
    if (cal === total) {
      const numbers = data.map((e) => {
        // console.log(e.check_in - e.check_out)

        const num = {
          sum_working_distance: e.check_in - e.check_out,
          sum_litr: e.litr,
          sum_baht: e.bath,
          sum_expressway: e.expressway,
          sum_carpark: e.carpark,
          sum_otherexpenses: e.otherexpenses,
        };

        return num;
      });
      return [
        [
          { text: "", colSpan: 3 },
          {},
          {},
          { text: "Grand Total", colSpan: 6, alignment: "center" },
          {},
          {},
          {},
          {},
          {},
          {
            text: `${this.formatNumber(
              numbers
                .map((val) => val.sum_working_distance)
                .reduce((sum, num) => sum + num)
            )}`,
            alignment: "center",
          },
          {},
          {
            text: `${numbers
              .map((val) => val.sum_litr)
              .reduce((sum, num) => sum + num)
              .toFixed(3)}`,
            alignment: "center",
          },
          {
            text: `${this.formatNumber(
              numbers
                .map((val) => val.sum_baht)
                .reduce((sum, num) => sum + num)
                .toFixed(2)
            )}`,
            alignment: "center",
          },
          {
            text: `${parseInt(
              numbers
                .map((val) => val.sum_expressway)
                .reduce((sum, num) => sum + num) +
                numbers
                  .map((val) => val.sum_carpark)
                  .reduce((sum, num) => sum + num) +
                numbers
                  .map((val) => val.sum_otherexpenses)
                  .reduce((sum, num) => sum + num)
            )}`,
            alignment: "center",
            colSpan: 3,
          },
          {},
          {},
        ],
      ];
      // ${this.formatNumber(numbers.map(val => val.sum_baht).reduce((sum, num) => sum + num))}
    }
  };

  renderDataSubPDF = (data, number, to, remake) => {
    const numbers = data.slice(number, to).map((e) => {
      const num = {
        sum_working_distance: e.check_in - e.check_out,
        sum_litr: e.litr,
        sum_baht: e.bath,
        sum_expressway: e.expressway,
        sum_carpark: e.carpark,
        sum_otherexpenses: e.otherexpenses,
      };

      return num;
    });
    // console.log(numbers.map(val => val.sum_baht).reduce((sum, num) => sum + num).toFixed(2))

    return [
      [
        { text: `** : ${remake.length === 0 ? "" : remake}`, colSpan: 3 },
        {},
        {},
        { text: "Sub Total", colSpan: 6, alignment: "center" },
        {},
        {},
        {},
        {},
        {},
        {
          text: `${this.formatNumber(
            numbers
              .map((val) => val.sum_working_distance)
              .reduce((sum, num) => sum + num)
          )}`,
          alignment: "center",
        },
        {},
        {
          text: `${numbers
            .map((val) => val.sum_litr)
            .reduce((sum, num) => sum + num)
            .toFixed(3)}`,
          alignment: "center",
        },
        {
          text: `${this.formatNumber(
            numbers
              .map((val) => val.sum_baht)
              .reduce((sum, num) => sum + num)
              .toFixed(2)
          )}`,
          alignment: "center",
        },
        {
          text: `${numbers
            .map((val) => val.sum_expressway)
            .reduce((sum, num) => sum + num)}`,
          alignment: "center",
        },
        {
          text: `${numbers
            .map((val) => val.sum_carpark)
            .reduce((sum, num) => sum + num)}`,
          alignment: "center",
        },
        {
          text: `${numbers
            .map((val) => val.sum_otherexpenses)
            .reduce((sum, num) => sum + num)}`,
          alignment: "center",
        },
      ],
    ];
  };

  renderLic = (left_licence, right_licence) => {
    return [
      {
        text: "Checked & Acknowledged by : …………………………………………………… Supervisor",
        absolutePosition: { x: 50, y: 540 },
      },
      {
        text: `${
          left_licence.length === 0
            ? "(                                              )"
            : `(        ${left_licence}        )`
        }`,
        absolutePosition: { x: 150, y: 550 },
      },
      {
        text: "Date : ……………………………………………",
        absolutePosition: { x: 145, y: 570 },
      },

      {
        text: "Approved by : …………………………………………………… Manager up",
        absolutePosition: { x: 600, y: 540 },
      },
      {
        text: `${
          right_licence.length === 0
            ? "(                                              )"
            : `(        ${right_licence}        )`
        }`,
        absolutePosition: { x: 645, y: 550 },
      },
      {
        text: "Date : ……………………………………………",
        absolutePosition: { x: 640, y: 570 },
      },
    ];
  };

  renderACF = () => {
    return [
      {
        text: "ACF-VH31",
        fontSize: 11,
        bold: true,
        absolutePosition: { x: 775, y: 570 },
      },
    ];
  };

  renderPageNumber = (num, to) => {
    // console.log(to)
    return [
      {
        text: `${num} / ${to}`,
        fontSize: 12,
        absolutePosition: { x: 790, y: 5 },
      },
    ];
  };
  renderCostCenter = (costcenter) => {
    return [
      {
        text: `CostCenter : ${costcenter}`,
        fontSize: 11,
        bold: true,
        absolutePosition: { x: 680, y: 23 },
      },
    ];
  };
  renderDate = (data) => {
    let last = data.length - 1;
    // console.log(data)
    // console.log(moment(data[0].data_time_in).utcOffset('+00:00').format('DD/MM/YYYY'))
    // console.log(data.length)
    // console.log(moment(data[last].data_time_in).utcOffset('+00:00').format('DD/MM/YYYY'))

    return [
      {
        text: `Date : ${moment(data[0].data_time_in)
          .utcOffset("+00:00")
          .format("DD/MM/YYYY")} - ${moment(data[last].data_time_in)
          .utcOffset("+00:00")
          .format("DD/MM/YYYY")}`,
        fontSize: 11,
        bold: true,
        absolutePosition: { x: 100, y: 23 },
      },
    ];
  };

  renderFrom = (
    data,
    header,
    costcenter,
    remake,
    left_licence,
    right_licence,
    value_costcenter
  ) => {
    let atm = 1;
    let numberfs = 0;
    let to = 16;
    let num = Math.ceil(data.length / to);
    // console.log(num)
    let content = [];

    for (
      let number = 1;
      number <= num;
      number++, numberfs += 16, atm += 16, to += 16
    ) {
      if (number === 1) {
        content.push(
          { text: "", style: "header" },
          {
            style: "tableExample",
            absolutePosition: { x: 15, y: 20 },
            table: {
              widths: [
                "2%",
                "11%",
                "37%",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                34,
                26,
                26,
                28,
                24,
                24,
                24,
              ],
              body: [
                [
                  {
                    text: "VEHICLE EXPENSES FORM ( VH 3 )",
                    style: "tableHeader",
                    colSpan: 16,
                    alignment: "center",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                ], //16
                [
                  {
                    image:
                      "data:image/png;base64,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",
                    style: "tableHeader",
                    rowSpan: 3,
                    colSpan: 3,
                    width: 200,
                    height: 50,
                    alignment: "center",
                  },
                  {},
                  {},
                  {
                    text: `Name: ${header.user_initt}${header.user_fnamet} ${
                      header.user_lnamet
                    }`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `EmployeeID : ${header.user_empid}`,
                    colSpan: 6,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Department : ${header.user_section}`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Division : ${header.user_deptn}`,
                    colSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {
                    text: `Register No. : ${header.licence_plate_num}`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Brand : ${
                      header.car_brand === null ? "" : header.car_brand
                    }`,
                    colSpan: 9,
                    alignment: `${
                      header.car_brand === null ? "left" : "center"
                    }`,
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Oil type : ${
                      header.car_fuel === null ? "" : header.car_fuel
                    }`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                // [{ text: '', colSpan: 16 }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                //Header
                [
                  {
                    text: "No.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "User Name",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "OBJECTIVE / PLACE / DESCRIPTION",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "CHECK OUT",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "CHECK IN",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "WORKING DISTANCE KM.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "REFUEL",
                    alignment: "center",
                    style: "tableHeader",
                    colSpan: 3,
                  },
                  {},
                  {},
                  {
                    text: "Expressway",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Carpark",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Other Express",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                ],
                [
                  {},
                  {},
                  {},
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  {},
                  { text: "RM NO.", alignment: "center", style: "tableHeader" },
                  { text: "LITR", alignment: "center", style: "tableHeader" },
                  { text: "BATH", alignment: "center", style: "tableHeader" },
                  {},
                  {},
                  {},
                ],
                ...this.renderDataPDF(data, numberfs, to, atm),
                ...this.renderDataSubPDF(data, numberfs, to, remake),
              ],
            },
          },
          ...this.renderLic(left_licence, right_licence),
          ...this.renderPageNumber(number, num),
          ...this.renderCostCenter(value_costcenter),
          ...this.renderDate(data),
          ...this.renderACF()
        );
      } else if (number === num) {
        content.push(
          { text: "", style: "header", pageBreak: "before" },
          {
            style: "tableExample",
            absolutePosition: { x: 15, y: 20 },
            table: {
              widths: [
                "2%",
                "11%",
                "37%",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                34,
                26,
                26,
                28,
                24,
                24,
                24,
              ],
              body: [
                [
                  {
                    text: "VEHICLE EXPENSES FORM ( VH 3 )",
                    style: "tableHeader",
                    colSpan: 16,
                    alignment: "center",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                ], //16
                [
                  {
                    image:
                      "data:image/png;base64,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",
                    style: "tableHeader",
                    rowSpan: 3,
                    colSpan: 3,
                    width: 200,
                    height: 50,
                    alignment: "center",
                  },
                  {},
                  {},
                  {
                    text: `Name: ${header.user_initt}${header.user_fnamet} ${
                      header.user_lnamet
                    }`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `EmployeeID : ${header.user_empid}`,
                    colSpan: 6,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Department : ${header.user_section}`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Division : ${header.user_deptn}`,
                    colSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {
                    text: `Register No. : ${header.licence_plate_num}`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Brand : ${
                      header.car_brand === null ? "" : header.car_brand
                    }`,
                    colSpan: 9,
                    alignment: `${
                      header.car_brand === null ? "left" : "center"
                    }`,
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Oil type : ${
                      header.car_fuel === null ? "" : header.car_fuel
                    }`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                // [{ text: '', colSpan: 16 }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                //Header
                [
                  {
                    text: "No.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "User Name",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "OBJECTIVE / PLACE / DESCRIPTION",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "CHECK OUT",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "CHECK IN",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "WORKING DISTANCE KM.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "REFUEL",
                    alignment: "center",
                    style: "tableHeader",
                    colSpan: 3,
                  },
                  {},
                  {},
                  {
                    text: "Expressway",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Carpark",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Other Express",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                ],
                [
                  {},
                  {},
                  {},
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  {},
                  { text: "RM NO.", alignment: "center", style: "tableHeader" },
                  { text: "LITR", alignment: "center", style: "tableHeader" },
                  { text: "BATH", alignment: "center", style: "tableHeader" },
                  {},
                  {},
                  {},
                ],

                ...this.renderDataPDF(data, numberfs, to, atm),
                ...this.renderDataSubPDF(data, numberfs, to, remake),
                ...this.renderDataGrandTotal(num, data, number),
              ],
            },
          },
          ...this.renderLic(left_licence, right_licence),
          ...this.renderPageNumber(number, num),
          ...this.renderCostCenter(value_costcenter),
          ...this.renderDate(data),
          ...this.renderACF()
        );
      } else {
        content.push(
          { text: "", style: "header", pageBreak: "before" },
          {
            style: "tableExample",
            absolutePosition: { x: 15, y: 20 },
            table: {
              widths: [
                "2%",
                "11%",
                "37%",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                34,
                23,
                26,
                28,
                24,
                24,
                24,
              ],
              body: [
                [
                  {
                    text: "VEHICLE EXPENSES FORM ( VH 3 )",
                    style: "tableHeader",
                    colSpan: 16,
                    alignment: "center",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                ], //16
                [
                  {
                    image:
                      "data:image/png;base64,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",
                    style: "tableHeader",
                    rowSpan: 3,
                    colSpan: 3,
                    width: 200,
                    height: 50,
                    alignment: "center",
                  },
                  {},
                  {},
                  {
                    text: `Name: ${header.user_initt}${header.user_fnamet} ${
                      header.user_lnamet
                    }`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `EmployeeID : ${header.user_empid}`,
                    colSpan: 6,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Department : ${header.user_section}`,
                    colSpan: 7,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Division : ${header.user_deptn}`,
                    colSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {
                    text: `Register No. : ${header.licence_plate_num}`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
                  {
                    text: `Brand : ${
                      header.car_brand === null ? "" : header.car_brand
                    }`,
                    colSpan: 9,
                    alignment: `${
                      header.car_brand === null ? "left" : "center"
                    }`,
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: `Oil type : ${
                      header.car_fuel === null ? "" : header.car_fuel
                    }`,
                    colSpan: 4,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {},
                ],
                // [{ text: '', colSpan: 16 }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                //Header
                [
                  {
                    text: "No.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "User Name",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "OBJECTIVE / PLACE / DESCRIPTION",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "CHECK OUT",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "CHECK IN",
                    colSpan: 3,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {},
                  {},
                  {
                    text: "WORKING DISTANCE KM.",
                    rowSpan: 2,
                    alignment: "center",
                    style: "tableHeader",
                  },
                  {
                    text: "REFUEL",
                    alignment: "center",
                    style: "tableHeader",
                    colSpan: 3,
                  },
                  {},
                  {},
                  {
                    text: "Expressway",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Carpark",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                  {
                    text: "Other Express",
                    alignment: "center",
                    style: "tableHeader",
                    rowSpan: 2,
                  },
                ],
                [
                  {},
                  {},
                  {},
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  { text: "D/M/Y", alignment: "center", style: "tableHeader" },
                  { text: "TIME", alignment: "center", style: "tableHeader" },
                  { text: "RM No.", alignment: "center", style: "tableHeader" },
                  {},
                  { text: "RM NO.", alignment: "center", style: "tableHeader" },
                  { text: "LITR", alignment: "center", style: "tableHeader" },
                  { text: "BATH", alignment: "center", style: "tableHeader" },
                  {},
                  {},
                  {},
                ],

                ...this.renderDataPDF(data, numberfs, to, atm),
                ...this.renderDataSubPDF(data, numberfs, to, remake),
                // ...this.renderDataGrandTotal(num, data, number)
              ],
            },
          },
          ...this.renderLic(left_licence, right_licence),
          ...this.renderPageNumber(number, num),
          ...this.renderCostCenter(value_costcenter),
          ...this.renderDate(data),
          ...this.renderACF()
        );
      }
    }
    // console.log(content)
    return content;
  };

  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  check = () => {
    let {
      post: {
        data: { search, sumnow, yearnow },
      },
    } = this.props;
    let { remake, value_costcenter } = this.state;
    // console.log(value);
    let data = JSON.parse(sessionStorage.getItem("myData"));
    this.setState(
      {
        pop_costcenter:
        value_costcenter === "" || value_costcenter.length === 0 || value_costcenter === null ? true : false,
      },
      () => {
        let { pop_costcenter } = this.state;
        if (pop_costcenter) {
          // this.focus()
        } else {
          // console.log(remake.length);
          if (remake.length !== 0) {
            fetchapi("car/add_remake", {
              user_empid: data[0]["user_empid"],
              user_remake: remake,
              month: sumnow,
              car_licence: search,
              event: "update",
            }).then((res) => res.json());

            fetchapiUpData("vh3/update_costcenter", {
              car_licence: search,
              month_now: sumnow,
              year_now: yearnow,
              costcenter: value_costcenter,
            }).then((res) => res.json().then((res) => console.log(res)));

            this.printPDF();
            this.setState({ costcenter: "" });
          } else {
            fetchapiUpData("vh3/update_costcenter", {
              car_licence: search,
              month_now: sumnow,
              year_now: yearnow,
              costcenter: value_costcenter,
            }).then((res) => res.json().then((res) => console.log(res)));
            // console.log("object")
            this.printPDF();
            this.setState({ costcenter: "" });
          }
        }
      }
    );
  };

  //////
  printPDF() {
    let { data, header } = this.props;
    let {
      costcenter,
      remake,
      left_licence,
      right_licence,
      value_costcenter,
      value_multiple,
    } = this.state;

    // let owner = ["01042779"];
    // console.log(data);
    console.log(value_multiple);

    // console.log(header)

    // console.log(data.filter((e) => owner.indexOf(e.user_empid) >= 0));

    data =
      value_multiple.length > 0
        ? data.filter((e) => value_multiple.indexOf(e.user_empid) >= 0)
        : data;

    let docDefinition = {
      content: [
        this.renderFrom(
          data,
          header,
          costcenter,
          remake,
          left_licence,
          right_licence,
          value_costcenter
        ),
      ],

      styles: {
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: "black",
        },
      },
      info: {
        title: "awesome Document",
      },
      pageOrientation: "landscape",
      pageMargins: [30, 10, 30, 10],
      defaultStyle: {
        font: "THSarabunNew",
        fontSize: 11,
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
  printPDFTest = () => {
    let { data, header } = this.props;
    let { left_licence, right_licence } = this.state;
    // let last = data.length - 1

    this.toDataURL(logo, (dataUrl) => {
      // console.log('RESULT:', dataUrl)
      let arr = [
        [
          {
            text: "VEHICLE EXPENSES FORM ( VH 3 )",
            style: "tableHeader",
            colSpan: 16,
            alignment: "center",
          },
          "Second",
          "Third",
          "The last one",
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ],
        [
          {
            image: dataUrl,
            style: "tableHeader",
            rowSpan: 3,
            colSpan: 3,
            width: 200,
            height: 50,
            alignment: "center",
          },
          {},
          {},
          {
            text: `Name: ${header.user_initt}${header.user_fnamet} ${
              header.user_lnamet
            }`,
            colSpan: 7,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: `EmployeeID : ${header.user_empid}`,
            colSpan: 6,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {},
          {},
        ],
        [
          {},
          {},
          {},
          {
            text: `Department : ${header.user_section}`,
            colSpan: 7,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: `Division : ${header.user_deptn}`,
            colSpan: 2,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {
            text: `Register No. : ${header.licence_plate_num}`,
            colSpan: 4,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {},
        ],
        [
          {},
          {},
          {},
          {
            text: `Brand : ${
              header.car_brand === null ? "" : header.car_brand
            }`,
            colSpan: 9,
            alignment: `${header.car_brand === null ? "left" : "center"}`,
            style: "tableHeader",
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: `Oil type : ${
              header.car_fuel === null ? "" : header.car_fuel
            }`,
            colSpan: 4,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {},
        ],

        //Haeder
        [
          {
            text: "No.",
            rowSpan: 2,
            alignment: "center",
            style: "tableHeader",
          },
          {
            text: "User Name",
            rowSpan: 2,
            alignment: "center",
            style: "tableHeader",
          },
          {
            text: "OBJECTIVE / PLACE / DESCRIPTION",
            rowSpan: 2,
            alignment: "center",
            style: "tableHeader",
          },
          {
            text: "CHECK OUT",
            colSpan: 3,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {
            text: "CHECK IN",
            colSpan: 3,
            alignment: "center",
            style: "tableHeader",
          },
          {},
          {},
          {
            text: "WORKING DISTANCE KM.",
            rowSpan: 2,
            alignment: "center",
            style: "tableHeader",
          },
          {
            text: "REFUEL",
            alignment: "center",
            style: "tableHeader",
            colSpan: 3,
          },
          {},
          {},
          {
            text: "Expressway",
            alignment: "center",
            style: "tableHeader",
            rowSpan: 2,
          },
          {
            text: "Carpark",
            alignment: "center",
            style: "tableHeader",
            rowSpan: 2,
          },
          {
            text: "Other Express",
            alignment: "center",
            style: "tableHeader",
            rowSpan: 2,
          },
        ],
        [
          {},
          {},
          {},
          { text: "D/M/Y", alignment: "center", style: "tableHeader" },
          { text: "TIME", alignment: "center", style: "tableHeader" },
          { text: "RM No.", alignment: "center", style: "tableHeader" },
          { text: "D/M/Y", alignment: "center", style: "tableHeader" },
          { text: "TIME", alignment: "center", style: "tableHeader" },
          { text: "RM No.", alignment: "center", style: "tableHeader" },
          {},
          { text: "RM NO.", alignment: "center", style: "tableHeader" },
          { text: "LITR", alignment: "center", style: "tableHeader" },
          { text: "BATH", alignment: "center", style: "tableHeader" },
          {},
          {},
          {},
        ],
      ];

      data.map((item, key) => {
        key++;

        return arr.push([
          { text: `${key++}`, alignment: "center" },
          {
            text: `${item.user_fnamet} ${item.user_lnamet}`,
            alignment: "center",
          },
          { text: `${item.des}` },
          {
            text: `${moment(item.data_time_out)
              .utcOffset("+00:00")
              .format("DD/MM/YYYY")}`,
            alignment: "center",
          },
          {
            text: `${moment(item.data_time_out)
              .utcOffset("+00:00")
              .format("HH:mm")}`,
            alignment: "center",
          },
          { text: `${this.formatNumber(item.check_out)}`, alignment: "center" },
          {
            text: `${moment(item.data_time_in)
              .utcOffset("+00:00")
              .format("DD/MM/YYYY")}`,
            alignment: "center",
          },
          {
            text: `${moment(item.data_time_in)
              .utcOffset("+00:00")
              .format("HH:mm")}`,
            alignment: "center",
          },
          { text: `${this.formatNumber(item.check_in)}`, alignment: "center" },
          {
            text: this.formatNumber(`${item.check_in} ` - `${item.check_out}`),
            alignment: "center",
          },
          {
            text: `${
              item.rm_no === null || item.rm_no === 0
                ? ""
                : this.formatNumber(item.rm_no)
            }`,
            alignment: "center",
          },
          {
            text: `${item.litr === null || item.litr === 0 ? "" : item.litr}`,
            alignment: "center",
          },
          {
            text: `${
              item.bath === null || item.bath === 0
                ? ""
                : this.formatNumber(item.bath)
            }`,
            alignment: "center",
          },
          {
            text: `${
              item.expressway === null || item.expressway === 0
                ? ""
                : item.expressway
            }`,
            alignment: "center",
          },
          {
            text: `${
              item.carpark === null || item.carpark === 0 ? "" : item.carpark
            }`,
            alignment: "center",
          },
          {
            text: `${
              item.otherexpenses === null || item.otherexpenses === 0
                ? ""
                : item.otherexpenses
            }`,
            alignment: "center",
          },
        ]);
      });

      const numbers = data.map((e) => {
        // console.log(e.check_in - e.check_out)

        const num = {
          sum_working_distance: e.check_in - e.check_out,
          sum_litr: e.litr,
          sum_baht: e.bath,
          sum_expressway: e.expressway,
          sum_carpark: e.carpark,
          sum_otherexpenses: e.otherexpenses,
        };

        return num;
      });

      arr.push([
        { text: "", colSpan: 3 },
        {},
        {},
        { text: "Grand Total", colSpan: 6, alignment: "center" },
        {},
        {},
        {},
        {},
        {},
        {
          text: `${this.formatNumber(
            numbers
              .map((val) => val.sum_working_distance)
              .reduce((sum, num) => sum + num)
          )}`,
          alignment: "center",
        },
        {},
        {
          text: `${numbers
            .map((val) => val.sum_litr)
            .reduce((sum, num) => sum + num)
            .toFixed(3)}`,
          alignment: "center",
        },
        {
          text: `${this.formatNumber(
            numbers.map((val) => val.sum_baht).reduce((sum, num) => sum + num)
          )}`,
          alignment: "center",
        },
        {
          text: `${this.formatNumber(
            parseInt(
              numbers
                .map((val) => val.sum_expressway)
                .reduce((sum, num) => sum + num) +
                numbers
                  .map((val) => val.sum_carpark)
                  .reduce((sum, num) => sum + num) +
                numbers
                  .map((val) => val.sum_otherexpenses)
                  .reduce((sum, num) => sum + num)
            )
          )}`,
          alignment: "center",
          colSpan: 3,
        },
        {},
        {},
      ]);

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [10, 20, -10, 100],
        defaultStyle: {
          font: "THSarabunNew",
          fontSize: 11,
        },
        startPosition: {
          pageNumber: 2, // the page this node starts on
          pageOrientation: "landscape", // the orientation of this page
          left: 60, // the left position
          right: 60, // the right position
          verticalRatio: 0.2, // the ratio of space used vertically in this document (excluding margins)
          horizontalRatio: 0.0, // the ratio of space used horizontally in this document (excluding margins)
        },
        header: {
          columns: [
            { text: "1/5", alignment: "right", margin: [0, +5, 50, 0] },
          ],
        },
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: "black",
          },
        },

        content: [
          {
            //   layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 6,
              dontBreakRows: true,
              paddingTop: 0,
              widths: [
                "2%",
                "11%",
                "35%",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                34,
                26,
                26,
                28,
                24,
                24,
                24,
              ],

              body: arr,
            },
          },
        ],

        footer: {
          columns: [
            this.renderLic(left_licence, right_licence),
            this.renderACF(),
          ],
          columnGap: 10,
        },
      };
      pdfMake.createPdf(docDefinition).open();
    });
  };

  componentDidMount = () => {
    let {
      data,
      post: {
        data: { search, sumnow },
      },
    } = this.props;
    let profile = JSON.parse(sessionStorage.getItem("myData"));
    // console.log(data)
    // console.log(search, sumnow)
    let items = fetchapi("car/add_remake", {
      month: sumnow,
      car_licence: search,
      event: "loaddata",
    });
    items
      .then((res) => res.json())
      .then((res) =>
        this.setState({ remake: res.length === 0 ? [] : res[0]["user_remake"] })
      );

    let getOptions = fetchapiGet(
      `resource/getOptions_cc/${profile[0].user_deptn}`
    );
    this.group_owner(data);
    // let getOptions = fetchapiGet(`resource/getOptions_cc/BPM (I)`)
    getOptions.then((res) => res.json()).then((res) =>
      res.map((list) => {
        return this.setState({
          options: [
            ...this.state.options,
            {
              key: list.cc_number,
              text: list.cc_number,
              value: list.cc_number,
            },
          ],
        });
      })
    );

    // console.log(data);

    // data.map((list_multi) => {
    //   return this.setState({
    //     options_multiple: [
    //       ...this.state.options_multiple,
    //       {
    //         key: ,
    //         text: ,
    //         value: ,
    //       },
    //     ],
    //   });
    // });
    // this.setState({options_multiple:})
  };
  // , this.printPDFTest()

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps)
  // }

  group_owner = (data) => {
    let group_data = [];
    let data_value = [];
    data.map((e) => {
      if (group_data.indexOf(e.user_empid) < 0) {
        group_data.push(e.user_empid);

        data_value.push({
          key: e.user_empid,
          text: e.user_fnamet + " " + e.user_lnamet,
          value: e.user_empid,
        });
      }
    });
    // console.log(group_data);
    // console.log(data_value);
    this.setState({ options_multiple: data_value });
    // return group_data;
  };

  // componentWillUpdate(nextProps, nextState) {
  //   console.log(nextState);
  // }
  /**/

  renderDropdown = () => {
    let { options, costcenter, pop_costcenter, value } = this.state;
    if (options.length !== 0) {
      return (
        <Form.Dropdown
          required
          error={pop_costcenter}
          selection
          search
          options={options}
          // value={value}
          placeholder="CostCenter..."
          label="CostCenter"
          onChange={this.handleChangeDropdown}
          onSearchChange={this.handleSearchChange}
        />
      );
    } else {
      return (
        <Form.Input
          name="costcenter"
          value={costcenter}
          onChange={this.handleChange}
          placeholder="CostCenter..."
          label="CostCenter"
          required
          error={pop_costcenter}
          autoFocus
          width={2}
        />
      );
    }
  };

  render() {
    let { remake, left_licence, right_licence, options_multiple } = this.state;

    return (
      <div className="App">
        <Segment>
          <Form>
            <Form.Group>
              {this.renderDropdown()}
              <Form.Input
                name="remake"
                onChange={this.handleChange}
                placeholder="หมายเหตุ"
                label="หมายเหตุ"
                value={remake}
                // maxLength={80}
                width={4}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name="left_licence"
                label="Left Licence"
                value={left_licence}
                onChange={this.handleChange}
                placeholder="Left Licence"
                width={3}
              />
              <Form.Input
                name="right_licence"
                label="Right Licence"
                value={right_licence}
                onChange={this.handleChange}
                placeholder="Right Licence"
                width={3}
              />

              {/* 2ฒฬ7208 */}
            </Form.Group>
            <Form.Group>
              <Form.Dropdown
                selection
                multiple
                options={options_multiple}
                // value={value}
                width={6}
                placeholder="Selection Multiple"
                label="Selection Multiple"
                onChange={this.handleChangeDropdown_Multiple}
              />
            </Form.Group>

            <Form.Button
              icon
              labelPosition="left"
              color="blue"
              onClick={this.check}
            >
              <Icon name="file pdf outline" />
              Print PDF
            </Form.Button>
          </Form>

          {/* <input type="button" value="print PDF" onClick={this.printPDF} /> */}
          {/* </Container> */}
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  post: state.post,
});

const mapDispatchToProps = (dispatch) => ({
  // increment: () => dispatch({ type: Action.INCREMENT, text: "INCREMENT Redux" }),
  // decrement: () => dispatch({ type: Action.DECREMENT, text: "DECREMENT Redux" }),
  // postment: (posts) => dispatch({ type: Action.ADDDATA, text: "ADDDATA Redux", post: posts }),
  // despostment: () => dispatch({ type: Action.DEDATA, text: "DEDATA Redux" , post: {} }),
  // searchment: (datas) => dispatch({ type: Action.SEARCH, text: "SEARCH Redux", data: datas }),
  // clearment: () => dispatch({ type: Action.CLEAR, text: "CLEAR Redux" })
  // updatament: () => dispatch({ type: Action.UPDATE, text: "UPDATE Redux" })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDF);

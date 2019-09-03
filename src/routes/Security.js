import React, { Component ,Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import Index from '../Component/Home'
import InformationDataVh3 from '../Component/InformationDataVh3'
// import SummeryCar from '../Component/SummeryCar'
import EditData from '../Component/EditData'
import Users from '../Component/Users'
import PDF from '../Component/PDF'
import AuthSystem from '../Component/AuthSystem'
// import ComingSoon from '../Component/ComingSoon'

import Navbar from '../Component/Navbar'


// Test Component
// import MyDocument from '../Component/Module/TestPDFModule'
import TestReprot from '../Component/TestReprot'

// NO Found //
import NoMatch from './../pages/404'


export default class Secure extends Component {
  render() {
    return (
      <Fragment>
        <Navbar logout={this.props.logout} />
        <Switch>
          <Route exact path="/" component={Index} />
          <Route path="/vh3information" component={InformationDataVh3} />
          <Route path="/summerycar" component={EditData} />
          {/* <Route path="/summerycar" component={ComingSoon} /> */}
          <Route path="/editdata" component={EditData} />
          <Route path="/users" component={Users} />
          <Route path="/testreport" component={TestReprot} />
          <Route path="/pdf" component={PDF} />
          <Route path="/authsystem" component={AuthSystem} />
          {/* <Route path="/vh3/testpdf" component={MyDocument} /> */}
          <Route component={NoMatch}/>
        </Switch>
     </Fragment>
    )
  }
}



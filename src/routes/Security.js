import React, { Component ,Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import Index from '../component/Home'
import InformationDataVh3 from '../component/InformationDataVh3'
// import SummeryCar from '../Component/SummeryCar'
import EditData from '../component/EditData'
import TestUsers from '../component/Users'
import PDF from '../component/PDF'
// import PDF_Damo from '../Component/PDF-Damo'
import AuthSystem from '../component/AuthSystem.js'
// import ComingSoon from '../Component/ComingSoon'
import Analysis from '../component/Analysis'

import Navbar from '../component/Navbar'


// Test Component
// import MyDocument from '../Component/Module/TestPDFModule'
import TestReprot from '../component/TestReprot'

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
          <Route path="/summarycar" component={EditData} />
          {/* <Route path="/summerycar" component={ComingSoon} /> */}
          <Route path="/editdata" component={EditData} />
          <Route path="/users" component={NoMatch} />
          <Route path="/testusers" component={TestUsers} />
          <Route path="/testreport" component={TestReprot} />
          <Route path="/pdf" component={PDF} />
          {/* <Route path="/pdf-damo" component={PDF_Damo} /> */}
          <Route path="/authsystem" component={AuthSystem} />
          <Route path="/analysis" component={Analysis} />
          {/* <Route path="/vh3/testpdf" component={MyDocument} /> */}
          <Route component={NoMatch}/>
        </Switch>
     </Fragment>
    )
  }
}



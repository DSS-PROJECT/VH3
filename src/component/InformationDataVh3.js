import React from 'react'
import { Container, Header, Divider, Segment } from 'semantic-ui-react/dist/commonjs'
import ModuleHeader from './Module/Header'
import Body from './Module/Body'
import ViewData from './ViewData'


export default () => (
    <div>
        <Container style={{ marginTop: '5em' }}>
            <Header size="huge">VEHICLE EXPENSES FORM ( VH 3 )</Header>
        </Container>
        {/* <Container style={{ marginTop: '2em', marginBottom: '2em' }}> */}
            <Segment color="red">
                <ModuleHeader />
            </Segment>
        {/* </Container> */}
        <Divider />
        <ViewData />


        <Divider />
        <Body />
    </div>
)

import React from 'react';
import Aux from '../../hoc/Wrap'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import classes from './Layout.module.css'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

const layout = (props) => (
    <Aux>
        <SideDrawer/>
      <Toolbar></Toolbar>
        <main className={classes.Content}>{props.children}</main>
    </Aux>

)

export default layout
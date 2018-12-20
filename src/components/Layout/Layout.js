import React from 'react';
import Aux from '../../hoc/Wrap'

const layout = (props) => (
    <Aux>
        <div>Toolbar,sidebar,Backdrop</div>
        <main>{props.children}</main>
    </Aux>

)

export default layout
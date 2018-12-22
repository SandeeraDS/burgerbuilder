import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Wrap'
//import Axios from 'axios';

const withErrorHandler = (WrappedComponent, Axios) => {
    return class extends Component {


        state = {
            error: null
        }

        componentWillMount() {

            this.reqInterceptors = Axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });

            this.resInterceptors = Axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
                // return res;
            })
        }

        componentWillUnmount() {
            Axios.interceptors.request.eject(this.reqInterceptors);
            Axios.interceptors.response.eject(this.resInterceptors);
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>

            );
        }
    }
}

export default withErrorHandler;
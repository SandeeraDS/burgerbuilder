import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger'
import Aux from '../../hoc/Wrap'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get("/ingredients.json")
            .then(Response => {
                this.setState({ ingredients: Response.data, error: false })
            })
            .catch(error => this.setState({ error: true }))
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        //alert("Continue")

        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "sandeera jayampathi",
                address: {
                    street: 'TestBoard',
                    zipCode: '221B',
                    country: 'Sri Lanka'
                },
                email: 'sandeerads@gmail.com'
            }
        }

        axios.post('/orders.json', order)
            .then(Response => {
                this.setState({ loading: false, purchasing: false })
            })
            .catch(error => this.setState({ loading: false, purchasing: false }));
    }

    updatePurchaseState = (ingredients) => {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        //console.log("sandeer")
        const sum = Object.keys(ingredients)
            .map(igKey => { return ingredients[igKey]; })
            .reduce((sum, el) => { return sum + el }, 0)

        //console.log(sum)
        this.setState({ purchaseable: sum > 0 })
        //console.log(sum > 0)
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredient = {
            ...this.state.ingredients
        }
        updatedIngredient[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredient })

        this.updatePurchaseState(updatedIngredient);

    }


    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredient = {
            ...this.state.ingredients
        }
        updatedIngredient[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredient })
        this.updatePurchaseState(updatedIngredient);
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }//{salad:true,bacon:false}

        let orderSummary = null;



        let burger = this.state.error ? <p>Ingredients cant load</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemove={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        clicked={this.purchaseHandler}
                    ></BuildControls>
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            ></OrderSummary>
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux >
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
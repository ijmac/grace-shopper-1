import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getCartFromDb, me, editCartItemsInDb, removeCartFromDb, fetchProducts, getCartSessionFromDb} from '../store'
import history from '../history'
import {Button, Icon} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export class Cart extends Component{
  constructor(props){
    super(props)
    this.editOrder = this.editOrder.bind(this)
    this.removeButton = this.removeButton.bind(this)
  }

  componentDidMount(){
    if (!this.props.allProducts.length){
      this.props.getProducts()
    }
    this.props.loadCart()
  }

  editOrder(e){
    e.preventDefault()
    let changeObj = {
      id: +e.target.name,
      quantity: +e.target.value
    }
    this.props.editCart(changeObj)
  }

  removeButton(e){
    this.props.removeFromCart(e.target.name)
  }

  render(){
    const cart = this.props.cart
    const products = this.props.allProducts
    return (
      <div className="cartContainer">
        <h3>This is your cart</h3>
        { cart && cart.orderitems && cart.orderitems.map((orderItem) => {
          return (
            <div key={orderItem.id} className="orderItem">
            <h4><Link to={`/products/${orderItem.productId}`}>{
              (products.length > 0 && products.find((prod) => prod.id === orderItem.productId)).title
            }</Link></h4>
              <div className="item-info">
                <span>
                  {products.length > 0 &&
                  <img
                  className="product-image"
                  src={products.filter((product) => {
                    return product.id === orderItem.productId
                  })[0].photoUrl} />}
                </span>
                <span>ProductId:
                  {orderItem.productId}
                </span>
                <span>Price:
                  {parseFloat(orderItem.itemPrice * 0.01).toFixed(2)}
                </span>
                {products.length > 0 &&
                <span>Quantity:
                  <input
                  name={orderItem.id}
                  min="0"
                  type="number"
                  onChange={(e) => {
                    this.editOrder(e)}}
                  defaultValue={orderItem.quantity}
                  max={products.length > 0 && products.filter((product) => {
                    return product.id === orderItem.productId
                  })[0].quantity} />
                </span>}
                <span>Item Total:
                  ${parseFloat(orderItem.itemTotal * 0.01).toFixed(2)}
                </span>
                <span>
                    <button
                    name={orderItem.id}
                    className="ui button"
                    onClick={(e) => this.removeButton(e)}>
                    Remove Item from Cart
                    </button>
                </span>
              </div>
            </div>
          )
        })}
        {
          cart && cart.orderitems &&
            cart.orderitems.length > 0 ?
              <h4>Subtotal: ${
              parseFloat(
                (cart.orderitems.map(orderitem => orderitem.itemTotal).reduce((accum, currentVal) => accum + currentVal))
                * 0.01)
                .toFixed(2)
              }
              </h4>
            : <h3>Your cart is empty</h3>
        }
        <Link to="/cart/checkout">
          <Button color="blue" animated>
            <Button.Content visible>Proceed to Checkout</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
        </Link>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    cart: state.cart,
    user: state.user,
    allProducts: state.allProducts
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadCart: function(){
      dispatch(me())
      .then(action => {
        if (action.user.id){
          return dispatch(getCartFromDb(action.user.id))
        } else {
          return dispatch(getCartSessionFromDb())
        }
      })
    },
    getProducts: function(){
      dispatch(fetchProducts())
    },
    editCart: function(orderItem){
      dispatch(editCartItemsInDb(orderItem))
    },
    removeFromCart: function(orderitemId){
      dispatch(removeCartFromDb(orderitemId))
    }
  }
}

export default connect(mapState, mapDispatch)(Cart)

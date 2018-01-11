import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {fetchProducts} from '../store'


/**
 * COMPONENT
 */
export class AllProducts extends Component {

  componentDidMount () {
    console.log('this.props', this.props)
    this.props.loadProducts()
  }

  render () {

    const products = this.props.allProducts;

    return (
      <div>
        <div className="product-group">
          {
            products.map(product => {
              return (
                <div className="product" key={product.id}>
                  <img className="product-image" src={product.photoUrl} />
                  <Link to={`/products/${product.id}`}>{ product.title }</Link>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}


/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    allProducts: state.allProducts
  }
}

const mapDispatch = function (dispatch) {
  return {
    loadProducts: function () {
      const productsThunk = fetchProducts();
      dispatch(productsThunk);
    }
  };
}

export default connect(mapState, mapDispatch)(AllProducts)

// /**
//  * PROP TYPES
//  */
// AllProducts.propTypes = {
//   products: PropTypes.array
// }

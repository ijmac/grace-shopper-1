import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {postProduct, fetchCategories, fetchProducts} from '../store'
import {Form, Button, Checkbox, Container, Radio, Dropdown} from 'semantic-ui-react'
import history from '../history'

class AddProduct extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: '',
      description: '',
      price: '',
      quantity: '',
      isAvailable: false,
      photoUrl: '',
      categories: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleVisibility = this.handleVisibility.bind(this)
    this.handleCategories = this.handleCategories.bind(this)
  }

  componentDidMount() {
    this.props.getCategories();
  }

  render () {
    let categories = this.props.categories.map(category => {
      return {
        key: category.name,
        value: +category.id,
        text: category.name
      }
    })

    return (
      <Container>
      <h3>Add a Product</h3>
      <Form onSubmit={this.handleSubmit} onChange={this.handleUpdate}>
        <Form.Field>
          <label>Product Title</label>
          <input type="text" name="title" />
        </Form.Field>
        <br />
        <Form.Field width={8} >
          <label>Description</label>
          <input type="text" name="description" />
        </Form.Field>
        <Form.Group>
          <Form.Field>
            <label>Price</label>
            <input type="text" name="price" />
          </Form.Field>
          <Form.Field>
            <label>Quantity</label>
            <input type="number" name="quantity" />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Photo URL</label>
          <input type="text" name="photoUrl" />
        </Form.Field>
        <Form.Group>
          <Form.Field>
            <label>Categories</label>
            <Dropdown placeholder="Select Categories" fluid multiple selection options={categories} onChange={this.handleCategories} />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
           <label>Visibility</label>
            <Radio
              toggle
              label='Make this product visible.'
              onChange={this.handleVisibility}
            />
          </Form.Field>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
    )
  }

  handleCategories (event, value) {
    this.setState({ categories: value.value })
  }

  handleVisibility (event, value) {
    this.setState({ isAvailable: value.checked })
  }

  handleUpdate (event) {
    if (event.target.name === 'price'){
      this.setState({ price: event.target.value * 100})
    } else {
      this.setState({[event.target.name]: event.target.value})
    }
  }

  handleSubmit (event) {
    event.preventDefault();
    this.props.createProduct(this.state);
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    categories: state.categories
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    createProduct (product) {
      dispatch(postProduct(product))
        .then(() => dispatch(fetchProducts()))
        .then(() => ownProps.history.push('/products'))
    },
    getCategories () {
      dispatch(fetchCategories())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(AddProduct))

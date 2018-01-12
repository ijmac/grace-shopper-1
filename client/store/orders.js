import axios from 'axios'


/* ACTION TYPES
*/
const GET_ALL_ORDERS = 'GET_ALL_ORDERS'

const UPDATE_ORDER = 'UPDATE_ORDER'

/**
 * INITIAL STATE
 */
const defaultOrders = []


/**
 * ACTION CREATORS
 */

 const getAllOrders = orders => {
   return {
     type: GET_ALL_ORDERS,
     orders
   }
 }

 const updateOrderOnState = order => {
   return{
     type: UPDATE_ORDER,
     order
   }

 }

 /**
  * THUNK CREATORS
  */

export const fetchAllOrders = () => dispatch => {
  axios.get(`/api/orders`)
  .then(res => {
    dispatch(getAllOrders(res.data))
  })
  .catch(err => console.error('error fetching orders: ', err))

}

export const updateOrder = (id, status) => dispatch => {
  let updateObj;
  if (status === 'submitted'){
    updateObj = {
      status: status,
      purchaseTime: new Date()
    }
  }
  else {
    updateObj = {
      status: status
    }
  }
  axios.put(`/api/orders/${id}`, updateObj)
  .then(res => dispatch(updateOrderOnState(res.data)))
  .catch(err => console.error('error updating order: ', err))
}

  /**
   * REDUCER
   */

export default function (state = defaultOrders, action) {
  switch (action.type){
    case GET_ALL_ORDERS:
      return action.orders;
    case UPDATE_ORDER:
      const filteredOrders = [...state].filter(order => {
        return order.id !== +action.order.id
      });
      return [...filteredOrders, action.order]
    default:
      return state
  }
}
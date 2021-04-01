const CartItem = require("./cartItems");

function Cart(id = null, cartItem_id, subtotal) {
  this._id = id;
  this.cartItem_id = [];
  this.subtotal = subtotal;
}

module.exports = Cart;

function Cart(id = null, user_id, subtotal) {
  this._id = id;
  this.user_id = user_id;
  this.subtotal = subtotal;
}

module.exports = Cart;

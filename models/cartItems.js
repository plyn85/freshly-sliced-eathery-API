function CartItem(id = null, cart = null, meal_id, quantity, price, total) {
  this._id = id;
  this.cart_id = cart;
  this.meal_id = meal_id;
  this.quantity = quantity;
  this.price = price;
  this.total = total;
}

module.exports = CartItem;

function CartItem(id = null, quantity, price, total) {
  this._id = id;
  this.quantity = quantity;
  this.price = price;
  this.total = total;
}

module.exports = CartItem;

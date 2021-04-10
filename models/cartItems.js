function CartItem(
  id = null,
  cart = null,
  meal_id,
  meal_name,
  meal_description,
  quantity,
  price,
  total
) {
  this._id = id;
  this.cart_id = cart;
  this.meal_id = meal_id;
  this.meal_name = meal_name;
  this.meal_description = meal_description;
  this.quantity = quantity;
  this.price = price;
  this.total = total;
}

module.exports = CartItem;

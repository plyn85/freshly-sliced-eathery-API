function Meal(id = null, name, desc, price) {
  this._id = id;
  this.meal_name = name;
  this.meal_description = desc;
  this.meal_price = price;
}
module.exports = Meal;

function CustomerForm(
  name,
  email,
  collectionOrDeliveryTime,
  address = null,
  message = null,
  collection,
  delivery
) {
  this.name = name;
  this.email = email;
  this.collectionOrDeliveryTime = collectionOrDeliveryTime;
  this.address = address;
  this.message = message;
  this.collection = collection;
  this.delivery = delivery;
}
module.exports = CustomerForm;

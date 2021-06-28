function CustomerForm(
  name,
  email,
  collectionOrDeliveryTime,
  address = null,
  message = null
) {
  this.name = name;
  this.email = email;
  this.collectionOrDeliveryTime = collectionOrDeliveryTime;
  this.address = address;
  this.message = message;
}
module.exports = CustomerForm;

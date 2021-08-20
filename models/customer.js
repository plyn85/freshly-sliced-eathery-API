function CustomerOrderForm(
  invoice_number,
  amount,
  collectionOrDeliveryTime,
  address = null,
  message = null,
  collection,
  delivery
) {
  this.invoice_number = invoice_number;
  this.amount = amount;
  this.collectionOrDeliveryTime = collectionOrDeliveryTime;
  this.address = address;
  this.message = message;
  this.collection = collection;
  this.delivery = delivery;
}
module.exports = CustomerOrderForm;

function CustomerForm(name, email, collection_time, message = null) {
  this.name = name;
  this.email = email;
  this.collection_time = collection_time;
  this.message = message;
}
module.exports = CustomerForm;

class Utils {

  constructor() {
  }

  pad(amount, digits) {
    amount += '';
    if(amount.length < digits) {
      amount = '0' + amount;
      return this.pad(amount, digits);
    } else {
      return amount;
    }
  }

  msToString(ms) {
    let x = ms / 1000;
    let seconds = parseInt(x % 60);
    x /= 60;
    let minutes = parseInt(x % 60);

    return minutes + ':' + this.pad(seconds, 2);
  }

}

module.exports = Utils;

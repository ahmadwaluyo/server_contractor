export default function decimalAdjust(type: string, value: number, exp: number): number {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  let val = value.toString().split('e');
  val = Math[type](+(val[0] + 'e' + (val[1] ? (+val[1] - exp) : -exp)));
  // Shift back
  val = val.toString().split('e');
  return +(val[0] + 'e' + (val[1] ? (+val[1] + exp) : exp));
}
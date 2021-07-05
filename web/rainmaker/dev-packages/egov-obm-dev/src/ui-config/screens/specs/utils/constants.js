// Below mentioned patters are converted to ES2015 pattern using https://mothereff.in/regexpu#input=var+regex+%3D+/%5Cp%7BL%7D/u%3B&unicodePropertyEscape=1
export const patterns = {
  accountNumber :  /^[0-9]{9,18}$/, 
  ifscCode:/^[A-Z]{4}[0]{1}[0-9]{6}$/,
  accountHolderName :   /^[ .A-Za-z]{3,80}$/,
  bankName :   /^[ .A-Za-z]{5,80}$/,
}
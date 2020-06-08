export default function validate(val) {
  return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
}

const rules = {
  regex: (v) =>
    /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
    'Only use letters, digits, period, comma, underline and hyphen'
}

import { assign, typeOf } from 'recourse'
export default ($options) => assign({
  basename: '',
  propertyDescriptors: false,
  defineProperties: {
    typeCoercion: true,
  },
  replacers: [function replacer($key, $value) {
    if(typeOf($value) === 'bigint') { return String($value) }
    else { return $value }
  }],
  revivers: [function reviver($key, $value) { return $value }],
}, $options)
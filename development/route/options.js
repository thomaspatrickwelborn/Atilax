import { assign, typeOf } from 'recourse'
export default ($options) => {
  const options = assign({
    propertyDescriptors: false,
    defineProperties: false,
    replacers: [],
    revivers: [],
  }, $options)
  if(options.propertyDescriptors?.type) {
    options.replacers.push(function BigintReplacer($key, $value) {
      if(typeOf($value) === 'bigint') { return String($value) }
      else { return $value }
    })
  }
  return options
}
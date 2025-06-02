import { assign, typeOf } from 'recourse'
export default ($options) => {
  const options = assign({
    basename: '',
    propertyDescriptors: false,
    defineProperties: false,
    replacers: [],
    revivers: [],
  }, $options)
  if(options.propertyDescriptors?.type) {
    options.replacers.push(function replacer($key, $value) {
      if(typeOf($value) === 'bigint') { return String($value) }
      else { return $value }
    })
  }
  return options
}
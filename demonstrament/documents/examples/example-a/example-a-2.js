console.log("---------------------")
console.log("Atilax | Example A.2.")
console.log("---------------------")
import { Route as LocalStorageRoute } from '/dependencies/atilax.js'
const object = {
  propertyA: {
    propertyB: {
      propertyC: BigInt(9007199254740991)
    }
  }
}
const localStorageRoute = new LocalStorageRoute('/', {
  propertyDescriptors: { type: true }
})
localStorageRoute.set(object)
console.log("localStorageRoute.raw()", localStorageRoute.raw())
console.log("localStorageRoute.get()", localStorageRoute.get())

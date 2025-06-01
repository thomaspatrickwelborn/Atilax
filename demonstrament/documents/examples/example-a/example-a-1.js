console.log("---------------------")
console.log("Atilax | Example A.1.")
console.log("---------------------")
import { Route } from '/dependencies/atilax.js'
const route = new Route('/', {
  propertyDescriptors: { type: true, frozen: false, sealed: false, path: false }
})
route.set({
  propertyA: {
    propertyB: {
      propertyC: BigInt(33135154333333333333333125135)
    }
  }
})
console.log(route.raw())
console.log(route.get())

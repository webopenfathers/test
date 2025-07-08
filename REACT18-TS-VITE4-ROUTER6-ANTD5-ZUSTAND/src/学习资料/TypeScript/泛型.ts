function identity<T>(arg: T): T {
  return arg
}

identity<number>(1)

//-------------------------------------------------
function identity2<T, U>(x: T, y: U): T {
  console.log(y)
  return x
}

identity2<number, number>(1, 2)
identity2<string, boolean>('jack', true)

//-----------------------------------------------------
interface User {
  id: number
  name: string
  age: number
}

type AgeType = Pick<User, 'name' | 'age'>

const jack: AgeType = {
  name: 'jack',
  age: 19
}

console.log(jack)

export {}

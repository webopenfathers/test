// 接口类型定义
interface Person2 {
  name: string
  age: number
}

const jack: Person2 = {
  name: 'jack',
  age: 30
}

console.log(jack)
// ---------------------------------
// 只读和可选
interface P {
  readonly name: string
  age?: number
}

const lily: P = {
  name: 'lily',
  age: 29
}

// lily.name = 'tom'

console.log(lily)

// -----------------------------------
// 任意类型

interface T {
  name: string
  age: number
  [k: string]: string | number
}

const a: T = {
  name: 'jack',
  age: 30,
  id: 1,
  gender: 'male',
  edu: '本科'
}

console.log(a)

// ---------------------------------------
// 定义函数类型
// interface Sum {
//   (x: number, y: number): number
// }

type Sum1 = (x: number, y: number) => number

const add: Sum1 = (x, y) => {
  return x + y
}

add(1, 2)

// ------------------------------------------
// 接口的继承
interface U {
  id: number
  name: string
}

interface Person extends U {
  age: number
}

const tim: Person = {
  id: 1,
  name: 'tim',
  age: 30
}
console.log(tim)

type U1 = {
  id: number
  name: string
}

type Person1 = { age: number } & U1

const tim1: Person1 = {
  id: 1,
  name: 'tim',
  age: 30
}
console.log(tim1)

export {}

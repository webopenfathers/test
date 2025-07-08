// 数组类型的定义
const list1: number[] = [1, 2, 3]
console.log(list1)

const list2: Array<number> = [1, 2, 3]
console.log(list2)

const list3: [number, string, boolean] = [1, '2', true]
console.log(list3)

const list4: [{ name: string; age: number }] = [{ name: 'jack', age: 30 }]
console.log(list4)

const list5: Array<{ name: string; age: number }> = [{ name: 'jack', age: 30 }]
console.log(list5)

interface User {
  name: string
  age: number
}
const list6: Array<User> = [{ name: 'jack', age: 30 }]
console.log(list6)

// 函数类型定义
function add1(a: number, b: number): number {
  return a + b
}
add1(1, 2)

function add2(a: number, b: number): void {
  console.log(a, b)
}
add2(1, 2)

function add3(): unknown {
  throw new Error('这是一个error')
}
add3()

const add4 = (a: number, b: number): number => {
  return a + b
}
add4(1, 2)

const add5: (a: number, b: number) => number = (a, b) => {
  return a + b
}
add5(1, 2)

export {}

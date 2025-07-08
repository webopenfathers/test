// keyof 获取键值

interface User {
  id: number
  name: string
  age: number
}

type Keys = keyof User // 'id' | 'name' | 'age'

// typeof 获取类型

const user = {
  name: 'jack',
  age: 30
}

type User1 = typeof user

// in 遍历枚举类型----且只能在type中定义，不能在interface中定义
interface User2 {
  [k: string]: any
}

type User3 = {
  [k in Keys]: any
}

const tom: User3 = { id: '1', name: 'jack', age: 30 }

console.log(tom)

export {}

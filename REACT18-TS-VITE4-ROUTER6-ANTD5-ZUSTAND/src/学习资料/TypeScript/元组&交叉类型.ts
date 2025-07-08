// 元组
const list: [number, string, boolean, object] = [1, '2', true, {}]
console.log(list)

// 交叉类型
type AgeType = { age: number }
type UserType = { id: number; name: string }
const user: UserType & AgeType = { id: 1, name: 'jack', age: 30 }
console.log(user)

const userAge: AgeType = { age: 30 }
console.log(userAge)

const userInfo: UserType = { id: 2, name: 'tom' }
console.log(userInfo)

export {}

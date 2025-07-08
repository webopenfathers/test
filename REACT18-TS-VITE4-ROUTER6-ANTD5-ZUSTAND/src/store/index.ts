// 推荐 zustand
import { create } from 'zustand'
import { User } from '@/types/api'
import storage from '@/utils/storage'

// 推荐 zustand
export const useStore = create<{
  token: string
  userInfo: User.UserItem
  collapsed: boolean
  isDark: boolean
  updateUserInfo: (userInfo: User.UserItem) => void
  updateToken: (token: string) => void
  updateCollapsed: () => void
  updateTheme: (isDark: boolean) => void
}>(set => ({
  token: '',
  userInfo: {
    createId: 0,
    deptId: '',
    deptName: '',
    job: '',
    mobile: '',
    role: 0,
    roleList: '',
    state: 0,
    userEmail: '',
    userId: 0,
    userImg: '',
    userName: '',
    _id: ''
  },
  collapsed: false,
  isDark: storage.get('isDark') || false,
  updateToken: token => set({ token }),
  updateTheme: isDark => set({ isDark }),
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateCollapsed: () => set(state => ({ collapsed: !state.collapsed }))
}))
// 推荐 zustand

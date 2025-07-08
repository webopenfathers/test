import axios from 'axios'
declare module axios {
  interface AxiosRequsetConfig {
    showLoading?: boolean
    showError?: boolean
  }
}

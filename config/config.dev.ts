import { defineConfig } from 'umi';

// UMI_ENV = dev 环境配置
export default defineConfig({
  define: {
    //REACT_APP_API_URL: 'http://rap2api.taobao.org/app/mock/284539',
    REACT_APP_API_URL: 'http://localhost:7001',
    // REACT_APP_API_URL: 'http://10.52.242.7:8082/MoveOut',
    //REACT_APP_API_URL: 'http://10.57.94.252:8103',
  },
});

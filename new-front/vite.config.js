import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import postCssPxToRem from "postcss-pxtorem"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // css in js
                }),
            ],
        }),],
    base: "./",
    // css: {
    //   postcss: {
    //     plugins: [
    //       postCssPxToRem({
    //         rootValue: 120, // 1rem的大小
    //         propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
    //       })
    //     ]
    //   }
    // },
})

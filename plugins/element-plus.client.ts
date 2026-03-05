import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElCollapse, ElCollapseItem, ElDrawer } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  // Регистрируем Element Plus
  nuxtApp.vueApp.use(ElementPlus)

  // Явно регистрируем компоненты
  nuxtApp.vueApp.component('ElCollapse', ElCollapse)
  nuxtApp.vueApp.component('ElCollapseItem', ElCollapseItem)
  nuxtApp.vueApp.component('ElDrawer', ElDrawer)

  // Регистрируем все иконки
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    nuxtApp.vueApp.component(key, component)
  }
})

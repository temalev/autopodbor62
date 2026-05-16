import { ElCollapse, ElCollapseItem, ElDrawer } from 'element-plus'

/**
 * Element Plus подключается «вручную» — регистрируем только три компонента,
 * которые реально используются (ElCollapse/ElCollapseItem на главной и
 * ElDrawer в мобильном меню). CSS подключается отдельно в nuxt.config.ts
 * через `element-plus/theme-chalk/el-*.css` для каждого компонента.
 *
 * Полный `app.use(ElementPlus)` + `element-plus/dist/index.css` (~344 КБ)
 * избыточен и сильно бьёт по FCP.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ElCollapse', ElCollapse)
  nuxtApp.vueApp.component('ElCollapseItem', ElCollapseItem)
  nuxtApp.vueApp.component('ElDrawer', ElDrawer)
})

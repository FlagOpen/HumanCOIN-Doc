import DefaultTheme from 'vitepress/theme'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import 'katex/dist/katex.min.css'
import './custom.css'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
}

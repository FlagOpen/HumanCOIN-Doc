import { defineConfig } from 'vitepress'
import katexModule from '@vscode/markdown-it-katex'

const katex = (katexModule as unknown as { default?: typeof katexModule }).default ?? katexModule

const enSidebar = [
  {
    text: 'Getting started',
    items: [
      { text: 'Introduction', link: '/' },
      { text: 'Quick start', link: '/getting-started' },
    ],
  },
  {
    text: 'Data',
    items: [
      { text: 'What is in the data', link: '/data' },
      { text: 'On-disk format', link: '/format' },
      { text: 'Reading and alignment', link: '/reading' },
      { text: 'Collection and processing', link: '/collection' },
    ],
  },
  {
    text: 'Download and use',
    items: [
      { text: 'Download and access', link: '/download' },
      { text: 'Visualization', link: '/visualization' },
      { text: 'Using the data', link: '/usage' },
    ],
  },
  {
    text: 'About',
    items: [{ text: 'About', link: '/reference' }],
  },
]

const zhSidebar = [
  {
    text: '开始',
    items: [
      { text: '简介', link: '/zh/' },
      { text: '快速开始', link: '/zh/getting-started' },
    ],
  },
  {
    text: '数据',
    items: [
      { text: '数据里有什么', link: '/zh/data' },
      { text: '磁盘上的格式', link: '/zh/format' },
      { text: '读取与对齐', link: '/zh/reading' },
      { text: '采集与处理', link: '/zh/collection' },
    ],
  },
  {
    text: '下载与使用',
    items: [
      { text: '下载与访问', link: '/zh/download' },
      { text: '可视化', link: '/zh/visualization' },
      { text: '使用数据', link: '/zh/usage' },
    ],
  },
  {
    text: '关于',
    items: [{ text: '关于', link: '/zh/reference' }],
  },
]

export default defineConfig({
  lang: 'en-US',
  title: 'HumanCOIN',
  description: 'Documentation for the HumanCOIN egocentric manipulation dataset.',
  base: '/HumanCOIN-Doc/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/HumanCOIN-Doc/assets/wordmark.png' }],
  ],
  markdown: {
    config: (md) => md.use(katex, { throwOnError: false, errorColor: '#dc2626' }),
  },
  lastUpdated: true,
  cleanUrls: false,
  themeConfig: {
    logo: '/assets/wordmark.png',
    siteTitle: false,
    nav: [
      { text: 'Home', link: 'https://flagopen.github.io/HumanCOIN/' },
      { text: 'Data portal', link: 'https://flagopen.github.io/HumanCOIN-DataManager/' },
      { text: 'Technical report', link: 'https://arxiv.org/abs/2611.26434' },
      { text: 'GitHub', link: 'https://github.com/FlagOpen/HumanCOIN' },
    ],
    sidebar: enSidebar,
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    editLink: {
      pattern: 'https://github.com/FlagOpen/HumanCOIN-Doc/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'HumanCOIN · BAAI AhaData Group',
      copyright: 'Data CC BY-NC 4.0 · Code Apache-2.0',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FlagOpen/HumanCOIN' },
    ],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        logo: '/assets/wordmark.png',
        siteTitle: false,
        nav: [
          { text: '主页', link: 'https://flagopen.github.io/HumanCOIN/' },
          { text: '数据门户', link: 'https://flagopen.github.io/HumanCOIN-DataManager/' },
          { text: '技术报告', link: 'https://arxiv.org/abs/2611.26434' },
          { text: 'GitHub', link: 'https://github.com/FlagOpen/HumanCOIN' },
        ],
        sidebar: zhSidebar,
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到结果',
                resetButtonTitle: '清除查询',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
        outline: { level: [2, 3], label: '本页目录' },
        editLink: {
          pattern: 'https://github.com/FlagOpen/HumanCOIN-Doc/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: {
          message: 'HumanCOIN · BAAI AhaData Group',
          copyright: '数据 CC BY-NC 4.0 · 代码 Apache-2.0',
        },
        docFooter: { prev: '上一篇', next: '下一篇' },
      },
    },
  },
})

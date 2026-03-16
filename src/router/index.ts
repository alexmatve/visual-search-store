import { createRouter, createWebHistory } from 'vue-router'
import { ProductDetailPage, ProductListPage } from '@/pages'
import { RouteNames } from '@/shared/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.ProductList,
      component: ProductListPage,
    },
    {
      path: '/products/:id',
      name: RouteNames.ProductDetail,
      component: ProductDetailPage,
    },
  ],
})

export default router

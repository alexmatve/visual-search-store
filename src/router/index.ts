import { createRouter, createWebHistory } from 'vue-router'
import {
  CartPage,
  LoginPage,
  ProductDetailPage,
  ProductListPage,
  ProfilePage,
  RegisterPage,
} from '@/pages'
import { RouteNames } from '@/shared/router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: RouteNames.Login,
      component: LoginPage,
    },
    {
      path: '/auth/register',
      name: RouteNames.Register,
      component: RegisterPage,
    },
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
    {
      path: '/profile',
      name: RouteNames.Profile,
      component: ProfilePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/cart',
      name: RouteNames.Cart,
      component: CartPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: RouteNames.Login })
  } else {
    next()
  }
})

export default router

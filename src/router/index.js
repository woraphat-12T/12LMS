import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: () => import('../authentication/login.vue'), meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/dashboardView.vue'), meta: { requiresAuth: true, breadcrumb: 'Dashboard' } },
  { path: '/oms', redirect: '/oms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/oms/report', redirect: '/oms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/oms/report/percent-fill-to-dc', name: 'percent-fill-to-dc', component: () => import('../views/oms/report/percentFillToDCView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / %เติมสินค้าเข้า DC' } },
  { path: '/oms/report/stock-on-hand', name: 'stock-on-hand', component: () => import('../views/oms/report/stockOnHandView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / Stock On Hand' } },
  { path: '/oms/report/daily-stock', name: 'daily-stock', component: () => import('../views/oms/report/dailyStockView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / Daily Stock' } },
  { path: '/oms/report/not-bill', name: 'not-bill', component: () => import('../views/oms/report/notBillView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / รายการที่ไม่ได้วางบิล' } },
  { path: '/oms/report/not-open-invoice', name: 'not-open-invoice', component: () => import('../views/oms/report/notOpenInvoiceView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / สินค้าที่ยังไม่ได้เปิด Invoice' } },
  { path: '/oms/report/backlog-unit', name: 'backlog-unit-report', component: () => import('../views/oms/report/backlogUnitReportView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / ออเดอร์ค้างส่ง(หน่วยรถ)' } },
  { path: '/oms/report/plan', name: 'plan', component: () => import('../views/oms/report/planView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / วางแผน' } },
  { path: '/oms/report/plan-total', name: 'plan-total', component: () => import('../views/oms/report/planTotalView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / วางแผนรวม' } },
  { path: '/oms/report/stock-age', name: 'stock-age', component: () => import('../views/oms/report/stockAgeView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / อายุสินค้าคงเหลือ' } },
  { path: '/oms/report/shipment-cost', name: 'shipment-cost', component: () => import('../views/oms/report/shipmentCostView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / ค่าขนส่ง(shipment)' } },
  { path: '/oms/report/shared-vehicle-cost', name: 'shared-vehicle-cost', component: () => import('../views/oms/report/sharedVehicleCostView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / ค่าขนส่ง(รถร่วม)' } },
  { path: '/oms/report/ontime-percent', name: 'ontime-percent', component: () => import('../views/oms/report/ontimePercentView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / % ontime' } },
  { path: '/oms/report/credit-limit', name: 'credit-limit', component: () => import('../views/oms/report/creditLimitView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / รายงาน / Credit Limit' } },
  { path: '/oms/manage', redirect: '/oms/manage/backlog', meta: { requiresAuth: true } },
  { path: '/oms/manage/backlog', name: 'backlog', component: () => import('../views/oms/manage/backlogView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / ออเดอร์ค้างส่ง' } },
  { path: '/oms/manage/backlog-unit', name: 'backlog-unit', component: () => import('../views/oms/manage/backlogUnitView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / ออเดอร์ค้างส่ง(หน่วยรถ)' } },
  { path: '/oms/manage/weight-volume', name: 'weight-volume', component: () => import('../views/oms/manage/weightVolumeView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / กำหนดปริมาตรและน้ำหนักรถบรรทุก' } },
  { path: '/oms/manage/shipcost-management', name: 'shipcost-management', component: () => import('../views/oms/manage/shipcostView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / จัดการค่าขนส่ง' } },
  { path: '/oms/manage/shipcost-setting', name: 'shipcost-setting', component: () => import('../views/oms/manage/shipcostSettingView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / กำหนดค่าขนส่ง' } },
  { path: '/oms/manage/shipcost-edit', name: 'shipcost-edit', component: () => import('../views/oms/manage/shipcostEditView.vue'), meta: { requiresAuth: true, breadcrumb: 'OMS / จัดการ / แก้ไขค่าขนส่ง' } },
  { path: '/manage/user', name: 'user-management', component: () => import('../views/manage/userView.vue'), meta: { requiresAuth: true, breadcrumb: 'จัดการสิทธิ์การใช้งาน' } },
  { path: '/manage/warehouse', name: 'warehouse-management', component: () => import('../views/manage/warehouseView.vue'), meta: { requiresAuth: true, breadcrumb: 'จัดการศูนย์กระจายสินค้า' } },
  { path: '/mms', redirect: '/mms/manage/special-plan', meta: { requiresAuth: true } },
  { path: '/mms/manage', redirect: '/mms/manage/special-plan', meta: { requiresAuth: true } },
  { path: '/mms/manage/special-plan', name: 'special-plan', component: () => import('../views/mms/manage/specialPlanView.vue'), meta: { requiresAuth: true, breadcrumb: 'MMS / จัดการ / แพลนพิเศษ' } },
  { path: '/logout', name: 'Logout', beforeEnter: (to, from, next) => {
    const authStore = useAuthStore();
    authStore.logout();
    // next({ name: '/login' });
    window.location.href = "http://localhost:5173/";
  } },
  {
    path: '/order-detail/:productCode',
    name: 'OrderDetail',
    component: () => import('@/views/oms/report/OrderDetailView.vue'),
    props: route => ({ productCode: route.params.productCode, productName: route.query.productName })
  },
  {
    path: '/oms/report/plan-total-detail',
    name: 'plan-total-detail',
    component: () => import('@/views/oms/report/planTotalDetailView.vue'),
    props: route => ({ column: route.query.column })
  },
  {
    path: '/oms/report/plan-total-co-list',
    name: 'plan-total-co-list',
    component: () => import('@/views/oms/report/PlanTotalCoList.vue'),
    props: route => ({ productCode: route.query.productCode, productName: route.query.productName })
  },
  {
    path: '/oms/report/plan-total-van',
    name: 'plan-total-van',
    component: () => import('@/views/oms/report/PlanTotalVan.vue'),
    props: route => ({ productCode: route.query.productCode, productName: route.query.productName })
  },
  { path: '/monitor-log', name: 'monitor-log', component: () => import('../views/monitorLog.vue'), meta: { requiresAuth: true, breadcrumb: 'Monitor Log' } },
  { path: '/upload-excel', name: 'upload-excel', component: () => import('../views/uploadExcelView.vue'), meta: { requiresAuth: false, breadcrumb: 'อัพโหลดไฟล์ Excel' } },
  { path: '/:pathMatch(.*)*', redirect: '/' } 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    authStore.initAuth();
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Store the intended URL for redirect after login
    const redirectUrl = to.fullPath;
    next(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // If there's a redirect parameter, don't redirect away from login page
    if (to.name === 'login' && to.query.redirect) {
      next();
      return;
    }
    next('/dashboard');
    return;
  }

  next();
});

export default router;

<script setup>   
import { useAuthStore } from './stores'
const authStore = useAuthStore()
import SideBar from "@/components/sideBar.vue";
import PageHeader from "@/components/PageHeader.vue";
import { useRoute } from 'vue-router';
import { ref, computed, provide } from 'vue';
const route = useRoute();

const sideBarRef = ref();
const isDailyStockPage = computed(() => route.path === '/oms/report/daily-stock' || route.path === '/oms/report/plan-total');
// const isUploadExcelPage = computed(() => route.path === '/upload-excel');
const showOverlay = computed(() =>
  isDailyStockPage.value &&
  sideBarRef.value && sideBarRef.value.isCollapsed === false
);

// Computed property for sidebar width
const sidebarWidth = computed(() => {
  if (!sideBarRef.value) return 300; // default width when sidebar is expanded
  return sideBarRef.value.isCollapsed ? 130 : 300;
});

// Provide sidebar state to child components
provide('sidebarWidth', sidebarWidth);
provide('isSidebarCollapsed', computed(() => sideBarRef.value?.isCollapsed || false));

function closeSideBar() {
  if (sideBarRef.value) sideBarRef.value.isCollapsed = true;
}
</script>

<template>
    <div :class="authStore.user">
        <div v-if="route.path !== '/' && !isUploadExcelPage" class="flex h-screen bg-gray-50">
            <!-- Background drop เฉพาะตอน overlayMode && !isCollapsed (full) -->
            <div v-if="showOverlay" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="closeSideBar" />
            <SideBar v-if="route.path !== '/login'" :overlay-mode="isDailyStockPage" ref="sideBarRef" />
            <div class="flex-1 flex flex-col">
                <main :class="route.path !== '/login' ? 'flex-1 p-6' : ''">
                    <PageHeader v-if="route.path !== '/login' && route.meta.breadcrumb && route.path !== '/oms/manage/backlog' && route.path !== '/oms/report/shipment-cost'" />
                    <router-view />
                </main>
            </div>
        </div>
        <router-view v-if="isUploadExcelPage" />
        <router-view v-else />
    </div>
</template>

<style>

</style>
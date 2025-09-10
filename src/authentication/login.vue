<template>
  <div class="min-h-screen flex items-center justify-center p-4" style="background-color: #3C7DB4;">
    <div class="max-w-md w-full space-y-4">
      <!-- Logo and Title -->
      <div class="text-center">
        <img src="/logo-onetwo.png" alt="Logo" class="mx-auto h-12 w-auto mb-2" />
        <h2 class="text-2xl font-bold text-white mb-1">เข้าสู่ระบบ</h2>
        <p class="text-blue-100 text-sm">Logistic Management System</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              ชื่อผู้ใช้
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="mdi:account" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                :disabled="loading"
                class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="mdi:lock" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="loading"
                class="block w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                placeholder="กรอกรหัสผ่าน"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon
                  :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="h-4 w-4 text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex">
              <Icon icon="mdi:alert-circle" class="h-4 w-4 text-red-400 mr-2" />
              <p class="text-xs text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="w-full flex justify-center py-2 px-4 border border-transparent items-center rounded-lg shadow-sm text-sm font-medium text-white bg-[#00569D] hover:bg-[#004080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Icon
              v-if="loading"
              icon="mdi:loading"
              class="animate-spin h-4 w-4 mr-2"
            />
            <Icon
              v-else
              icon="mdi:login"
              class="h-4 w-4 mr-2"
            />
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <!-- Detail Credentials -->
        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center mb-2">
            <h4 class="text-xs font-medium text-gray-700">ข้อมูลเข้าสู่ระบบ:</h4>
          </div>
          <div class="text-xs text-gray-600 space-y-0.5">
            <p><strong>Username:</strong> ชื่อภาษาอังกฤษ.(3 ตัวอักษรแรกของนามสกุลผู้ใช้)</p>
            <p><strong>Password:</strong> รหัสผ่านเดียวกับเข้าสู่ระบบคอมพิวเตอร์</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <div class="flex items-center justify-center text-blue-100 text-xs">
          <img src="/logo-fplus.png" alt="Logo" class="h-4 w-auto mr-2" />
          Copyright One Two Trading Co., Ltd. All rights reserved.
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
        <h3 class="text-lg font-semibold mb-4 text-center">รหัสผ่านหมดอายุ</h3>
        <form @submit.prevent="submitChangePassword" class="space-y-3">
          <div>
            <label class="block text-xs mb-1">รหัสผ่านเก่า</label>
            <input v-model="changeForm.oldPassword" type="password" class="block w-full border rounded px-3 py-2 text-sm" required />
          </div>
          <div>
            <label class="block text-xs mb-1">รหัสผ่านใหม่</label>
            <input v-model="changeForm.newPassword" type="password" class="block w-full border rounded px-3 py-2 text-sm" required />
          </div>
          <div>
            <label class="block text-xs mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input v-model="changeForm.confirmPassword" type="password" class="block w-full border rounded px-3 py-2 text-sm" required />
          </div>
          <div v-if="changeError" class="text-xs text-red-500">{{ changeError }}</div>
          <div class="flex justify-end space-x-2 mt-2">
            <button type="button" @click="showChangePassword = false" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
            <button type="submit" class="px-3 py-1 rounded bg-[#00569D] text-white">เปลี่ยนรหัสผ่าน</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import { Icon } from '@iconify/vue';
import { apiClient } from '@/utils/api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form data
const form = reactive({
  username: '',
  password: ''
});

// UI state
const showPassword = ref(false);
const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

// Change password modal state
const showChangePassword = ref(false);
const changeForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const changeError = ref('');

// Handle login
const handleLogin = async () => {
  if (!form.username || !form.password) {
    return;
  }

  const result = await authStore.login({
    username: form.username,
    password: form.password
  });

  if (result.success) {
    form.username = '';
    form.password = '';
    
    // Get redirect URL from query parameter
    const redirectUrl = route.query.redirect;
    
    // Redirect to intended URL or default to dashboard
    if (redirectUrl && typeof redirectUrl === 'string') {
      try {
        // Decode the redirect URL
        const decodedUrl = decodeURIComponent(redirectUrl);
        router.push(decodedUrl);
      } catch (error) {
        console.error('Error decoding redirect URL:', error);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  } else if (result.code === 'PASSWORD_EXPIRED' || result.error === 'PASSWORD_EXPIRED') {
    // Show change password modal
    showChangePassword.value = true;
    changeForm.oldPassword = form.password;
    changeForm.newPassword = '';
    changeForm.confirmPassword = '';
    changeError.value = '';
  } else {
    error.value = result.message || 'เข้าสู่ระบบไม่สำเร็จ';
  }
};

// Handle change password
const submitChangePassword = async () => {
  changeError.value = '';
  if (!changeForm.oldPassword || !changeForm.newPassword || !changeForm.confirmPassword) {
    changeError.value = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    return;
  }
  if (changeForm.newPassword !== changeForm.confirmPassword) {
    changeError.value = 'รหัสผ่านใหม่ไม่ตรงกัน';
    return;
  }
  if (changeForm.newPassword.length < 6) {
    changeError.value = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร';
    return;
  }
  try {
    await apiClient.post('/api/auth/change-password', {
      username: form.username,
      oldPassword: changeForm.oldPassword,
      newPassword: changeForm.newPassword
    });
    alert('เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่');
    showChangePassword.value = false;
    form.password = '';
  } catch (e) {
    changeError.value = e.message || 'เกิดข้อผิดพลาด';
  }
};

// Initialize auth state
onMounted(() => {
  authStore.initAuth();
  if (authStore.isAuthenticated) {
    // Get redirect URL from query parameter
    const redirectUrl = route.query.redirect;
    
    // Redirect to intended URL or default to dashboard
    if (redirectUrl && typeof redirectUrl === 'string') {
      try {
        // Decode the redirect URL
        const decodedUrl = decodeURIComponent(redirectUrl);
        router.push(decodedUrl);
      } catch (error) {
        console.error('Error decoding redirect URL:', error);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.min-h-screen {
  animation: fadeIn 0.6s ease-out;
}

/* Custom focus styles */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

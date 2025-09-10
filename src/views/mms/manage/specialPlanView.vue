<template>
    <div class="flex-1 bg-gray-50" style="min-height: calc(100vh - 120px);">
        <!-- Tab Navigation -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-2">
            <div class="flex flex-row justify-between border-b border-gray-200">
                <nav class="flex space-x-8 px-6" aria-label="Tabs">
                    <button @click="activeTab = 'special-plan'" :class="[
                        'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'special-plan'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <Icon icon="mdi:clipboard-text-outline" class="w-4 h-4 mr-2 inline" />
                        แพลนพิเศษ
                    </button>
                    <button @click="activeTab = 'item-master'" :class="[
                        'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'item-master'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <Icon icon="streamline-plump:business-progress-bar-2" class="w-4 h-4 mr-2 inline" />
                        ติดตามแพลนพิเศษ
                    </button>
                </nav>
                <!-- Summary Info -->
                <div class=" p-1 pt-2" v-if="activeTab === 'special-plan'">
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button @click="filterStatus = 'all'" :class="[
                            'flex items-center space-x-2 px-3 py-1 rounded-md transition-colors cursor-pointer',
                            filterStatus === 'all'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        ]">
                            <Icon icon="mdi:clipboard-text-outline" class="w-4 h-4" />
                            <span class="text-xs font-medium">จำนวนรายการทั้งหมด</span>
                            <span :class="[
                                'text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center',
                                filterStatus === 'all'
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-gray-200 text-gray-600'
                            ]">{{ specialPlanData.length }}</span>
                        </button>
                        <button @click="filterStatus = 'pending'" :class="[
                            'flex items-center space-x-2 px-3 py-1 rounded-md transition-colors cursor-pointer',
                            filterStatus === 'pending'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        ]">
                            <Icon icon="mdi:clock-outline" class="w-4 h-4" />
                            <span class="text-xs font-medium">รอฝ่ายวางแผนไส่ LOT</span>
                            <span :class="[
                                'text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center',
                                filterStatus === 'pending'
                                    ? 'bg-purple-200 text-purple-800'
                                    : 'bg-gray-200 text-gray-600'
                            ]">{{ getPendingCount() }}</span>
                        </button>
                        <button @click="filterStatus = 'completed'" :class="[
                            'flex items-center space-x-2 px-3 py-1 rounded-md transition-colors cursor-pointer',
                            filterStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        ]">
                            <Icon icon="mdi:check-circle" class="w-4 h-4" />
                            <span class="text-xs font-medium">ดำเนินการเสร็จสิ้น</span>
                            <span :class="[
                                'text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center',
                                filterStatus === 'completed'
                                    ? 'bg-green-200 text-green-800'
                                    : 'bg-gray-200 text-gray-600'
                            ]">{{ getCompletedCount() }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Content -->
        <!-- Special Plan Tab -->
        <div v-if="activeTab === 'special-plan'">
            <!-- Table Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200" style="min-height: calc(100vh - 230px);">
                <!-- Loading State -->
                <div v-if="isLoading" class="flex items-center justify-center p-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="p-8 text-center text-red-500">
                    {{ error }}
                </div>

                <!-- Data Table -->
                <div v-else class="relative shadow-md sm:rounded-lg p-2">
                    <!-- Search and Filter -->
                    <div class="flex items-center justify-between bg-[#F3F4F6] mb-2 rounded-lg p-2">
                        <div class="flex items-center space-x-4">
                            <!-- Record Count -->
                            <ResultCount :label="'ผลลัพธ์:'" :current="filteredData.length"
                                :total="specialPlanData.length" icon="mdi:clipboard-text-outline" iconColor="#00569D" />

                            <!-- Last Sync Info -->
                            <div class="flex items-center space-x-2 text-xs text-gray-600">
                                <Icon icon="mdi:sync" class="w-4 h-4" />
                                <span>sync ข้อมูลล่าสุด:</span>
                                <span class="font-medium text-blue-600">{{ formatLastSyncTime() }}</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <!-- INSERT_YOUR_CODE -->
                            <!-- Filter Buttons -->
                            <!-- <div class="flex items-center space-x-2">
                            <button
                                :class="[
                                    'px-3 py-1 rounded-md text-xs font-medium border transition',
                                    filterStatus === 'all'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                                ]"
                                @click="filterStatus = 'all'"
                            >
                                ทั้งหมด
                            </button>
                            <button
                                :class="[
                                    'px-3 py-1 rounded-md text-xs font-medium border transition',
                                    filterStatus === 'pending'
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
                                ]"
                                @click="filterStatus = 'pending'"
                            >
                                รอดำเนินการ
                            </button>
                            <button
                                :class="[
                                    'px-3 py-1 rounded-md text-xs font-medium border transition',
                                    filterStatus === 'completed'
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                                ]"
                                @click="filterStatus = 'completed'"
                            >
                                เสร็จสิ้น
                            </button>
                        </div> -->

                            <!-- Refresh Button -->
                            <button @click="loadData" :disabled="isLoading"
                                class="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs rounded-lg transition-colors">
                                <Icon :icon="isLoading ? 'mdi:loading' : 'mdi:refresh'"
                                    :class="isLoading ? 'animate-spin' : ''" class="w-4 h-4" />
                                <span>รีเฟรช</span>
                            </button>

                            <!-- Search Input -->
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                </div>
                                <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                                    class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto" style="height: calc(100vh - 230px);">
                        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
                            <thead class="text-xs sticky top-0 text-white uppercase bg-blue-600">
                                <tr>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-24 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('documentDate')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>วันที่เอกสาร</span>
                                            <Icon :icon="getSortIcon('documentDate')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('poNumber')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>เลขที่ใบสั่งซื้อ</span>
                                            <Icon :icon="getSortIcon('poNumber')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-24 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('customerCode')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>รหัสลูกค้า</span>
                                            <Icon :icon="getSortIcon('customerCode')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-64 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('customerName')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>ชื่อลูกค้า</span>
                                            <Icon :icon="getSortIcon('customerName')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-80 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('deliveryLocation')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>สถานที่จัดส่ง</span>
                                            <Icon :icon="getSortIcon('deliveryLocation')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-48 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('status')">
                                        <div class="flex items-center justify-center space-x-1">
                                            <span>สถานะรายการ</span>
                                            <Icon :icon="getSortIcon('status')" class="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-48 cursor-pointer hover:bg-blue-700"
                                        @click="sortBy('status')">
                                        รายการ
                                    </th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="filteredData.length === 0"
                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colspan="8" class="px-4 py-8 text-center text-gray-500 border border-gray-300">
                                        <Icon icon="mdi:database-off" class="w-8 h-8 mx-auto mb-2" />
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
                                <tr v-else v-for="(item, index) in filteredData" :key="index"
                                    :class="index % 2 === 0 ? 'bg-white' : 'bg-blue-50'"
                                    class="border-b border-gray-300 hover:bg-gray-50">
                                    <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                        {{ formatDate(item.documentDate) }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                        {{ item.poNumber }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                        {{ item.customerCode }}
                                    </td>
                                    <td class="px-2 py-2 text-left border border-gray-300 px-3">
                                        {{ item.customerName }}
                                    </td>
                                    <td class="px-2 py-2 text-left border border-gray-300 px-3">
                                        {{ item.customerAddress || item.deliveryLocation || '-' }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300">
                                        <span class="px-2 py-1 text-xs rounded-full"
                                            :class="getStatusClass(item.status)">
                                            {{ item.status }}
                                        </span>
                                    </td>

                                    <td class="px-2 py-2 text-center border border-gray-300">
                                        {{ item.lineItems ? item.lineItems.length : 0 }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300">
                                        <button v-if="item.status === 'ดำเนินการเสร็จสิ้น'" @click="viewDetails(item)"
                                            class="bg-[#138496] hover:bg-[#138496]/80 text-white px-3 py-1 rounded text-xs flex items-center mx-auto">
                                            <Icon icon="mdi:eye" class="w-4 h-4" />
                                            รายละเอียด
                                        </button>
                                        <button v-else @click="openAddModal(item)"
                                            class="bg-yellow-400 hover:bg-yellow-300 text-white px-3 py-1 rounded text-xs flex items-center mx-auto">
                                            <Icon icon="mdi:pencil" class="w-4 h-4" />
                                            แก้ไข
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- ItemMaster Tab -->
        <div v-else-if="activeTab === 'item-master'" class="bg-white rounded-lg shadow-sm border border-gray-200"
            style="min-height: calc(100vh - 120px);">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-8 text-center text-red-500">
                {{ error }}
            </div>

            <!-- Data Table -->
            <div v-else class="relative shadow-md sm:rounded-lg p-2">
                <!-- Header -->
                <div class="flex items-center justify-between bg-[#F3F4F6] mb-2 rounded-lg p-2">
                    <div class="flex items-center space-x-4">
                        <!-- Record Count -->
                        <ResultCount :label="'ผลลัพธ์:'" :current="completedDataFiltered.length"
                            :total="completedDataFiltered.length" icon="mdi:check-circle" iconColor="#059669" />

                        <!-- Last Sync Info -->
                        <div class="flex items-center space-x-2 text-xs text-gray-600">
                            <Icon icon="mdi:sync" class="w-4 h-4" />
                            <span>sync ข้อมูลล่าสุด:</span>
                            <span class="font-medium text-blue-600">{{ formatLastSyncTime() }}</span>
                        </div>
                    </div>

                    <!-- Refresh Button -->
                    <button @click="loadData" :disabled="isLoading"
                        class="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs rounded-lg transition-colors">
                        <Icon :icon="isLoading ? 'mdi:loading' : 'mdi:refresh'" :class="isLoading ? 'animate-spin' : ''"
                            class="w-4 h-4" />
                        <span>รีเฟรช</span>
                    </button>
                </div>
                <!-- Table -->
                <div class="overflow-x-auto" style="height: calc(100vh - 230px);">
                    <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
                        <thead class="text-xs sticky top-0 text-white uppercase bg-green-600">
                            <tr>
                                <th class="px-2 py-2 text-center border border-gray-300 w-24">วันที่เอกสาร</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-32">เลขที่ใบสั่งซื้อ</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-24">รหัสลูกค้า</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-64">ชื่อลูกค้า</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-80">ที่อยู่</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-48">รายการ</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-48">สถานะ</th>
                                <th class="px-2 py-2 text-center border border-gray-300 w-32">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="completedDataFiltered.length === 0"
                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td colspan="7" class="px-4 py-8 text-center text-gray-500 border border-gray-300">
                                    <Icon icon="mdi:database-off" class="w-8 h-8 mx-auto mb-2" />
                                    ไม่พบข้อมูลที่เสร็จสิ้นแล้ว
                                </td>
                            </tr>
                            <tr v-else v-for="(item, index) in completedDataFiltered" :key="index"
                                :class="index % 2 === 0 ? 'bg-white' : 'bg-green-50'"
                                class="border-b border-gray-300 hover:bg-gray-50">
                                <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                    {{ formatDate(item.documentDate) }}
                                </td>
                                <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                    {{ item.poNumber }}
                                </td>
                                <td class="px-2 py-2 text-center border border-gray-300 font-mono">
                                    {{ item.customerCode }}
                                </td>
                                <td class="px-2 py-2 text-left border border-gray-300 px-3">
                                    {{ item.customerName }}
                                </td>
                                <td class="px-2 py-2 text-left border border-gray-300 px-3">
                                    {{ item.customerAddress || item.deliveryLocation || '-' }}
                                </td>
                                <td class="px-2 py-2 text-center border border-gray-300">
                                    {{ item.lineItems ? item.lineItems.length : 0 }}
                                </td>
                                <td class="px-2 py-2 text-center border border-gray-300">
                                    {{ item.status_po }} - {{ item.status_po_name }}
                                </td>
                                <td class="px-2 py-2 text-center border border-gray-300">
                                    <button @click="viewDetails(item)"
                                        class="bg-[#138496] hover:bg-[#138496]/80 text-white px-3 py-1 rounded text-xs flex items-center mx-auto">
                                        <Icon icon="mdi:eye" class="w-4 h-4" />
                                        ดูรายละเอียด
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add to System Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-5 mx-auto p-5 border max-w-7xl shadow-lg rounded-md bg-white">
            <div class="mt-1">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">เลขที่ใบสั่งซื้อ {{ selectedItem?.poNumber }}
                        คลังสินค้า : {{ selectedItem?.warehouseCode || 'ไม่ระบุ' }}</h3>
                    <button @click="closeAddModal" :disabled="isUpdating" class="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon icon="mdi:close" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Content -->
                <div class="flex justify-between gap-2">
                    <!-- Customer Info -->
                    <div class=" w-1/2 bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-medium text-blue-900 mb-3">ข้อมูลลูกค้า</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">รหัสลูกค้า:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerCode }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">ชื่อลูกค้า:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerName }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">เบอร์โทร:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerTel || '-' }}</span>
                            </div>
                            <div class="md:col-span-2">
                                <span class="font-medium text-gray-700">ที่อยู่:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerAddress ||
                                    selectedItem?.deliveryLocation || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Order Info -->
                    <div class="w-1/2 bg-green-50 p-4 rounded-lg">
                        <h4 class="font-medium text-green-900 mb-3">ข้อมูลใบสั่งซื้อ</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">เลขที่ใบสั่งซื้อ:</span>
                                <span class="ml-2 text-gray-900 font-mono">{{ selectedItem?.poNumber }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">เลขอ้างอิง:</span>
                                <span class="ml-2 text-gray-900 font-mono">{{ selectedItem?.refPoNumber || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">วันที่ทำเอกสาร:</span>
                                <span class="ml-2 text-gray-900">{{ formatDate(selectedItem?.documentDate) }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">รหัสคลัง:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.warehouseCode || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">รหัสพนักงานขาย:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.saleCode || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">สถานะ:</span>
                                <span class="ml-2 px-2 py-1 text-xs rounded-full"
                                    :class="getStatusClass(selectedItem?.status)">
                                    {{ selectedItem?.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Form -->
                <div class="bg-gray-50 p-2 rounded-lg mt-2">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-gray-900">ข้อมูลสินค้า</h4>
                        <div class="flex items-center space-x-2 text-xs">
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <span class="text-gray-600">ยังไม่กรอก</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span class="text-gray-600">กรอกแล้ว</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span class="text-gray-600">พร้อมอัพเดต</span>
                            </div>
                        </div>
                    </div>

                    <!-- Product Table -->
                    <div class="overflow-x-auto" style="height: calc(100vh - 450px);">
                        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
                            <thead class="text-xs text-white uppercase sticky top-0 bg-blue-600">
                                <tr>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-16">ลำดับที่</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32">รหัสสินค้า</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-64">ชื่อสินค้า</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-24">จำนวน/หีบ</th>
                                    <!-- <th class="px-2 py-2 text-center border border-gray-300 w-32">มาร์ค Admin Sales</th> -->
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32">แผนผลิต</th>
                                    <!-- <th class="px-2 py-2 text-center border border-gray-300 w-32">หมายเหตุ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!selectedItem?.lineItems || selectedItem.lineItems.length === 0"
                                    class="bg-white border-b border-gray-300">
                                    <td colspan="5" class="px-2 py-4 text-center text-gray-500 border border-gray-300">
                                        ไม่พบข้อมูลสินค้า
                                    </td>
                                </tr>
                                <tr v-else v-for="(lineItem, index) in selectedItem.lineItems" :key="index"
                                    class="bg-white border-b border-gray-300 hover:bg-gray-50">
                                    <td class="px-2 py-2 text-center border border-gray-300 font-medium">{{
                                        lineItem.line_no }}</td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-mono">{{
                                        lineItem.prd_id?.trim() }}</td>
                                    <td class="px-2 py-2 text-left border border-gray-300 px-3">{{ lineItem.prd_name }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-medium">{{
                                        lineItem.quantity }}</td>
                                    <td class="px-2 py-2 text-center border border-gray-300">
                                        <div class="relative">
                                            <input type="text" v-model="lineItem.note"
                                                :class="[
                                                    'w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 transition-colors',
                                                    lineItem.note && lineItem.note.trim() && lineItem.note.trim() !== (lineItem.originalNote || '')
                                                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                                        : lineItem.note && lineItem.note.trim()
                                                        ? 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                ]"
                                                placeholder="ใส่แผนผลิต">
                                            <div v-if="lineItem.note && lineItem.note.trim() && lineItem.note.trim() !== (lineItem.originalNote || '')" 
                                                class="absolute right-1 top-1/2 transform -translate-y-1/2">
                                                <Icon icon="mdi:check-circle" class="w-3 h-3 text-green-500" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button @click="closeAddModal" :disabled="isUpdating"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isUpdating ? 'ปิดไม่ได้' : 'ยกเลิก' }}
                    </button>
                    <button @click="confirmAddToSystem" :disabled="!hasValidNotes || isUpdating"
                        class="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                        :class="[
                            hasValidNotes && !isUpdating 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed focus:ring-gray-500'
                        ]">
                        <Icon :icon="isUpdating ? 'mdi:loading' : 'mdi:check'" :class="isUpdating ? 'animate-spin' : ''" class="w-4 h-4 mr-2 inline" />
                        {{ isUpdating ? 'กำลังอัพเดต...' : hasValidNotes ? 'ยืนยันการอัพเดตหมายเหตุ' : 'กรุณาใส่หมายเหตุครบทุกรายการ' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-5 mx-auto p-5 border max-w-7xl shadow-lg rounded-md bg-white">
            <div class="mt-1">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">เลขที่ใบสั่งซื้อ {{ selectedItem?.poNumber }}
                        คลังสินค้า : {{ selectedItem?.warehouseCode || 'ไม่ระบุ' }}</h3>
                    <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
                        <Icon icon="mdi:close" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Content -->
                <div class="flex justify-between gap-2">
                    <!-- Customer Info -->
                    <div class=" w-1/2 bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-medium text-blue-900 mb-3">ข้อมูลลูกค้า</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">รหัสลูกค้า:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerCode }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">ชื่อลูกค้า:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerName }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">เบอร์โทร:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerTel || '-' }}</span>
                            </div>
                            <div class="md:col-span-2">
                                <span class="font-medium text-gray-700">ที่อยู่:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.customerAddress ||
                                    selectedItem?.deliveryLocation || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Order Info -->
                    <div class="w-1/2 bg-green-50 p-4 rounded-lg">
                        <h4 class="font-medium text-green-900 mb-3">ข้อมูลใบสั่งซื้อ</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">เลขที่ใบสั่งซื้อ:</span>
                                <span class="ml-2 text-gray-900 font-mono">{{ selectedItem?.poNumber }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">เลขอ้างอิง:</span>
                                <span class="ml-2 text-gray-900 font-mono">{{ selectedItem?.refPoNumber || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">วันที่ทำเอกสาร:</span>
                                <span class="ml-2 text-gray-900">{{ formatDate(selectedItem?.documentDate) }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">รหัสคลัง:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.warehouseCode || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">รหัสพนักงานขาย:</span>
                                <span class="ml-2 text-gray-900">{{ selectedItem?.saleCode || '-' }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">สถานะ:</span>
                                <span class="ml-2 px-2 py-1 text-xs rounded-full"
                                    :class="getStatusClass(selectedItem?.status)">
                                    {{ selectedItem?.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="bg-gray-50 p-2 rounded-lg mt-2">
                    <h4 class="font-medium text-gray-900 mb-1">ข้อมูลสินค้า</h4>

                    <!-- Product Table -->
                    <div class="overflow-x-auto" style="height: calc(100vh - 450px);">
                        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
                            <thead class="text-xs text-white uppercase sticky top-0 bg-blue-600">
                                <tr>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-16">ลำดับที่</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32">รหัสสินค้า</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-64">ชื่อสินค้า</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-24">จำนวน/หีบ</th>
                                    <th class="px-2 py-2 text-center border border-gray-300 w-32">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!selectedItem?.lineItems || selectedItem.lineItems.length === 0"
                                    class="bg-white border-b border-gray-300">
                                    <td colspan="5" class="px-2 py-4 text-center text-gray-500 border border-gray-300">
                                        ไม่พบข้อมูลสินค้า
                                    </td>
                                </tr>
                                <tr v-else v-for="(lineItem, index) in selectedItem.lineItems" :key="index"
                                    class="bg-white border-b border-gray-300 hover:bg-gray-50">
                                    <td class="px-2 py-2 text-center border border-gray-300 font-medium">{{
                                        lineItem.line_no }}</td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-mono">{{
                                        lineItem.prd_id?.trim() }}</td>
                                    <td class="px-2 py-2 text-left border border-gray-300 px-3">{{ lineItem.prd_name }}
                                    </td>
                                    <td class="px-2 py-2 text-center border border-gray-300 font-medium">{{
                                        lineItem.quantity }}</td>
                                    <td class="px-2 py-2 text-center border border-gray-300">
                                        <span class="text-gray-700">{{ lineItem.note || '-' }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button @click="showDetailsModal = false"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import PageHeader from '@/components/PageHeader.vue';
import ResultCount from '@/components/ResultCount.vue';
import { showSuccess, showError, showInfo } from '@/utils/toast';
import { apiClient } from '@/utils/api';

// Reactive data
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const activeTab = ref('special-plan');
const filterStatus = ref('all');
const lastSyncTime = ref(new Date()); // เพิ่ม ref สำหรับเวลาที่ sync ล่าสุด

// Sorting state
const sortField = ref('');
const sortDirection = ref('asc');

// Modal state
const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedItem = ref(null);
const modalNote = ref('');
const modalConfirm = ref(false);
const isUpdating = ref(false); // เพิ่ม ref สำหรับสถานะการอัพเดต

// API data
const specialPlanData = ref([]);
const pendingData = ref([]); // เพิ่ม ref สำหรับข้อมูลที่รอดำเนินการ
const completedDataFiltered = ref([]); // เพิ่ม ref สำหรับข้อมูลที่เสร็จสิ้นแล้ว

// Computed properties
const filteredData = computed(() => {
    let data = specialPlanData.value;

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        data = data.filter(item =>
            item.poNumber?.toLowerCase().includes(query) ||
            item.customerCode?.toLowerCase().includes(query) ||
            item.customerName?.toLowerCase().includes(query) ||
            item.customerAddress?.toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query)
        );
    }

    // Apply status filter
    if (filterStatus.value === 'pending') {
        data = pendingData.value;
    } else if (filterStatus.value === 'completed') {
        data = completedDataFiltered.value;
    }

    // Apply sorting
    if (sortField.value) {
        data = [...data].sort((a, b) => {
            let aVal = a[sortField.value];
            let bVal = b[sortField.value];

            // Handle date sorting
            if (sortField.value === 'documentDate') {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            }

            if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return data;
});

// ตรวจสอบว่ามีการกรอกหมายเหตุครบถ้วนหรือไม่
const hasValidNotes = computed(() => {
    if (!selectedItem.value?.lineItems) return false;
    
    // ตรวจสอบว่ามีการกรอกหมายเหตุครบทุกรายการและมีการเปลี่ยนแปลง
    return selectedItem.value.lineItems.every(lineItem => 
        lineItem.note && lineItem.note.trim() && 
        lineItem.note.trim() !== (lineItem.originalNote || '')
    );
});

// Methods
const loadData = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        // ดึงข้อมูลทั้ง 2 สถานะพร้อมกัน
        const [allDataResponse, completedDataResponse] = await Promise.all([
            apiClient.get('/api/special-plan?p1=000'), // ข้อมูลทั้งหมด
            apiClient.get('/api/special-plan?p1=001')  // ข้อมูลที่เสร็จสิ้นแล้ว
        ]);

        let allData = [];
        let completedData = [];

        // ตรวจสอบข้อมูลทั้งหมด
        if (allDataResponse && allDataResponse.success && allDataResponse.data) {
            allData = allDataResponse.data.map(item => ({
                documentDate: item.date_po,
                poNumber: item.po_no,
                refPoNumber: item.ref_po_no,
                status_po: item.status_po,
                customerCode: item.cus_code?.trim(),
                customerName: item.cus_name,
                customerTel: item.cus_tel?.trim(),
                customerAddress: item.cus_addr,
                saleCode: item.sale_code?.trim(),
                saleDescription: item.sale_descript,
                warehouseCode: item.wh_code,
                status: item.statusName,
                statusCode: item.status_po,
                lineItems: item.line_items || [],
                createdAt: item.created_at,
                lastUpdateAt: item.last_update_at
            }));
        }

        // ตรวจสอบข้อมูลที่เสร็จสิ้นแล้ว
        if (completedDataResponse && completedDataResponse.success && completedDataResponse.data) {
            completedData = completedDataResponse.data.map(item => ({
                documentDate: item.date_po,
                poNumber: item.po_no,
                refPoNumber: item.ref_po_no,
                status_po: item.status_po,
                status_po_name: item.status_po_name,
                customerCode: item.cus_code?.trim(),
                customerName: item.cus_name,
                customerTel: item.cus_tel?.trim(),
                customerAddress: item.cus_addr,
                saleCode: item.sale_code?.trim(),
                saleDescription: item.sale_descript,
                warehouseCode: item.wh_code,
                status: item.statusName,
                statusCode: item.status_po,
                lineItems: item.line_items || [],
                createdAt: item.created_at,
                lastUpdateAt: item.last_update_at
            }));
        }

        // รวมข้อมูลทั้งหมด
        specialPlanData.value = [...allData, ...completedData];

        // แยกข้อมูลตามสถานะ
        pendingData.value = allData.filter(item => item.status !== 'ดำเนินการเสร็จสิ้น');
        completedDataFiltered.value = completedData;

        // showSuccess('โหลดข้อมูลสำเร็จ');

        // อัปเดตเวลาที่ sync ล่าสุด
        lastSyncTime.value = new Date();
    } catch (err) {
        console.error('Error loading special plan data:', err);
        error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        showError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'));
    } finally {
        isLoading.value = false;
    }
};

// เพิ่มฟังก์ชันสำหรับโหลดข้อมูลตามสถานะ (สำหรับปุ่ม refresh)
const loadDataByStatus = async (status) => {
    if (status === 'all') {
        await loadData(); // โหลดข้อมูลทั้งหมด
    } else if (status === 'pending') {
        // ใช้ข้อมูลที่มีอยู่แล้ว แค่เปลี่ยน filter
        filterStatus.value = 'pending';
    } else if (status === 'completed') {
        // ใช้ข้อมูลที่มีอยู่แล้ว แค่เปลี่ยน filter
        filterStatus.value = 'completed';
    }
};

const openAddModal = (item) => {
    selectedItem.value = {
        ...item,
        lineItems: item.lineItems ? item.lineItems.map(lineItem => ({
            ...lineItem,
            originalNote: lineItem.note || '' // เก็บค่าเดิมของหมายเหตุ
        })) : []
    };
    modalNote.value = '';
    modalConfirm.value = false;
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
    selectedItem.value = null;
    modalNote.value = '';
    modalConfirm.value = false;
};

const confirmAddToSystem = async () => {
    if (!hasValidNotes.value) {
        showInfo('กรุณาใส่หมายเหตุให้ครบทุกรายการสินค้าและมีการเปลี่ยนแปลงก่อนยืนยัน');
        return;
    }

    try {
        isUpdating.value = true;
        
        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
        if (!selectedItem.value?.poNumber || !selectedItem.value?.lineItems) {
            showError('ข้อมูลไม่ครบถ้วน');
            return;
        }

        // อัพเดตหมายเหตุสำหรับแต่ละรายการสินค้า
        const updatePromises = selectedItem.value.lineItems.map(async (lineItem) => {
            if (lineItem.note && lineItem.note.trim() && lineItem.note.trim() !== (lineItem.originalNote || '')) {
                try {
                    const updateData = {
                        po_no: selectedItem.value.poNumber,
                        prd_id: lineItem.prd_id?.trim(),
                        note: lineItem.note.trim(),
                        empId: "68213" // TODO: ใช้ empId จริงจากระบบ
                    };

                    const response = await apiClient.post('/api/special-plan/update-remark', updateData);
                    
                    if (response && response.success) {
                        console.log(`อัพเดตหมายเหตุสำเร็จสำหรับสินค้า: ${lineItem.prd_id}`);
                    } else {
                        console.error(`อัพเดตหมายเหตุไม่สำเร็จสำหรับสินค้า: ${lineItem.prd_id}`, response);
                        throw new Error(`อัพเดตหมายเหตุไม่สำเร็จสำหรับสินค้า: ${lineItem.prd_id}`);
                    }
                } catch (err) {
                    console.error(`Error updating remark for product ${lineItem.prd_id}:`, err);
                    throw err;
                }
            }
        });

        // รอให้การอัพเดตทั้งหมดเสร็จสิ้น
        await Promise.all(updatePromises);
        
        showSuccess(`อัพเดตหมายเหตุรายการ ${selectedItem.value.poNumber} สำเร็จ`);
        closeAddModal();
        
        // รีเฟรชข้อมูลหลังจากอัพเดตสำเร็จ
        await loadData();
    } catch (error) {
        console.error('Error updating remarks:', error);
        showError('เกิดข้อผิดพลาดในการอัพเดตหมายเหตุ: ' + (error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'));
    } finally {
        isUpdating.value = false;
    }
};

const viewDetails = (item) => {
    selectedItem.value = item;
    showDetailsModal.value = true;
};

const sortBy = (field) => {
    if (sortField.value === field) {
        // Toggle direction if same field
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        // New field, default to ascending
        sortField.value = field;
        sortDirection.value = 'asc';
    }
};

const getSortIcon = (field) => {
    if (sortField.value !== field) {
        return 'mdi:unfold-more-horizontal';
    }
    return sortDirection.value === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down';
};

const addToSystem = (item) => {
    showInfo(`เพิ่มรายการ ${item.poNumber} เข้าระบบ`);
    // TODO: Implement add to system logic
};

const getStatusClass = (status) => {
    if (status === 'ดำเนินการเสร็จสิ้น') {
        return 'bg-green-100 text-green-800';
    } else if (status === 'รอดำเนินการ') {
        return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
};

const getCompletedCount = () => {
    return completedDataFiltered.value.length;
};

const getPendingCount = () => {
    return pendingData.value.length;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
};

// เพิ่มฟังก์ชันสำหรับแสดงเวลาที่ sync ล่าสุด
const formatLastSyncTime = () => {
    if (!lastSyncTime.value) return 'ไม่เคย sync';

    const now = new Date();
    const diffMs = now - lastSyncTime.value;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
        return `${diffHours} ชม. ${diffMinutes} นาที ที่แล้ว`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} นาที ที่แล้ว`;
    } else {
        return 'ไม่กี่วินาทีที่แล้ว';
    }
};

// Lifecycle
onMounted(() => {
    // Auto load data on component mount
    loadData();
});
</script>

<style scoped>
/* Custom styles for the table */
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Hover effects */
.hover\:bg-gray-50:hover {
    background-color: #f9fafb;
}

/* Status badge styles */
.bg-green-100 {
    background-color: #dcfce7;
}

.text-green-800 {
    color: #166534;
}

.bg-blue-100 {
    background-color: #dbeafe;
}

.text-blue-800 {
    color: #1e40af;
}

.bg-gray-100 {
    background-color: #f3f4f6;
}

.text-gray-800 {
    color: #1f2937;
}
</style>

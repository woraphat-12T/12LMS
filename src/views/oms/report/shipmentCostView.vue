<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <PageHeader>
      <template #actions>
        <div class="flex flex-col sm:flex-row gap-3 pl-5 items-end bg-white shadow-md rounded-lg p-2">
          <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
            <label for="mh-select" class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
              Shipment No. :
            </label>
            <input type="text" v-model="shipmentNo" placeholder="รหัส Shipment"
              class="w-full py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>
          <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
            <label for="roudcos-select"
              class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
              ช่องทาง :
            </label>
            <select id="roudcos-select" v-model="selectedRoudcosPay"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
              <option value="">เลือกช่องทาง</option>
              <option v-for="item in roudcosPayOptions" :key="item.ROUDCOS_ID" :value="item.ROUDCOS_ID">
                {{ item.ROUDCOS_NAME }}
              </option>
            </select>
          </div>
          <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
            <label for="code-truck-select"
              class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
              รถร่วม :
            </label>
            <select id="code-truck-select" v-model="selectedCodeTruck"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
              <option value="">เลือกรถร่วม</option>
              <option v-for="item in codeTruckOptions" :key="item.code_id" :value="item.code_id">
                {{ item.code_name }}
              </option>
            </select>
          </div>
          <div class="flex-shrink-0 sm:self-end">
            <button type="button" @click="handleSearch"
              :disabled="isLoading || !shipmentNo || !selectedRoudcosPay || !selectedCodeTruck"
              class="w-full sm:w-auto text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-1.5 dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="!isLoading" icon="mdi:magnify" width="14" height="14" class="mr-1.5" />
              <svg v-else class="animate-spin mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              ค้นหา
            </button>
          </div>
        </div>
      </template>
    </PageHeader>
    <!-- Shipment Summary Card (3 columns, label bold, value normal, group by user spec) -->
    <div class="w-full bg-white rounded-lg shadow py-4 px-6 mb-2">
      <div class="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
        <!-- Left Column -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between min-w-[220px]">
            <span class="font-bold text-gray-700">Shipment:</span>
            <span class="font-normal text-gray-700">{{ summaryData.calpallet.CONN || '-' }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]">
            <span class="font-bold text-gray-700">รหัส:</span>
            <span class="font-normal text-gray-700">{{ summaryData.truckInfo.DAFWNO || '-' }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]">
            <span class="font-bold text-gray-700">ชื่อ:</span>
            <span class="font-normal text-gray-700">{{ summaryData.truckInfo.IDSUNM || '-' }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]">
            <span class="font-bold text-gray-700">หมายเหตุ:</span>
            <span class="font-normal text-gray-700">{{ summaryData.truckInfo.DAE0B4 || '-' }}</span>
          </div>
        </div>
        <!-- Center Column -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">จำนวน FG:</span> <span
              class="font-normal text-blue-700">{{ summaryData.calpallet.FG_AMOUNT?.toLocaleString() || '0.00' }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">Total:</span> <span
              class="font-normal text-blue-700">{{ summaryData.calpallet.Total_cost?.toLocaleString() || '0.00'
              }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">(0)อัตตราลด
              (1)อัตตราเพิ่ม:</span> <span class="font-normal text-gray-700">{{ summaryData.calpallet.ISPERCEN || '-'
              }}</span></div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">ปรับลดค่าน้ำมัน:</span>
            <span class="font-normal text-gray-700">{{ summaryData.calpallet.OILRETENTION || '0' }}%</span>
          </div>
        </div>
        <!-- Right Column -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">ค่าพาเลท:</span> <span
              class="font-normal text-gray-700">{{ summaryData.calpallet.palletcost?.toLocaleString() || '0.00'
              }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">ค่าเด็กรถ:</span> <span
              class="font-normal text-gray-700">{{ summaryData.calpallet.helper_cost?.toLocaleString() || '0.00'
              }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">Extra:</span> <span
              class="font-normal text-green-700">{{ summaryData.calpallet.EXTRA?.toLocaleString() || '0.00' }}</span>
          </div>
          <div class="flex justify-between min-w-[220px]"><span class="font-bold text-gray-600">Grand Total:</span>
            <span class="font-normal text-green-700">{{ summaryData.calpallet.COST?.toLocaleString() || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <!-- Empty State Before Search -->
      <div v-else-if="!hasSearched" class="p-8 text-center text-gray-400">
        <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-4" />
        <p class="text-lg font-medium mb-2">กรุณากรอกข้อมูลให้ครบ แล้วกดค้นหา</p>
        <div class="mt-4 flex flex-col items-center space-y-2 text-xs">
          <div class="flex items-center space-x-2">
            <Icon :icon="shipmentNo ? 'mdi:check-circle' : 'mdi:circle-outline'"
              :class="shipmentNo ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
            <span :class="shipmentNo ? 'text-gray-700' : 'text-gray-400'">
              Shipment No. : {{ shipmentNo ? shipmentNo : 'ยังไม่กรอก' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon :icon="selectedRoudcosPay ? 'mdi:check-circle' : 'mdi:circle-outline'"
              :class="selectedRoudcosPay ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
            <span :class="selectedRoudcosPay ? 'text-gray-700' : 'text-gray-400'">
              ช่องทาง : {{ selectedRoudcosPay ? 'เลือกแล้ว' : 'ยังไม่เลือก' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon :icon="selectedCodeTruck ? 'mdi:check-circle' : 'mdi:circle-outline'"
              :class="selectedCodeTruck ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
            <span :class="selectedCodeTruck ? 'text-gray-700' : 'text-gray-400'">
              รถร่วม : {{ selectedCodeTruck ? 'เลือกแล้ว' : 'ยังไม่เลือก' }}
            </span>
          </div>
        </div>
      </div>
      <!-- Data Table with Custom Scrollbar -->
      <div v-else>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-4">
          <div class="flex items-center justify-center flex-row">
            <!-- Record Count -->
            <ResultCount :label="'ผลลัพธ์:'" :current="searchQuery ? filteredTransportCostData.length : null"
              :total="transportCostData.length" icon="mdi:table" iconColor="#00569D" class="" />
          </div>
          <div class="flex items-center gap-2">

            <button type="button" @click="exportToExcel" :disabled="!filteredTransportCostData.length"
              class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
              Export Excel
            </button>

                        <button type="button" @click="exportToPdf" :disabled="!filteredTransportCostData.length || isPrinting"
              class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="!isPrinting" icon="mdi:printer" width="16" height="16" class="mr-1.5" />
              <svg v-else class="animate-spin mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              {{ isPrinting ? 'กำลังสร้างหน้าพิมพ์...' : 'พิมพ์รายงาน' }}
            </button>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
            </div>
          </div>
        </div>

        <div class="relative shadow-md sm:rounded-lg custom-scrollbar p-2 overflow-x-auto overflow-y-hidden"
          style="max-height: calc(100vh - 320px);">
          <div class="virtual-table-container rounded-t-lg  overflow-auto" style="height: calc(100vh - 320px);"
            @scroll="handleScroll">
            <table
              class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 mb-4">
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">

                <tr>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-6">No</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-8">อำเภอ</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-20">ประเภท</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-20">เลขที่เอกสาร</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-20">จำนวน FG</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center w-16">อัตราค่าขนส่ง</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 w-2">ค่าขนส่ง</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 w-40">ราคาพิเศษ</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-1 py-1 w-28">รวมค่าขนส่ง</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredTransportCostData.length === 0">
                  <td colspan="9"
                    class="border border-gray-300 dark:border-gray-600 px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <Icon icon="mdi:database-off" class="w-8 h-8 mx-auto mb-2" />
                    ไม่พบข้อมูลค้นหา
                  </td>
                </tr>
                <tr v-else v-for="(item, index) in filteredTransportCostData" :key="item.ORNO">
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ index + 1 }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.ROUDES }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.ORTP }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.ORNO }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.FG_AMOUNT }}
                  </td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.FORCOST }}
                  </td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.Cost_transport
                  }}
                  </td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.SP_Cost }}
                  </td>
                  <td class="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{{ item.Total_cost }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF Modal -->
    <div v-if="showPdfModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closePdfModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <!-- Modal header -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              รายงานค่าขนส่ง - {{ pdfFileName }}
            </h3>
            <div class="flex items-center gap-2">
              <button @click="downloadPdf" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Icon icon="mdi:download" class="w-4 h-4 mr-1" />
                ดาวน์โหลด
              </button>
              <button @click="closePdfModal" class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Icon icon="mdi:close" class="w-4 h-4 mr-1" />
                ปิด
              </button>
            </div>
          </div>

          <!-- Modal body -->
          <div class="bg-white px-4 py-5 sm:p-6">
            <div class="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
              <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full" frameborder="0"></iframe>
              <div v-else class="flex items-center justify-center h-full">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';
import { useReportTmsStore } from '@/stores/modules/reportTms';
import { storeToRefs } from 'pinia';
import { showError } from '@/utils/toast';
import PageHeader from '@/components/PageHeader.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import theme from 'tailwindcss/defaultTheme';

const reportTmsStore = useReportTmsStore();
const { roudcosPayOptions, codeTruckOptions } = storeToRefs(reportTmsStore);
const { fetchTransportCostOptions, fetchTransportCostData } = reportTmsStore;

const shipmentNo = ref('');
const selectedRoudcosPay = ref('');
const selectedCodeTruck = ref('');
const searchQuery = ref('');
const hasSearched = ref(false);
const transportCostData = ref([]);
const isLoading = ref(false);
const isPrinting = ref(false);

// Summary data
const summaryData = ref({
  truckInfo: {
    DAFWNO: '',
    IDSUNM: '',
    DAE0B4: ''
  },
  calpallet: {
    DSDT:'',
    CONN: '',
    FG_AMOUNT: 0,
    Total_cost: 0,
    palletcost: 0,
    helper_cost: 0,
    EXTRA: 0,
    COST: 0,
    ISPERCEN: '',
    OILRETENTION: 0
  }
});

async function handleSearch() {
  hasSearched.value = true;
  isLoading.value = true;
  try {
    const response = await fetchTransportCostData({
      shipmentId: shipmentNo.value,
      channelId: selectedRoudcosPay.value,
      truckId: selectedCodeTruck.value,
    });

    // Extract data from response
    if (response && response.data) {
      transportCostData.value = response.data.show_data || [];

      // Extract summary data
      if (response.data.summaryDataObj) {
        const summary = response.data.summaryDataObj;

        // Truck info
        if (summary.show_truck && summary.show_truck.length > 0) {
          summaryData.value.truckInfo = {
            DAFWNO: summary.show_truck[0].DAFWNO?.trim() || '',
            IDSUNM: summary.show_truck[0].IDSUNM || '',
            DAE0B4: summary.show_truck[0].DAE0B4 || ''
          };
        }

        // Calpallet info
        if (summary.calpallet && summary.calpallet.length > 0) {
          const calpallet = summary.calpallet[0];
          summaryData.value.calpallet = {
            DSDT: calpallet.DSDT || '',
            CONN: calpallet.CONN || '',
            FG_AMOUNT: calpallet.FG_AMOUNT || 0,
            Total_cost: calpallet.Total_cost || 0,
            palletcost: calpallet.palletcost || 0,
            helper_cost: calpallet.helper_cost || 0,
            EXTRA: calpallet.EXTRA || 0,
            COST: calpallet.COST || 0,
            ISPERCEN: calpallet.ISPERCEN || '',
            OILRETENTION: calpallet.OILRETENTION || 0
          };
        }
      }
    } else {
      transportCostData.value = [];
      summaryData.value = {
        truckInfo: { DAFWNO: '', IDSUNM: '', DAE0B4: '' },
        calpallet: { DSDT:'',CONN: '', FG_AMOUNT: 0, Total_cost: 0, palletcost: 0, helper_cost: 0, EXTRA: 0, COST: 0, ISPERCEN: '', OILRETENTION: 0 }
      };
    }
  } catch (e) {
    showError('เกิดข้อผิดพลาด', e.message || e);
    transportCostData.value = [];
    summaryData.value = {
      truckInfo: { DAFWNO: '', IDSUNM: '', DAE0B4: '' },
      calpallet: {DSDT:'', CONN: '', FG_AMOUNT: 0, Total_cost: 0, palletcost: 0, helper_cost: 0, EXTRA: 0, COST: 0, ISPERCEN: '', OILRETENTION: 0 }
    };
  } finally {
    isLoading.value = false;
  }
};

const filteredTransportCostData = computed(() => {
  if (!searchQuery.value) return transportCostData.value;
  const q = searchQuery.value.toLowerCase();
  return transportCostData.value.filter(item =>
    (item.ROUDES && item.ROUDES.toLowerCase().includes(q)) ||
    (item.ORTP && item.ORTP.toLowerCase().includes(q)) ||
    (item.ORNO && item.ORNO.toLowerCase().includes(q))
  );
});

onMounted(() => {
  fetchTransportCostOptions();

  // Restore values from localStorage
  shipmentNo.value = localStorage.getItem('shipment_cost_shipmentNo') || '';
  selectedRoudcosPay.value = localStorage.getItem('shipment_cost_roudcosPay') || '';
  selectedCodeTruck.value = localStorage.getItem('shipment_cost_codeTruck') || '';
});

// Watch for changes and save to localStorage
watch(shipmentNo, (val) => {
  localStorage.setItem('shipment_cost_shipmentNo', val || '');
});

watch(selectedRoudcosPay, (val) => {
  localStorage.setItem('shipment_cost_roudcosPay', val || '');
});

watch(selectedCodeTruck, (val) => {
  localStorage.setItem('shipment_cost_codeTruck', val || '');
});

const exportToExcel = async () => {
  if (!filteredTransportCostData.value.length) return;
  const summary = summaryData.value;
  const now = new Date();
  const dateStr = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
  const filename = `shipment_cost_report_${summary.calpallet.CONN || dateStr}.xlsx`;

  // สร้าง workbook/worksheet
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('รายงานค่าขนส่ง');

  // Header section
  sheet.addRow(['', '', '', 'รายงานค่าขนส่ง', '', '', '', '', '']); // r0
  sheet.addRow(['รหัส : '+summary.truckInfo.DAFWNO || '', '', 'ชื่อ : '+summary.truckInfo.IDSUNM || '', '', 'เส้นทาง : '+summary.truckInfo.DAE0B4 || '', '', '', '', '']); // r1
  sheet.addRow(['เลขที่ : '+summary.calpallet.CONN || '', '', 'วันที่ : '+summary.calpallet.DSDT, '', '', '', '', '', '']); // r2
  sheet.addRow([]); // r3 (empty)

  // Table header
  sheet.addRow(['อำเภอ', 'ประเภท', 'เลขที่เอกสาร', 'จำนวน', 'ราคา/หีบ', 'ค่าขนส่ง', 'ราคาพิเศษ', 'รวมค่าขนส่ง']); // r4
  // Center align the table header row
  sheet.getRow(5).eachCell(cell => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { bold: true };
  });

  // Table data
  filteredTransportCostData.value.forEach((item, idx) => {
    const row = sheet.addRow([
      item.ROUDES || '',
      item.ORTP || '',
      item.ORNO || '',
      item.FG_AMOUNT && Number(item.FG_AMOUNT) !== 0 ? Number(item.FG_AMOUNT).toFixed(2) : '-',
      item.FORCOST && Number(item.FORCOST) !== 0 ? Number(item.FORCOST).toFixed(2) : '-',
      item.Cost_transport && Number(item.Cost_transport) !== 0 ? Number(item.Cost_transport).toFixed(2) : '-',
      item.SP_Cost && Number(item.SP_Cost) !== 0 ? Number(item.SP_Cost).toFixed(2) : '-',
      item.Total_cost && Number(item.Total_cost) !== 0 ? Number(item.Total_cost).toFixed(2) : '-',
    ]);
    // Center align columns 1-3, right align columns 4-8
    row.eachCell((cell, colNumber) => {
      if (colNumber >= 4 && colNumber <= 8) {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  });

  // Sum row
  const sumQty = filteredTransportCostData.value.reduce((sum, r) => sum + (Number(r.FG_AMOUNT) || 0), 0);
  const sumTotal = filteredTransportCostData.value.reduce((sum, r) => sum + (Number(r.Total_cost) || 0), 0);
  sheet.addRow(['', '', '', sumQty, '', '', '', sumTotal]);

  // ช่องว่าง
  sheet.addRow([]);

  // สรุปค่าต่างๆ
  [
    ['ปรับราคาน้ำมัน', (summary.calpallet.OILRETENTION || 0) + '%'],
    ['ค่าเที่ยว', summary.calpallet.helper_cost?.toLocaleString() || '0.00'],
    ['ค่าพาเลท', summary.calpallet.palletcost?.toLocaleString() || '0.00'],
    ['เงินพิเศษ', summary.calpallet.EXTRA?.toLocaleString() || '0.00'],
    ['รวมทั้งสิ้น', summary.calpallet.COST?.toLocaleString() || '0.00']
  ].forEach(arr => {
    const row = sheet.addRow(['', '', '', '', '', '', arr[0], arr[1]]);
    row.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };
  });

  // ช่องว่าง
  sheet.addRow([]);
  sheet.addRow([]);

  // ช่องเซ็นชื่อ
  const signRow = sheet.addRow(['ผู้จัดทำรายงาน……………………………………', '', '', '', '', 'ผู้รับรองรายงาน……………………………………', '', '', '']);
  // Merge columns 1-2 for ผู้จัดทำรายงาน and 6-7 for ผู้รับรองรายงาน
  const signRowIdx2 = signRow.number;
  sheet.mergeCells(`A${signRowIdx2}:C${signRowIdx2}`);
  sheet.mergeCells(`F${signRowIdx2}:H${signRowIdx2}`);

  // ช่องว่าง
  sheet.addRow([]);
  sheet.addRow([]);

  // หมายเหตุรวมจำนวน/ค่าขนส่งแยกตามประเภท
  const typeMap = {};
  filteredTransportCostData.value.forEach(item => {
    if (!typeMap[item.ORTP]) typeMap[item.ORTP] = { qty: 0, total: 0 };
    typeMap[item.ORTP].qty += Number(item.FG_AMOUNT) || 0;
    typeMap[item.ORTP].total += Number(item.Total_cost) || 0;
  });
  sheet.addRow([`รวมจำนวนแยกตามประเภท: A11(011)=0, 021=0, 921=0, 041=${typeMap['041']?.qty || 0}, 941=0, T05=${typeMap['T05']?.qty || 0}`]);
  sheet.addRow([`รวมค่าขนส่งแยกตามประเภท: A11(011)=0.00, 021=0.00, 921=0.00, 041=${typeMap['041']?.total?.toFixed(2) || '0.00'}, 941=0.00, T05=${typeMap['T05']?.total?.toFixed(2) || '0.00'}`]);

  // Merge cells (ตาม layout เดิม)
  sheet.mergeCells('D1:H1'); // รายงานค่าขนส่ง
  sheet.mergeCells('A2:B2'); // L030060
  sheet.mergeCells('C2:D2'); // ชื่อ
  sheet.mergeCells('E2:F2'); // หมายเหตุ
  sheet.mergeCells('A3:B3'); // shipment
  sheet.mergeCells('C3:D3'); // วันที่
  // sum row merge
  const tableStart = 5;
  const tableEnd = tableStart + filteredTransportCostData.value.length - 1;
  const sumRowIdx = tableEnd + 1;
  sheet.mergeCells(`A${sumRowIdx + 1}:C${sumRowIdx + 1}`);
  // ช่องเซ็นชื่อ
  const signRowIdx = sumRowIdx + 8;
  sheet.mergeCells(`A${signRowIdx + 1}:E${signRowIdx + 1}`);
  sheet.mergeCells(`F${signRowIdx + 1}:H${signRowIdx + 1}`);
  // หมายเหตุ
  const note1RowIdx = signRowIdx + 3;
  const note2RowIdx = note1RowIdx + 1;
  sheet.mergeCells(`A${note1RowIdx + 1}:H${note1RowIdx + 1}`);
  sheet.mergeCells(`A${note2RowIdx + 1}:H${note2RowIdx + 1}`);

  // Set column widths
  sheet.columns = [
    { width: 16 }, { width: 10 }, { width: 16 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 16 }, { width: 16 }
  ];

  // Set page setup for A4
  sheet.pageSetup.paperSize = 9; // A4
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;
  sheet.pageSetup.fitToHeight = 1;
  sheet.pageSetup.orientation = 'portrait';
  sheet.pageSetup.centerHorizontally = true;
sheet.pageSetup.centerVertically = true;

  // Apply font Angsana New size 16 to all cells
  for (let row = 1; row <= sheet.rowCount; row++) {
    const rowObj = sheet.getRow(row);
    rowObj.eachCell((cell) => {
      cell.font = {
        name: 'Angsana New',
        size: 16
      };
    });
  }

  // Border เฉพาะหัวตาราง+ข้อมูล+sum
  for (let r = tableStart; r <= sumRowIdx; ++r) {
    for (let c = 1; c <= 8; ++c) {
      const cell = sheet.getRow(r).getCell(c);
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
  // ใส่ border ซ้ำให้ cell รวม (350, 3150) ของแถว sum
  const sumRow = sheet.getRow(sumRowIdx + 1);
  [4, 8].forEach(c => {
    const cell = sumRow.getCell(c);
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Save file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
};

const showPdfModal = ref(false);
const pdfUrl = ref(null);
const pdfFileName = ref('');

const exportToPdf = async () => {
  if (!filteredTransportCostData.value.length || isPrinting.value) return;
  
  isPrinting.value = true;
  const summary = summaryData.value;
  const now = new Date();
  const dateStr = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
  const filename = `shipment_cost_report_${summary.calpallet.CONN || dateStr}.pdf`;
  pdfFileName.value = filename;

  // สร้าง PDF document
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // เพิ่ม font Sarabun สำหรับภาษาไทย
  doc.addFont('/my-fonts/THSarabun.ttf', 'Sarabun', 'normal');
  doc.addFont('/my-fonts/THSarabun-Bold.ttf', 'Sarabun', 'bold');
  
  // ตั้งค่า font สำหรับภาษาไทย
  doc.setFont('Sarabun');
  doc.setFontSize(14);

  // ตั้งค่า margins
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (margin * 2);

  let yPosition = margin;

  // Header - รายงานค่าขนส่ง (ตาม layout ภาพ)
  doc.setFontSize(16);
  doc.setFont('Sarabun', 'bold');

const title = 'รายงานค่าขนส่ง';
const textWidth = doc.getTextWidth(title);
const xCenter = (pageWidth - textWidth) / 2;

doc.text(title, xCenter, yPosition); // yPosition คือตำแหน่งแนวตั้งเริ่มต้น
yPosition += 5; // เพิ่มระยะห่างก่อนเริ่มตาราง

  // สร้างตาราง header แบบไม่มีเส้น
  const headerData = [
    [String('รหัส : '+summary.truckInfo.DAFWNO || ''),String('ชื่อ : '+summary.truckInfo.IDSUNM || ''), String('เส้นทาง : '+summary.truckInfo.DAE0B4 || '')],
    [String('เลขที่ : '+summary.calpallet.CONN || ''), String('วันที่ : '+dateStr) , '']
  ];

  autoTable(doc, {
    startY: yPosition,
    body: headerData,
    theme: 'plain',
    styles: {
      fontSize: 14,
      font: 'Sarabun',
      textColor: 0,
      cellPadding:0.5
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0,
      lineColor: [255, 255, 255],
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0,
      lineColor: [255, 255, 255]
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0,
      lineColor: [255, 255, 255]
    },
    margin: { top: 10, right: margin, bottom: 10, left: margin },
    didParseCell: function(data) {
      const { cell } = data;

    // แถวที่ 2
    if ( data.row.index === 0) {
      if (data.column.index === 0) data.cell.styles.halign = 'left';
      if (data.column.index === 1) data.cell.styles.halign = 'left';
      if (data.column.index === 2) data.cell.styles.halign = 'left';
    }
    // แถวที่ 3 - เปลี่ยนการจัดตำแหน่ง
    else if (data.row.index === 1) {
      if (data.column.index === 0) data.cell.styles.halign = 'left';  // ชิดขวา
      if (data.column.index === 1) data.cell.styles.halign = 'left'; // กึ่งกลาง
      if (data.column.index === 2) data.cell.styles.halign = 'left';   // ชิดซ้าย
    }

    const boldLabels = ['รหัส :', 'ชื่อ :', 'เส้นทาง :', 'เลขที่ :', 'วันที่ :'];
  boldLabels.forEach(label => {
    if (cell.raw?.startsWith(label)) {
      // ใช้เทคนิคแบบง่าย ทำให้ทั้ง cell เป็น bold (ถ้าคำขึ้นต้นตรงกับ label)
      cell.styles.fontStyle = 'bold';
    }
  });

  // ปรับตำแหน่งตามเดิม
  if (data.row.index === 0 || data.row.index === 1) {
    data.cell.styles.halign = 'left';
  }
  }
    
  });

  yPosition = doc.lastAutoTable.finalY + 5;

  // สร้างตารางข้อมูล
  const tableData = [
    ['อำเภอ', 'ประเภท', 'เลขที่เอกสาร', 'จำนวน', 'ราคา/หีบ', 'ค่าขนส่ง', 'ราคาพิเศษ', 'รวมค่าขนส่ง']
  ];

  // เพิ่มข้อมูลในตาราง
  filteredTransportCostData.value.forEach(item => {
    tableData.push([
      String(item.ROUDES || ''),
      String(item.ORTP || ''),
      String(item.ORNO || ''),
      (Number(item.FG_AMOUNT || 0) === 0 ? '-' : Number(item.FG_AMOUNT || 0).toLocaleString()),
      (Number(item.FORCOST || 0) === 0 ? '-' : Number(item.FORCOST || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
      (Number(item.Cost_transport || 0) === 0 ? '-' : Number(item.Cost_transport || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
      (Number(item.SP_Cost || 0) === 0 ? '-' : Number(item.SP_Cost || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
      (Number(item.Total_cost || 0) === 0 ? '-' : Number(item.Total_cost || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    ]);
  });

  // คำนวณผลรวม
  const sumQty = filteredTransportCostData.value.reduce((sum, r) => sum + (Number(r.FG_AMOUNT) || 0), 0);
  const sumTotal = filteredTransportCostData.value.reduce((sum, r) => sum + (Number(r.Total_cost) || 0), 0);
  // tableData.push(['', '', '', String(sumQty), '', '', '', String(sumTotal)]);
  tableData.push(['', '', '', String(Number(sumQty || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')), '', '', '', String(Number(sumTotal || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))]);

  // สร้างตาราง
  autoTable(doc, {
    startY: yPosition,
    head: [tableData[0]],
    body: tableData.slice(1, -1), // ไม่รวม header และ sum row
    foot: [tableData[tableData.length - 1]], // sum row
    theme: 'grid',
    styles: {
      fontSize: 14,
      font: 'Sarabun',
      cellPadding: 0.5
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0.1, // ไม่มีเส้นขอบ
      lineColor: 0
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'bold',
      font: 'Sarabun',
      lineWidth: 0.1, // ไม่มีเส้นขอบ
      lineColor: 0,
      halign: 'center'
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0.1, // ไม่มีเส้นขอบ
      lineColor: 0
    },
    columnStyles: {
    0: { halign: 'left' }, // คอลัมน์แรก
    1: { halign: 'center' }, // คอลัมน์ที่ 2
    2: { halign: 'center' }, // คอลัมน์ที่ 3
    3: { halign: 'right' }, // คอลัมน์ที่ 3
    4: { halign: 'right' }, // คอลัมน์ที่ 3
    5: { halign: 'right' }, // คอลัมน์ที่ 3
    6: { halign: 'right' }, // คอลัมน์ที่ 3
    7: { halign: 'right' }, // คอลัมน์ที่ 3
  },
    margin: { top: 10, right: margin, bottom: 10, left: margin },
    didParseCell: function(data) {
    // ถ้าเป็นแถวสุดท้าย (sum row)
    if (data.row.section === 'foot' || data.row.index === data.table.body.length - 1) {
      if (data.column.index === 3) { // คอลัมน์ sumQty
        data.cell.styles.halign = 'right'; // จัดซ้าย
        data.cell.styles.fontStyle = 'normal';
      }
      if (data.column.index === 7) { // คอลัมน์ sumTotal
        data.cell.styles.halign = 'right'; // จัดขวา
        data.cell.styles.fontStyle = 'normal';
      }
    }
  }
  });

  // รับตำแหน่ง Y หลังจากตาราง
  yPosition = doc.lastAutoTable.finalY + 5;

  // สรุปค่าต่างๆ
  const summaryTableData = [
    ['ปรับราคาน้ำมัน', `${summary.calpallet.OILRETENTION || 0}%`],
    ['ค่าเที่ยว', (Number(summary.calpallet.helper_cost || 0) === 0 ? '0.00' : Number(summary.calpallet.helper_cost || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))],
    ['ค่าพาเลท', (Number(summary.calpallet.palletcost || 0) === 0 ? '0.00' : Number(summary.calpallet.palletcost || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))],
    ['เงินพิเศษ', (Number(summary.calpallet.EXTRA || 0) === 0 ? '0.00' : Number(summary.calpallet.EXTRA || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))],
    ['รวมทั้งสิ้น', (Number(summary.calpallet.COST || 0) === 0 ? '0.00' : Number(summary.calpallet.COST || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))]
  ];

  // สร้างตารางสรุป
  autoTable(doc, {
    startY: yPosition,
    body: summaryTableData,
    theme: 'plain',
    styles: {
      fontSize: 14,
      cellPadding: 0.5 ,
      font: 'Sarabun'
    },
    columnStyles: {
    0: { halign: 'left' },
    1: { halign: 'right' }
  },
    margin: {  
      left: pageWidth - 120,
      right: margin 
    },
    didParseCell(data){
      if (data.column.index === 1 && data.row.index === 4) { // คอลัมน์ sumTotal
      data.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawCell(data) {
    if (data.column.index === 1 && data.row.index === 4) {
      const doc = data.doc;
      const x = data.cell.x;
      const y = data.cell.y;
      const w = data.cell.width;
      const h = data.cell.height;

      // 🔹 เส้นบน
      doc.setLineWidth(0.1);
      doc.setDrawColor(0);
      doc.line(x, y, x + w, y);

      // 🔹 เส้นล่างแรก
      doc.line(x, y + h, x + w, y + h);

      // 🔹 เส้นล่างสอง (ต่ำลงอีกนิด)
      doc.line(x, y + h + 1.5, x + w, y + h + 1.5);
    }
  }
  });

  yPosition = doc.lastAutoTable.finalY + 20;

  // ช่องเซ็นชื่อ
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'normal');
  doc.text('ผู้จัดทำรายงาน……………………………………', margin, yPosition);
  
  // ช่องเซ็นชื่อชิดขอบขวา
  const certifierText = 'ผู้รับรองรายงาน………………………………………………';
  const certifierTextWidth = doc.getTextWidth(certifierText);
  doc.text(certifierText, pageWidth - margin - certifierTextWidth, yPosition);
  yPosition += 10;

  // หมายเหตุ
  const typeMap = {};
  filteredTransportCostData.value.forEach(item => {
    if (!typeMap[item.ORTP]) typeMap[item.ORTP] = { qty: 0, total: 0 };
    typeMap[item.ORTP].qty += Number(item.FG_AMOUNT) || 0;
    typeMap[item.ORTP].total += Number(item.Total_cost) || 0;
  });

  // สร้างตารางหมายเหตุ
  const noteTableData = [
    [`รวมจำนวนแยกตามประเภท: A11(011)=0, 021=0, 921=0, 041=${typeMap['041']?.qty || 0}, 941=0, T05=${typeMap['T05']?.qty || 0}`],
    [`รวมค่าขนส่งแยกตามประเภท: A11(011)=0.00, 021=0.00, 921=0.00, 041=${(Number(typeMap['041']?.total || 0) === 0 ? '-' : Number(typeMap['041']?.total || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}, 941=0.00, T05=${(Number(typeMap['T05']?.total || 0) === 0 ? '-' : Number(typeMap['T05']?.total || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}`]
  ];

  autoTable(doc, {
    startY: yPosition,
    body: noteTableData,
    theme: 'plain',
    styles: {
      fontSize: 14,
      font: 'Sarabun',
      textColor: 0,
      cellPadding: 0.5 
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      fontSize: 12,
      // lineWidth: 0.5,
      // lineColor: [128, 128, 128]
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      lineWidth: 0.5,
      lineColor: [128, 128, 128]
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'normal',
      font: 'Sarabun',
      // lineWidth: 0.5,
      // lineColor: [128, 128, 128]
    },
    margin: { top: 10, right: margin, bottom: 10, left: margin },
    columnStyles: {
      0: { cellWidth: pageWidth - (margin * 2) }
    }
  });

  // สร้าง PDF และเปิดหน้าพิมพ์ในหน้าเดิม
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // สร้าง iframe ซ่อนไว้ในหน้าเดิม
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  
  // รอให้ PDF โหลดเสร็จแล้วเปิดหน้าพิมพ์ในหน้าเดิม
  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow.print();
      } catch (error) {
        console.log('Print dialog opened');
      }
      // Reset printing state after a delay
      setTimeout(() => {
        isPrinting.value = false;
      }, 2000);
    }, 1000);
  };
};

const closePdfModal = () => {
  showPdfModal.value = false;
  pdfUrl.value = null;
  pdfFileName.value = '';
};

const downloadPdf = () => {
  if (pdfUrl.value) {
    saveAs(pdfUrl.value, pdfFileName.value);
    closePdfModal();
  }
};

</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: #475569 #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
    border: 2px solid #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
}

.edit-row td {
  border-bottom: 2px solid #fbbf24;
  /* amber-400 */
}

.edit-row:hover {
  background-color: transparent !important;
}

.edit-row-content {
  border-bottom: 2px solid #fbbf24;
  /* amber-400 */
}

/* Slide and Fade Transition */
.slide-fade-enter-active {
  transition: all 0.8s ease-in-out;
}

.slide-fade-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Virtual scrolling styles */
.virtual-table-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.virtual-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-table-container::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Ensure table rows have consistent height */
.virtual-table-container tbody tr {
  height: 40px;
}

/* Smooth scrolling */
.virtual-table-container {
  scroll-behavior: smooth;
}
</style>

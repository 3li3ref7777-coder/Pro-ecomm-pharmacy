<template>
  <div class="dashboard-wrapper" dir="rtl">
    <!-- Toast Notification System -->
    <div class="toast-container position-fixed top-0 start-0 p-3" style="z-index: 1090;">
      <div 
        v-if="toast.show" 
        :class="['toast show align-items-center text-white border-0 shadow-lg', toast.type === 'success' ? 'bg-success' : 'bg-danger']" 
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2 fs-6 fw-semibold">
            <i :class="toast.type === 'success' ? 'fas fa-check-circle fs-5' : 'fas fa-exclamation-circle fs-5'"></i>
            <span>{{ toast.message }}</span>
          </div>
          <button type="button" class="btn-close btn-close-white ms-2 m-auto" @click="toast.show = false"></button>
        </div>
      </div>
    </div>

    <!-- Header / Navbar -->
    <header class="custom-navbar shadow-sm sticky-top bg-white">
      <div class="container-fluid px-4 d-flex align-items-center justify-content-between py-2">
        <div class="brand-logo d-flex align-items-center gap-2 cursor-pointer" @click="currentTab = 'home'">
          <div class="logo-icon-bg">
            <i class="fas fa-pills text-white"></i>
          </div>
          <span class="fs-4 fw-bold">RareMed <strong class="text-primary">Connect</strong></span>
        </div>

        <nav class="d-none d-md-flex align-items-center gap-4">
          <a 
            href="#" 
            :class="['nav-link-custom', { active: currentTab === 'home' }]" 
            @click.prevent="currentTab = 'home'"
          >
            <i class="fas fa-search ms-1"></i> الأدوية
          </a>
          <a 
            href="#" 
            :class="['nav-link-custom', { active: currentTab === 'orders' }]" 
            @click.prevent="currentTab = 'orders'"
          >
            <i class="fas fa-clipboard-list ms-1"></i> طلباتي
            <span v-if="ordersList.length" class="badge bg-primary rounded-pill me-1">{{ ordersList.length }}</span>
          </a>
          <router-link to="/about" class="nav-link-custom">
            <i class="fas fa-info-circle ms-1"></i> عن التطبيق
          </router-link>
        </nav>

        <div class="d-flex align-items-center gap-3">
          <!-- Cart Button -->
          <button 
            class="btn btn-outline-primary position-relative rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
            @click="showCartModal = true"
          >
            <i class="fas fa-shopping-bag fs-5"></i>
            <span class="d-none d-sm-inline">السلة</span>
            <span v-if="cartCount > 0" class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
              {{ cartCount }}
            </span>
          </button>

          <!-- User Dropdown Profile -->
          <div v-if="currentUser" class="dropdown">
            <button 
              class="btn btn-light rounded-pill border d-flex align-items-center gap-2 px-3 py-1 dropdown-toggle"
              type="button" 
              id="userDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <div class="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                {{ currentUser.firstName ? currentUser.firstName[0].toUpperCase() : 'U' }}
              </div>
              <span class="fw-semibold d-none d-lg-inline">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-start shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
              <li>
                <a class="dropdown-menu-item dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="openEditProfileModal">
                  <i class="fas fa-user-edit text-muted"></i> تعديل الملف الشخصي
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-menu-item dropdown-item text-danger d-flex align-items-center gap-2" href="#" @click.prevent="handleLogout">
                  <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <!-- TAB 1: HOME & MEDICINES SEARCH -->
    <main v-if="currentTab === 'home'">
      <!-- Hero Section -->
      <section class="hero-banner py-5 text-white">
        <div class="container text-center py-4">
          <span class="badge bg-light text-primary px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">
            دليل الأدوية المصرية الموثوق
          </span>
          <h1 class="display-5 fw-extrabold mb-3">ابحث عن الأدوية الشائعة والنادرة</h1>
          <p class="lead opacity-90 mx-auto mb-4" style="max-width: 650px;">
            تصفح قاعدة بيانات الأدوية المصرية بالأسعار الرسمية والشركات المصنعة والاستخدامات الطبية.
          </p>

          <!-- Search Box -->
          <div class="search-box-wrapper mx-auto shadow-lg rounded-pill bg-white p-2 d-flex align-items-center" style="max-width: 720px;">
            <i class="fas fa-search text-muted fs-5 me-3"></i>
            <input 
              type="text" 
              class="form-control border-0 shadow-none pe-3 fs-6"
              v-model="searchQuery" 
              @input="currentPage = 1"
              placeholder="ابحث باسم الدواء، الشركة، أو دواعي الاستعمال..."
            />
            <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold text-nowrap me-2">
              بحث
            </button>
          </div>
        </div>
      </section>

      <!-- Main Medicines Grid Section -->
      <section class="container py-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 class="fw-bold m-0 text-dark">الأدوية المتاحة</h3>
            <p class="text-muted small m-0">عرض {{ paginatedMedicines.length }} من إجمالي {{ filteredMedicines.length }} دواء</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">حالة التوفر:</span>
            <select 
              v-model="selectedCategory" 
              @change="currentPage = 1"
              class="form-select form-select-sm border-0 bg-light shadow-sm fw-semibold" 
              style="width: auto;"
            >
              <option value="all">كل الأدوية</option>
              <option value="available">متوفر بالصيدليات</option>
              <option value="limited">كمية محدودة / نادر</option>
            </select>
          </div>
        </div>

        <!-- Medicine Cards Grid -->
        <div class="row g-4" v-if="paginatedMedicines.length > 0">
          <div 
            class="col-12 col-sm-6 col-lg-4 col-xl-3" 
            v-for="med in paginatedMedicines" 
            :key="med.id"
          >
            <div class="card h-100 border-0 shadow-sm rounded-4 hover-lift overflow-hidden position-relative">
              <div class="position-absolute top-0 start-0 m-3" style="z-index: 2;">
                <span :class="['badge rounded-pill px-2 py-1 small fw-semibold', getStatusBadgeClass(med.statusClass)]">
                  {{ med.status }}
                </span>
              </div>

              <!-- Custom Form-Based Graphic Icon Box -->
              <div :class="['card-img-top d-flex flex-column align-items-center justify-content-center p-3 position-relative', getFormBgClass(med.type)]" style="height: 180px;">
                <div class="med-type-icon mb-2">
                  <i :class="getFormIconClass(med.type)"></i>
                </div>
                <span class="badge bg-white text-dark shadow-sm px-3 py-1 rounded-pill small fw-bold">{{ med.type }}</span>
              </div>

              <div class="card-body d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="text-muted small fw-bold text-uppercase tracking-wider">{{ med.company }}</span>
                  </div>
                  <h5 class="fw-bold text-dark mb-1">{{ med.name }}</h5>
                  <p class="text-secondary small mb-3 line-clamp-2">{{ med.use }}</p>
                </div>

                <div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fs-4 fw-extrabold text-primary">{{ med.price }} ج.م</span>
                    <span class="small text-muted"><i class="fas fa-boxes ms-1"></i>المخزون: {{ med.stock }}</span>
                  </div>

                  <button 
                    class="btn btn-primary w-100 rounded-3 fw-bold py-2 d-flex align-items-center justify-content-center gap-2" 
                    @click="addToCart(med)"
                    :disabled="med.stock === 0"
                  >
                    <i class="fas fa-cart-plus"></i> إضافة للطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5 bg-light rounded-4 my-4">
          <i class="fas fa-prescription-bottle-alt display-3 text-muted mb-3 opacity-50"></i>
          <h5 class="fw-bold text-secondary">لم يتم العثور على أدوية</h5>
          <p class="text-muted small">جرب البحث باسم دواء آخر أو تعديل الفلتر.</p>
        </div>

        <!-- Pagination Controls -->
        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
          <ul class="pagination pagination-rounded gap-1">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-item-btn border-0 shadow-sm" @click="currentPage--">
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
            <li 
              v-for="page in totalPages" 
              :key="page" 
              class="page-item" 
              :class="{ active: currentPage === page }"
            >
              <button class="page-item-btn border-0 shadow-sm fw-bold" @click="currentPage = page">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-item-btn border-0 shadow-sm" @click="currentPage++">
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </main>

    <!-- TAB 2: ORDERS HISTORY -->
    <main v-else-if="currentTab === 'orders'" class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 class="fw-extrabold text-dark m-0"><i class="fas fa-receipt text-primary ms-2"></i>سجل الطلبات</h2>
          <p class="text-muted m-0 small">متابعة وإدارة طلبات الأدوية المقدمة</p>
        </div>
        <button class="btn btn-outline-primary fw-bold rounded-pill px-4" @click="currentTab = 'home'">
          <i class="fas fa-plus ms-1"></i> طلب جديد
        </button>
      </div>

      <!-- Orders List -->
      <div v-if="ordersList.length > 0" class="d-flex flex-column gap-4">
        <div 
          v-for="order in ordersList" 
          :key="order.id" 
          class="card border-0 shadow-sm rounded-4 overflow-hidden"
        >
          <div class="card-header bg-light border-0 d-flex flex-wrap justify-content-between align-items-center py-3 px-4 gap-2">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-square bg-white text-primary rounded-3 shadow-sm p-2">
                <i class="fas fa-box-open fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-0">رقم الطلب: #{{ order.id }}</h6>
                <span class="text-muted small"><i class="far fa-calendar-alt ms-1"></i>{{ order.date }}</span>
              </div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2 rounded-pill fw-semibold">
                <i class="fas fa-clock ms-1"></i> {{ order.status }}
              </span>
            </div>
          </div>

          <div class="card-body px-4">
            <div class="table-responsive">
              <table class="table align-middle table-hover mb-0">
                <thead>
                  <tr class="text-muted small border-bottom">
                    <th>الدواء</th>
                    <th>سعر الوحدة</th>
                    <th>الكمية</th>
                    <th class="text-end">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in order.items" :key="idx">
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="rounded-2 border p-2 text-primary bg-light text-center" style="width: 40px; height: 40px;">
                          <i :class="getFormIconClass(item.type)"></i>
                        </div>
                        <div>
                          <div class="fw-bold text-dark">{{ item.name }}</div>
                          <div class="text-muted small">{{ item.company }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="fw-semibold">{{ item.price }} ج.م</td>
                    <td><span class="badge bg-light text-dark border px-2 py-1">x{{ item.quantity }}</span></td>
                    <td class="fw-bold text-end text-success">{{ item.price * item.quantity }} ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center px-4 py-3 border-top">
            <span class="text-muted small"><i class="fas fa-shield-alt text-success ms-1"></i> طلب معتمد من الصيدلية الشريكة</span>
            <div class="text-end">
              <span class="text-muted small ms-2">الإجمالي الكلي:</span>
              <span class="fs-4 fw-extrabold text-success">{{ order.total }} ج.م</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5 bg-light rounded-4 my-4">
        <i class="fas fa-folder-open display-3 text-muted mb-3 opacity-50"></i>
        <h5 class="fw-bold text-secondary">لا توجد طلبات سابقة</h5>
        <p class="text-muted small">لم تقم بتقديم أي طلبات أدوية حتى الآن.</p>
        <button class="btn btn-primary rounded-pill px-4 py-2 mt-2 fw-bold" @click="currentTab = 'home'">
          تصفح قائمة الأدوية
        </button>
      </div>
    </main>

    <!-- CART MODAL -->
    <div v-if="showCartModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold d-flex align-items-center gap-2">
              <i class="fas fa-shopping-bag text-primary"></i> أدوية محددة للطلب
            </h5>
            <button type="button" class="btn-close" @click="showCartModal = false"></button>
          </div>

          <div class="modal-body p-4">
            <div v-if="cart.length > 0">
              <div class="table-responsive mb-3">
                <table class="table align-middle">
                  <thead>
                    <tr class="text-muted small">
                      <th>اسم الدواء</th>
                      <th>السعر</th>
                      <th>الكمية</th>
                      <th>الإجمالي الفرعي</th>
                      <th class="text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in cart" :key="index">
                      <td>
                        <div class="fw-bold text-dark">{{ item.name }}</div>
                        <div class="text-muted small">{{ item.company }} ({{ item.type }})</div>
                      </td>
                      <td class="fw-semibold">{{ item.price }} ج.م</td>
                      <td style="width: 100px;">
                        <input 
                          type="number" 
                          min="1" 
                          v-model.number="item.quantity" 
                          class="form-control form-control-sm text-center fw-bold border"
                        />
                      </td>
                      <td class="fw-bold text-success">{{ item.price * item.quantity }} ج.م</td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-light text-danger rounded-circle p-2" @click="removeFromCart(index)" title="حذف">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <span class="text-muted small d-block">المبلغ الإجمالي الإسترشادي:</span>
                  <span class="fs-3 fw-extrabold text-success">{{ cartTotal }} ج.م</span>
                </div>
                <button class="btn btn-success rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" @click="confirmOrder">
                  <i class="fas fa-check-circle"></i> تأكيد وإرسال الطلب
                </button>
              </div>
            </div>

            <!-- Empty Cart State -->
            <div v-else class="text-center py-5">
              <i class="fas fa-shopping-cart display-4 text-muted mb-3 opacity-50"></i>
              <h5 class="fw-bold text-secondary">سلة الطلبات فارغة</h5>
              <p class="text-muted small">قم بإضافة الأدوية من القائمة لتأكيد طلبك.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <div v-if="showEditProfileModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold"><i class="fas fa-user-edit text-primary ms-2"></i>تعديل البيانات الشخصية</h5>
            <button type="button" class="btn-close" @click="showEditProfileModal = false"></button>
          </div>
          <form @submit.prevent="saveProfile">
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">الاسم الأول</label>
                <input type="text" class="form-control rounded-3" v-model="editForm.firstName" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">اسم العائلة</label>
                <input type="text" class="form-control rounded-3" v-model="editForm.lastName" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">رقم الهاتف</label>
                <input type="tel" class="form-control rounded-3" v-model="editForm.phone" placeholder="010XXXXXXXX" required />
              </div>
            </div>
            <div class="modal-footer border-top px-4 py-3">
              <button type="button" class="btn btn-light fw-semibold rounded-pill" @click="showEditProfileModal = false">إلغاء</button>
              <button type="submit" class="btn btn-primary fw-bold rounded-pill px-4">حفظ التغييرات</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive State
const searchQuery = ref('');
const selectedCategory = ref('all');
const currentTab = ref('home');
const showCartModal = ref(false);
const showEditProfileModal = ref(false);

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(8);

const cart = ref([]);
const ordersList = ref([]);
const currentUser = ref(null);

// Toast Notification State
const toast = ref({
  show: false,
  message: '',
  type: 'success'
});

const triggerToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3500);
};

// Profile State
const editForm = ref({
  firstName: '',
  lastName: '',
  phone: ''
});

// Helper Functions to Render Specific Icons and Color Accents Per Form Factor
const getFormIconClass = (type) => {
  switch (type) {
    case 'أقراص': return 'fas fa-pills fs-1 text-primary';
    case 'كبسولات': return 'fas fa-capsules fs-1 text-info';
    case 'فوار':
    case 'أكايس فوارة': return 'fas fa-glass-water-droplet fs-1 text-warning';
    case 'حقن جاهزة':
    case 'حقن عضل': return 'fas fa-syringe fs-1 text-danger';
    case 'بخاخ تنفس': return 'fas fa-spray-can fs-1 text-success';
    case 'جل موضعي': return 'fas fa-pump-soap fs-1 text-secondary';
    case 'قطرة أنف': return 'fas fa-eye-dropper fs-1 text-primary';
    case 'قلم أنسولين': return 'fas fa-pen-nib fs-1 text-dark';
    default: return 'fas fa-prescription-bottle-alt fs-1 text-primary';
  }
};

const getFormBgClass = (type) => {
  switch (type) {
    case 'أقراص': return 'bg-primary-subtle';
    case 'كبسولات': return 'bg-info-subtle';
    case 'فوار':
    case 'أكايس فوارة': return 'bg-warning-subtle';
    case 'حقن جاهزة':
    case 'حقن عضل': return 'bg-danger-subtle';
    case 'بخاخ تنفس': return 'bg-success-subtle';
    case 'جل موضعي': return 'bg-secondary-subtle';
    default: return 'bg-light';
  }
};

// 30 Authentic Egyptian Medicines
const medicines = ref([
  { id: 1, name: "Panadol Extra", type: "أقراص", company: "GSK Egypt", use: "مسكن لآلام الصداع وخافض للحرارة مع الكافيين", price: 34, stock: 45, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 2, name: "Cataflam 50mg", type: "أقراص", company: "Novartis Egypt", use: "مسكن سريع لآلام الأسنان والمفاصل ومضاد للالتهاب", price: 43.5, stock: 30, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 3, name: "Augmentin 1g", type: "أقراص", company: "GSK Egypt", use: "مضاد حيوي واسع المجال لالتهابات الحلق والتنفس", price: 99, stock: 18, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 4, name: "Congestal Tablets", type: "أقراص", company: "SIGMA Egypt", use: "علاج أعراض البرد، الرشح، الاحتقان، وحساسية الأنف", price: 31, stock: 50, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 5, name: "Clexane 40mg Injection", type: "حقن جاهزة", company: "Sanofi Egypt", use: "مضاد للتجلط والوقاية من جلطات الأوردة والأوعية", price: 130, stock: 4, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 6, name: "Concor 5mg Plus", type: "أقراص", company: "Merck Egypt", use: "علاج ضغط الدم المرتفع وتنظيم ضربات القلب", price: 60, stock: 25, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 7, name: "Ventolin Inhaler", type: "بخاخ تنفس", company: "GSK Egypt", use: "موسع للشعب الهوائية لعلاج أزمات الربو وضيق التنفس", price: 38, stock: 6, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 8, name: "Antinal Capsules", type: "كبسولات", company: "Amoun Egypt", use: "مطهر معوي لعلاج حالات النزلات المعوية والإسهال", price: 26, stock: 40, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 9, name: "Lantus SoloStar Pen", type: "قلم أنسولين", company: "Sanofi Egypt", use: "أنسولين طويل المفعول لمرضى السكري", price: 155, stock: 5, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 10, name: "Euthyrox 100mcg", type: "أقراص", company: "Merck Egypt", use: "بديل هرمون الغدة الدرقية لعلاج قصور الغدة", price: 85, stock: 3, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 11, name: "Voltaren Gel 50g", type: "جل موضعي", company: "Novartis Egypt", use: "مضاد لالتهابات الروماتيزم والآلام العضلية والمفاصل", price: 44.5, stock: 22, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 12, name: "Ketofan 100mg", type: "كبسولات", company: "Amoun Egypt", use: "مسكن قوي ومضاد لالتهابات العظام والمفاصل", price: 24, stock: 38, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 13, name: "Glucophage 1000mg XR", type: "أقراص", company: "Merck Egypt", use: "منظم لسكر الدم ومساعد في ضبط الوزن", price: 60, stock: 28, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 14, name: "Alphintern Tablets", type: "أقراص", company: "Amoun Egypt", use: "مضاد للتورم والالتهابات والتجمعات الدموية", price: 54, stock: 35, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 15, name: "Nexium 40mg", type: "أقراص", company: "AstraZeneca", use: "علاج حموضة المعدة، الارتجاع، وقرحة الاثني عشر", price: 146, stock: 12, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 16, name: "Otrivin 0.1% Adult Drops", type: "قطرة أنف", company: "Novartis Egypt", use: "مزيل سريع لاحتقان الأنف وانسداد مجاري التنفس", price: 22, stock: 30, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 17, name: "Cipralex 10mg", type: "أقراص", company: "Lundbeck Egypt", use: "علاج حالات القلق والاضطرابات المزاجية", price: 172, stock: 7, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 18, name: "Zithromax 500mg", type: "أقراص", company: "Pfizer Egypt", use: "مضاد حيوي أزيثرومايسين جرعة 3 أيام", price: 45, stock: 20, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 19, name: "Brufen 600mg Effervescent", type: "فوار", company: "Abbott Egypt", use: "فوار إيبوبروفين لتسكين الآلام الحادة والعظام بسرعة", price: 33, stock: 25, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 20, name: "Neurobion 6 Ampoules", type: "حقن عضل", company: "Merck Egypt", use: "فيتامين ب المركب لتقوية الأعصاب والآلام العصبية", price: 34, stock: 19, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 21, name: "Daflon 500mg", type: "أقراص", company: "Servier Egypt", use: "علاج ضعف الأوردة والدوالي ونزيف البواسير", price: 130, stock: 14, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 22, name: "Telfast 180mg", type: "أقراص", company: "Sanofi Egypt", use: "مضاد للحساسية والارتيكاريا بدون تسبب في الخمول", price: 75, stock: 22, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 23, name: "Duspatalin Retard 200mg", type: "كبسولات", company: "Abbott Egypt", use: "مضاد للتقلصات وعلاج اضطرابات القولون العصبي", price: 70, stock: 17, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 24, name: "Controloc 40mg", type: "أقراص", company: "Takeda Egypt", use: "مثبط لمضخة البروتون لحماية معدة المرضى والارتجاع", price: 92, stock: 15, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 25, name: "Crestor 10mg", type: "أقراص", company: "AstraZeneca", use: "خافض للكولسترول الضار بالدم والوقاية من أمراض القلب", price: 180, stock: 11, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 26, name: "Plavix 75mg", type: "أقراص", company: "Sanofi Egypt", use: "مانع لتجمع الصفائح الدموية للوقاية من التجلطات", price: 205, stock: 8, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 27, name: "Solupred 20mg", type: "أكايس فوارة", company: "Sanofi Egypt", use: "كورتيزون سريع الامتصاص للحساسية الحادة والتهابات الرئة", price: 60, stock: 5, status: "كمية محدودة / نادر", statusClass: "limited" },
  { id: 28, name: "Exforge 5/160mg", type: "أقراص", company: "Novartis Egypt", use: "علاج مركب مزدوج لحالات ضغط الدم المرتفع", price: 168, stock: 10, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 29, name: "Betaserc 16mg", type: "أقراص", company: "Abbott Egypt", use: "علاج أزمات الدوار وطنين الأذن (مرض مينير)", price: 88, stock: 16, status: "متوفر بالصيدليات", statusClass: "available" },
  { id: 30, name: "Catafast 50mg Sachet", type: "أكايس فوارة", company: "Novartis Egypt", use: "فوار سريع مفعول لتسكين آلام الأسنان والصداع النصفي", price: 51, stock: 27, status: "متوفر بالصيدليات", statusClass: "available" }
]);

// Lifecycle
onMounted(() => {
  const user = localStorage.getItem('currentUser');
  if (user) currentUser.value = JSON.parse(user);

  const savedOrders = localStorage.getItem('userOrders');
  if (savedOrders) ordersList.value = JSON.parse(savedOrders);
});

// Computed Filtered List
const filteredMedicines = computed(() => {
  return medicines.value.filter(med => {
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = med.name.toLowerCase().includes(query) ||
                          med.use.toLowerCase().includes(query) ||
                          med.company.toLowerCase().includes(query) ||
                          med.type.toLowerCase().includes(query);
    
    const matchesCategory = selectedCategory.value === 'all' || med.statusClass === selectedCategory.value;
    
    return matchesSearch && matchesCategory;
  });
});

// Computed Paginated Data
const totalPages = computed(() => Math.ceil(filteredMedicines.value.length / itemsPerPage.value));

const paginatedMedicines = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMedicines.value.slice(start, end);
});

const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0));

const cartTotal = computed(() => cart.value.reduce((total, item) => total + (item.price * item.quantity), 0));

// Cart Actions
const addToCart = (med) => {
  const existing = cart.value.find(item => item.id === med.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...med, quantity: 1 });
  }
  triggerToast(`تم إضافة "${med.name}" إلى قائمة طلباتك.`);
};

const removeFromCart = (index) => {
  const removedItem = cart.value[index];
  cart.value.splice(index, 1);
  triggerToast(`تم إزالة "${removedItem.name}" من السلة.`, 'danger');
};

const confirmOrder = () => {
  if (cart.value.length === 0) return;

  const newOrder = {
    id: Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    items: [...cart.value],
    total: cartTotal.value,
    status: 'جاري معالجة الطلب'
  };

  ordersList.value.unshift(newOrder);
  localStorage.setItem('userOrders', JSON.stringify(ordersList.value));

  cart.value = [];
  showCartModal.value = false;
  
  triggerToast('تم تأكيد الطلب بنجاح! تم إضافته إلى سجل طلباتك.');
  currentTab.value = 'orders';
};

// Profile Actions
const openEditProfileModal = () => {
  if (currentUser.value) {
    editForm.value = { ...currentUser.value };
  }
  showEditProfileModal.value = true;
};

const saveProfile = () => {
  currentUser.value = { ...editForm.value };
  localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
  showEditProfileModal.value = false;
  triggerToast('تم تحديث البيانات الشخصية بنجاح.');
};

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  router.push('/login');
};

const getStatusBadgeClass = (statusClass) => {
  return statusClass === 'available' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning-emphasis border border-warning';
};
</script>

<style scoped>
.fw-extrabold {
  font-weight: 800;
}

.cursor-pointer {
  cursor: pointer;
}

.logo-icon-bg {
  width: 38px;
  height: 38px;
  background: var(--bs-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link-custom {
  color: #6c757d;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link-custom:hover, .nav-link-custom.active {
  color: var(--bs-primary);
}

.hero-banner {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dropdown-menu-item {
  padding: 0.5rem 1rem;
  font-weight: 500;
}

.med-type-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

/* Pagination Custom Style */
.page-item-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  color: #0d6efd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-item.active .page-item-btn {
  background: #0d6efd;
  color: #ffffff;
}

.page-item.disabled .page-item-btn {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-item-btn:hover:not(:disabled) {
  background: #e7f1ff;
}
</style>
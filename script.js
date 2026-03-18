// --- FITUR DARK MODE ---
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

// --- FITUR SIDEBAR (LAPTOP & MOBILE) ---
const openSidebarBtn = document.getElementById('openSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const appContainer = document.getElementById('appContainer');

// Fungsi untuk membuka sidebar
function openSidebar() {
    if (window.innerWidth <= 768) {
        // Mode HP: Gunakan class active untuk animasi geser dan munculkan overlay
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    } else {
        // Mode Laptop: Hapus class collapsed untuk memunculkan sidebar kembali
        appContainer.classList.remove('collapsed');
    }
}

// Fungsi untuk menutup/melipat sidebar
function closeSidebar() {
    if (window.innerWidth <= 768) {
        // Mode HP: Sembunyikan sidebar dan overlay
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    } else {
        // Mode Laptop: Tambahkan class collapsed untuk melipat sidebar ke samping
        appContainer.classList.add('collapsed');
    }
}

// Pasang event pendengar klik (Event Listeners)
openSidebarBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// (Opsional) Rapikan tampilan jika pengguna me-resize jendela dari HP ke Laptop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
});

// --- FITUR MENU AKTIF DAN PINDAH KONTEN ---

const menuItems = document.querySelectorAll('.menu-item');
// Ambil semua elemen konten (Dashboard, Materi 1, Materi 2)
const contentSections = document.querySelectorAll('.content-section'); 

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); 

        // 1. Pindahkan status warna abu-abu ke menu yang ditekan
        menuItems.forEach(menu => menu.classList.remove('active'));
        this.classList.add('active');

        // 2. Cari tahu konten apa yang harus ditampilkan (dari data-target)
        const targetId = this.getAttribute('data-target');

        // 3. Sembunyikan semua konten terlebih dahulu
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // 4. Tampilkan HANYA konten yang ID-nya cocok dengan target
        if (targetId) {
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }

        // (Opsional & Sangat Berguna)
        // Jika dibuka di HP, otomatis tutup sidebar setelah memilih menu
        if (window.innerWidth <= 768) {
            closeSidebar(); 
        }
    });
});

// --- FITUR PENCARIAN (LIVE SEARCH & KEYBOARD NAVIGATION) ---

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let currentFocus = -1; // Variabel untuk mengingat urutan item yang sedang di-highlight

// 1. Mendengarkan saat pengguna MENGETIK huruf
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    searchResults.innerHTML = ''; 
    currentFocus = -1; // Reset fokus setiap kali ketikan berubah

    if (query.length > 0) {
        let hasResults = false;

        menuItems.forEach(item => {
            const menuText = item.textContent.toLowerCase();
            
            if (menuText.includes(query)) {
                hasResults = true;
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('search-result-item');
                resultDiv.textContent = item.textContent;

                // Event saat di-klik dengan MOUSE
                resultDiv.addEventListener('click', () => {
                    item.click(); // Pindah konten
                    searchInput.value = ''; // Bersihkan input
                    searchResults.classList.remove('active'); // Tutup dropdown
                });

                searchResults.appendChild(resultDiv);
            }
        });

        if (hasResults) {
            searchResults.classList.add('active');
        } else {
            const noResult = document.createElement('div');
            noResult.classList.add('search-result-item', 'no-result'); // Tambah class 'no-result'
            noResult.textContent = 'Materi tidak ditemukan';
            noResult.style.color = 'var(--text-secondary)';
            noResult.style.cursor = 'default';
            searchResults.appendChild(noResult);
            searchResults.classList.add('active');
        }
    } else {
        searchResults.classList.remove('active');
    }
});

// 2. Mendengarkan saat pengguna menekan tombol KEYBOARD (Panah & Enter)
searchInput.addEventListener('keydown', function(e) {
    // Ambil semua daftar hasil pencarian yang valid (abaikan tulisan "tidak ditemukan")
    let itemElements = searchResults.querySelectorAll('.search-result-item:not(.no-result)');
    
    // Jika tidak ada hasil, jangan lakukan apa-apa
    if (itemElements.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault(); // Mencegah kursor bergeser di dalam kotak teks
        currentFocus++; // Pindah ke item bawahnya
        addActiveHighlight(itemElements);
    } 
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocus--; // Pindah ke item atasnya
        addActiveHighlight(itemElements);
    } 
    else if (e.key === 'Enter') {
        e.preventDefault();
        // Jika sedang menyorot suatu item, simulasikan klik (Enter)
        if (currentFocus > -1) {
            if (itemElements[currentFocus]) {
                itemElements[currentFocus].click();
            }
        }
    }
});

// Fungsi pembantu untuk menambahkan highlight saat pakai keyboard
function addActiveHighlight(items) {
    if (!items) return false;
    
    // Bersihkan semua highlight terlebih dahulu
    removeActiveHighlight(items);
    
    // Logika agar highlight berputar (jika sudah di bawah, balik ke atas)
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (items.length - 1);
    
    // Tambahkan class warna abu-abu ke item yang dipilih
    items[currentFocus].classList.add('keyboard-focused');

    // (Opsional tapi keren) Pastikan item yang dipilih tetap terlihat meski listnya panjang (auto scroll)
    items[currentFocus].scrollIntoView({ block: 'nearest' });
}

// Fungsi pembantu untuk membersihkan semua highlight
function removeActiveHighlight(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('keyboard-focused');
    }
}

// Sembunyikan dropdown jika user mengklik area luar
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
    }
});
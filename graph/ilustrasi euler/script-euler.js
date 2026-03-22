// =========================================================
// LOGIKA KHUSUS SISTEM BILANGAN REAL (DIAGRAM & AKORDEON)
// =========================================================

const eulerDiagramShapes = document.querySelectorAll('.euler-shape');
const eulerDiagramLabels = document.querySelectorAll('.euler-text');
const eulerAccordionItems = document.querySelectorAll('.euler-acc-item');

// 1. FUNGSI UNTUK MERESET SEMUA (Menutup akordeon, menghapus class active dari diagram)
function resetEulerDiagramAll() {
    // Tutup semua materi
    eulerAccordionItems.forEach(item => {
        item.classList.remove('active');
    });
    // Hapus class active dari semua lingkaran di diagram
    eulerDiagramShapes.forEach(shape => {
        shape.classList.remove('active');
    });
}

// 2. FUNGSI UNTUK MENONJOLKAN LINGKARAN DIAGRAM (HIGHLIGHT)
function activateDiagramCircle(targetId) {
    if (!targetId) return;
    const targetCircle = document.getElementById(`euler-diagram-circle-${targetId}`);
    if (targetCircle) {
        // Tambahkan class 'active' untuk tebalkan garis & isi lingkaran terang dengan opacity 0.5
        targetCircle.classList.add('active'); 
    }
}

// 3. FUNGSI UNTUK MEMBUKA MATERI (ACCORDION)
function activateAccordionItem(targetId) {
    eulerAccordionItems.forEach(item => {
        const header = item.querySelector('.euler-acc-header');
        if (header.getAttribute('data-target') === targetId) {
            item.classList.add('active'); // Buka akordeonnya
        }
    });
}

// 4. PASANG EVENT LISTENERS UNTUK AKORDEON (Sinkronisasi ke Diagram)
eulerAccordionItems.forEach(item => {
    const header = item.querySelector('.euler-acc-header');
    header.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        
        // Simpan status aktif (untuk toggle)
        const isActive = item.classList.contains('active');
        
        resetEulerDiagramAll(); // Tutup semua yang lain dan hapus semua highlight diagram

        // Jika tidak aktif, aktifkan akordeon ini dan sorot diagramnya
        if (!isActive) {
            item.classList.add('active');
            // Sorot lingkaran yang sesuai di diagram
            activateDiagramCircle(targetId);
        }
    });
});

// 5. PASANG EVENT LISTENERS UNTUK DIAGRAM (Sinkronisasi ke Akordeon)
// Gabungkan lingkaran dan label teks untuk didengar klik-nya
[...eulerDiagramShapes, ...eulerDiagramLabels].forEach(element => {
    element.addEventListener('click', function() {
        const fullId = this.getAttribute('id'); // e.g., 'euler-diagram-circle-irrational'
        if (!fullId) return;
        
        // Dapatkan target ID (e.g., 'irrational') dengan memotong prefix
        const targetId = fullId.replace('euler-diagram-circle-', '').replace('euler-diagram-label-', '');

        resetEulerDiagramAll(); // Reset semuanya terlebih dahulu

        // Buka akordeon yang sesuai
        activateAccordionItem(targetId);

        // Sorot lingkaran yang sesuai di diagram
        activateDiagramCircle(targetId);

        // --- FITUR BARU: AUTO-SCROLL UNTUK MOBILE ---
        // Jika lebar layar 768px atau lebih kecil (ukuran HP/Tablet)
        if (window.innerWidth <= 768) {
            // Cari elemen akordeon yang targetnya baru saja diklik
            const activeAccordion = Array.from(eulerAccordionItems).find(item => {
                const header = item.querySelector('.euler-acc-header');
                return header.getAttribute('data-target') === targetId;
            });

            if (activeAccordion) {
                // Gunakan setTimeout (jeda sangat singkat 0.15 detik) 
                // agar CSS menyelesaikan sedikit animasi buka-tutupnya sebelum menggulir layar
                setTimeout(() => {
                    activeAccordion.scrollIntoView({ 
                        behavior: 'smooth', // Efek gulir yang mulus (tidak patah/langsung lompat)
                        block: 'center'      // Posisikan elemen tepat di atas layar
                    });
                }, 150); 
            }
        }
        // --------------------------------------------
    });
});

// 6. TAMPILAN AWAL: Aktifkan materi "Overview" secara default saat dimuat
document.addEventListener('DOMContentLoaded', () => {
    const overviewItem = document.getElementById('euler-diagram-item-natural');
    if (overviewItem) {
        // Tampilan awal hanya membuka konten Overview, tanpa sorotan diagram terbesar
        overviewItem.classList.add('active');
    }
});

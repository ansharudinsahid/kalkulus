document.addEventListener('DOMContentLoaded', function () {
    // Ambil elemen HTML yang dibutuhkan
    const track = document.getElementById('track-ilustrasi');
    const viewport = document.getElementById('viewport-ilustrasi');
    const zoomSlider = document.getElementById('zoomSlider-ilustrasi');

    // Pastikan elemen ada sebelum menjalankan kode (mencegah error di halaman lain)
    if (!track || !viewport || !zoomSlider) return;

    const totalDots = 1501;
    let visibleDots = 1501;

    // 1. Membangun 1250 titik-titik secara otomatis
    for (let i = 0; i < totalDots; i++) {
        const dotWrapper = document.createElement('div');
        dotWrapper.className = 'dot-wrapper';

        const value = i / 100 - 2;
        const label = document.createElement('div');
        label.className = 'label';

        // Pengelompokan class untuk CSS
        if (i % 100 === 0) {
            dotWrapper.classList.add('integer');
            label.innerText = value.toString();
        } else if (i % 10 === 0) {
            dotWrapper.classList.add('decimal1');
            label.innerText = value.toFixed(1);
        } else {
            dotWrapper.classList.add('decimal2');
            label.innerText = value.toFixed(2);
        }

        const circle = document.createElement('div');
        circle.className = 'circle';

        dotWrapper.appendChild(label);
        dotWrapper.appendChild(circle);
        track.appendChild(dotWrapper);
    }

    // 2. Fungsi memperbarui tampilan saat dizoom
    function updateZoom() {
        if (visibleDots < 13) visibleDots = 13;
        if (visibleDots > 1501) visibleDots = 1501;

        zoomSlider.value = visibleDots;

        // Gunakan persentase agar kebal terhadap display:none saat halaman baru dimuat
        const trackWidthPercent = (totalDots / visibleDots) * 100;
        track.style.width = trackWidthPercent + '%';

        track.className = '';
        if (visibleDots <= 15) {
            track.classList.add('zoom-in');
        } else if (visibleDots <= 125) {
            track.classList.add('zoom-mid');
        } else {
            track.classList.add('zoom-out');
        }
    }

    // Panggil saat pertama kali agar sesuai ukuran
    updateZoom();

    // Pastikan ilustrasi menyesuaikan ukuran saat pengguna membesarkan/mengecilkan ukuran browser
    window.addEventListener('resize', updateZoom);

    // 3. Menangkap event Slider
    zoomSlider.addEventListener('input', function (e) {
        visibleDots = parseInt(e.target.value);
        updateZoom();
    });

    // 4. Menangkap event Scroll Mouse di dalam kotak
    viewport.addEventListener('wheel', function (e) {
        e.preventDefault();
        const zoomSpeed = 3;
        if (e.deltaY < 0) {
            visibleDots -= zoomSpeed;
        } else {
            visibleDots += zoomSpeed;
        }
        updateZoom();
    });
});
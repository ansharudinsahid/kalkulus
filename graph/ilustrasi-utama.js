// Kalkulus Minerva/graph/ilustrasi-nilai-mutlak/script-mutlak.js

document.addEventListener("DOMContentLoaded", function() {
    // 1. Mengambil referensi elemen dari HTML
    const slider = document.getElementById("xSlider");
    const equationLabel = document.getElementById("mutlakEquation");
    const noteLabel = document.getElementById("mutlakNote");
    const ticksGroup = document.getElementById("numberTicks");
    
    const distanceArrow = document.getElementById("distanceArrow");
    const guideLine = document.getElementById("guideLine");
    const svgArea = document.getElementById("mutlakSvg");

    // Konfigurasi posisi garis bilangan
    const yAxis = 80; // Posisi Y garis bilangan
    const yArrow = 50; // Posisi Y panah jarak
    const minVal = -8;
    const maxVal = 8;

    // Fungsi pembantu untuk memetakan nilai -8 s/d 8 ke persentase lebar SVG (10% s/d 90%)
    function valToPercent(val) {
        // Rentang total nilai adalah 16 (dari -8 ke 8)
        // Rentang persentase di layar adalah 80% (dari 10% ke 90%)
        let percentage = 10 + ((val - minVal) / (maxVal - minVal)) * 80;
        return percentage + "%";
    }

    // 2. Menggambar titik-titik angka (ticks) di garis bilangan
    function drawNumberLine() {
        ticksGroup.innerHTML = ""; // Bersihkan dulu jika ada
        for (let i = minVal; i <= maxVal; i++) {
            let xPos = valToPercent(i);
            
            // Buat garis penanda kecil (tick mark)
            let tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
            tick.setAttribute("x1", xPos);
            tick.setAttribute("y1", yAxis - 5);
            tick.setAttribute("x2", xPos);
            tick.setAttribute("y2", yAxis + 5);
            tick.setAttribute("stroke", "#333");
            tick.setAttribute("stroke-width", i === 0 ? "3" : "1"); // Titik 0 lebih tebal
            
            // Buat teks angka
            // Agar tidak terlalu padat, kita bisa tampilkan hanya angka genap atau kelipatan tertentu
            // Tapi untuk -10 sampai 10, bisa ditampilkan semua
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", xPos);
            text.setAttribute("y", yAxis + 20);
            text.setAttribute("class", "tick-text");
            text.textContent = i;

            // Beri warna khusus untuk titik nol
            if (i === 0) {
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", "#2c3e50");
            }

            ticksGroup.appendChild(tick);
            ticksGroup.appendChild(text);
        }
    }

    // 3. Fungsi untuk memperbarui semua visual saat slider digeser
    function updateVisuals() {
        let x = parseInt(slider.value);
        let absX = Math.abs(x); // Mencari nilai mutlaknya
        
        let xPosZero = valToPercent(0);
        let xPosCurrent = valToPercent(x);

        // Update teks persamaan
        equationLabel.textContent = `|${x}| = ${absX}`;
        
        // Update teks catatan
        if (x === 0) {
            noteLabel.textContent = `Tepat di titik 0`;
        } else {
            noteLabel.textContent = `Jaraknya tetap ${absX} langkah dari 0`;
        }

        // Update panah dari 0 ke nilai x
        // Mengubah arah panah jika nilainya negatif
        distanceArrow.setAttribute("x1", xPosZero);
        distanceArrow.setAttribute("y1", yArrow);
        
        // Sedikit mengurangi panjang panah agar mata panah tidak menabrak titik batas persis
        distanceArrow.setAttribute("x2", xPosCurrent);
        distanceArrow.setAttribute("y2", yArrow);

        // Update garis bantu (guide line) dari angka ke panah
        guideLine.setAttribute("x1", xPosCurrent);
        guideLine.setAttribute("x2", xPosCurrent);

        // Sembunyikan panah jika x = 0 (karena tidak ada jarak)
        if (x === 0) {
            distanceArrow.style.display = "none";
            guideLine.style.display = "none";
        } else {
            distanceArrow.style.display = "block";
            guideLine.style.display = "block";
        }
    }

    // 4. Inisialisasi awal
    drawNumberLine();
    updateVisuals();

    // 5. Mendaftarkan event listener pada slider
    slider.addEventListener("input", updateVisuals);
});

// ===============================
// Visualisasi Notasi Interval/ilustrasi-utama.js
// =========================================================
// WIDGET VISUALISASI INTERVAL (TERINTEGRASI DARK MODE)
// =========================================================
(function() {
    const OPTIONS = {
        lb: [ {val: 'closed', label: '['}, {val: 'open', label: '('} ],
        lv: [ {val: '-inf', label: '-∞'}, {val: 'a', label: 'a'}, {val: 'b', label: 'b'} ],
        rv: [ {val: 'a', label: 'a'}, {val: 'b', label: 'b'}, {val: 'inf', label: '∞'} ],
        rb: [ {val: 'closed', label: ']'}, {val: 'open', label: ')'} ]
    };

    let appState = { lb: 0, lv: 1, rv: 1, rb: 0 }; 
    let isAnimating = { lb: false, lv: false, rv: false, rb: false };

    function initPickers() {
        ['lb', 'lv', 'rv', 'rb'].forEach(key => {
            const col = document.getElementById(`col-${key}`);
            if(!col) return; // Mencegah error jika elemen tidak ada di halaman
            
            const btnUp = col.querySelector('.btn-up');
            const btnDown = col.querySelector('.btn-down');

            btnUp.addEventListener('click', () => changeValue(key, 'prev'));
            btnDown.addEventListener('click', () => changeValue(key, 'next'));

            col.addEventListener('wheel', (e) => {
                e.preventDefault(); 
                if (e.deltaY > 0) changeValue(key, 'next'); 
                else if (e.deltaY < 0) changeValue(key, 'prev');
            }, { passive: false }); 

            let startY = 0;
            col.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY; 
            }, { passive: true }); 

            col.addEventListener('touchmove', (e) => {
                e.preventDefault(); 
            }, { passive: false }); 

            col.addEventListener('touchend', (e) => {
                let endY = e.changedTouches[0].clientY; 
                let diffY = startY - endY;
                
                if (Math.abs(diffY) > 30) {
                    if (diffY > 0) changeValue(key, 'next'); 
                    else changeValue(key, 'prev'); 
                }
            });
            renderTexts(key);
        });
        updateOutput();
    }

    function changeValue(key, action) {
        if (isAnimating[key]) return;
        isAnimating[key] = true;

        const len = OPTIONS[key].length;
        if (action === 'next') {
            appState[key] = (appState[key] + 1) % len;
        } else {
            appState[key] = (appState[key] - 1 + len) % len;
        }

        animateColumn(key, action, () => {
            isAnimating[key] = false;
            enforceRules();
        });
    }

    function animateColumn(key, action, callback) {
        const col = document.getElementById(`col-${key}`);
        const items = col.querySelectorAll('.val-display');

        items.forEach(el => {
            el.style.transition = 'transform 0.15s ease-in, opacity 0.15s ease-in';
            el.style.opacity = '0';
            el.style.transform = action === 'next' ? 'translateY(-15px)' : 'translateY(15px)';
        });

        setTimeout(() => {
            renderTexts(key);
            items.forEach(el => {
                el.style.transition = 'none';
                el.style.transform = action === 'next' ? 'translateY(15px)' : 'translateY(-15px)';
            });
            void col.offsetWidth;
            items.forEach(el => {
                el.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            setTimeout(() => { if (callback) callback(); }, 150);
        }, 150);
    }

    function renderTexts(key) {
        const col = document.getElementById(`col-${key}`);
        const stateIdx = appState[key];
        const opts = OPTIONS[key];
        const len = opts.length;

        const prevIdx = (stateIdx - 1 + len) % len;
        const nextIdx = (stateIdx + 1) % len;

        col.querySelector('.val-prev').innerText = opts[prevIdx].label;
        col.querySelector('.val-current').innerText = opts[stateIdx].label;
        col.querySelector('.val-next').innerText = opts[nextIdx].label;
    }

    function enforceRules() {
        const lvVal = OPTIONS.lv[appState.lv].val;
        const rvVal = OPTIONS.rv[appState.rv].val;
        const lbVal = OPTIONS.lb[appState.lb].val;
        const rbVal = OPTIONS.rb[appState.rb].val;

        if (lvVal === '-inf' && lbVal === 'closed') { appState.lb = 1; animateColumn('lb', 'next'); }
        if (rvVal === 'inf' && rbVal === 'closed') { appState.rb = 1; animateColumn('rb', 'next'); }
        updateOutput();
    }

    function updateOutput() {
        const setNotation = document.getElementById('set-notation');
        if(!setNotation) return;
        
        const lb = OPTIONS.lb[appState.lb].val;
        const lv = OPTIONS.lv[appState.lv].val;
        const rv = OPTIONS.rv[appState.rv].val;
        const rb = OPTIONS.rb[appState.rb].val;
        
        let setStr = "";
        if (lv === '-inf' && rv === 'inf') setStr = "{ x | x ∈ ℝ }";
        else if (lv === '-inf') {
            let sym = rb === 'closed' ? '≤' : '<';
            setStr = `{ x | x ${sym} ${rv} }`;
        } else if (rv === 'inf') {
            let sym = lb === 'closed' ? '≥' : '>';
            setStr = `{ x | x ${sym} ${lv} }`;
        } else if (lv === rv) {
            if (lb === 'closed' && rb === 'closed') setStr = `{ x | x = ${lv} }`;
            else setStr = "∅ (Himpunan Kosong)";
        } else {
            let sym1 = lb === 'closed' ? '≤' : '<';
            let sym2 = rb === 'closed' ? '≤' : '<';
            setStr = `{ x | ${lv} ${sym1} x ${sym2} ${rv} }`;
        }
        setNotation.innerText = setStr;
        drawGraph(lb, lv, rv, rb);
    }

    // Fungsi untuk mengambil warna dari CSS Variables saat ini
    function getCSSVar(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function drawGraph(lb, lv, rv, rb) {
        const canvas = document.getElementById('intervalCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');

        // Mengambil warna adaptif dari CSS
        const colorText = getCSSVar('--text-primary') || '#000000';
        const colorBg = getCSSVar('--bg-main') || '#ffffff';
        const colorAccent = getCSSVar('--accent-blue') || '#00a2ff';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const y = canvas.height / 2;
        const padding = 50;
        const leftPos = padding + 100;
        const rightPos = canvas.width - padding - 100;
        const centerPos = canvas.width / 2;

        // Gambar Garis Dasar (Garis Bilangan)
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.strokeStyle = colorText;
        ctx.lineWidth = 2;
        ctx.stroke();

        drawArrow(ctx, padding, y, 'left', colorText);
        drawArrow(ctx, canvas.width - padding, y, 'right', colorText);

        const isEmptySet = (lv === rv && (lb === 'open' || rb === 'open'));
        if (isEmptySet) return; 

        let startX = (lv === '-inf') ? padding : ((lv === rv) ? centerPos : leftPos);
        let endX = (rv === 'inf') ? (canvas.width - padding) : ((lv === rv) ? centerPos : rightPos);

        // Gambar Garis Rentang Interval (Warna Aksen)
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.strokeStyle = colorAccent;
        ctx.lineWidth = 5;
        ctx.stroke();

        if (lv === '-inf') drawArrow(ctx, padding, y, 'left', colorAccent);
        if (rv === 'inf') drawArrow(ctx, canvas.width - padding, y, 'right', colorAccent);

        if (lv === rv) {
            drawPoint(ctx, centerPos, y, (lb === 'closed' && rb === 'closed'), lv, colorText, colorAccent, colorBg);
        } else {
            if (lv !== '-inf') drawPoint(ctx, leftPos, y, lb === 'closed', lv, colorText, colorAccent, colorBg);
            if (rv !== 'inf') drawPoint(ctx, rightPos, y, rb === 'closed', rv, colorText, colorAccent, colorBg);
        }
    }

    function drawPoint(ctx, x, y, isClosed, label, colorText, colorAccent, colorBg) {
        ctx.fillStyle = colorText;
        
   ctx.font = 'bold 28px Courier New';     ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 30);

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        if (isClosed) {
            ctx.fillStyle = colorAccent;
            ctx.fill();
        } else {
            ctx.fillStyle = colorBg; // Isi warna bulatan menyesuaikan background aktif
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = colorAccent;
            ctx.stroke();
        }
    }

    function drawArrow(ctx, x, y, direction, color) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (direction === 'left') {
            ctx.lineTo(x + 15, y - 8);
            ctx.lineTo(x + 15, y + 8);
        } else {
            ctx.lineTo(x - 15, y - 8);
            ctx.lineTo(x - 15, y + 8);
        }
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Eksekusi inisialisasi awal
    initPickers();

    // Event Listener Tambahan: Redraw Grafik saat tombol Dark Mode ditekan
    const themeToggle = document.getElementById('darkModeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            // Beri jeda sedikit agar CSS Variables selesai berubah sebelum digambar ulang
            setTimeout(updateOutput, 50); 
        });
    }

})();

// =============================
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
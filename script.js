/* =====================  PENGATURAN — UBAH DI SINI  ===================== */
const CFG = {
  wa: "6281234567890",                 // nomor WA: awalan 62, tanpa 0
  tampil: "0812-3456-7890",
  alamat: "Jl. Contoh No. 1, Medan",
  mapQuery: "Medan",                  // nama tempat / alamat untuk peta (bisa diganti nama toko)
  ig: "https://instagram.com/",
  bukaJam: 10, tutupJam: 22,           // jam buka & tutup (24 jam)
  promoSampai: "21:00", diskon: 10,    // promo harian: diskon % sampai jam tsb
  promoJudul: "Diskon 10% semua menu!",
  ongkir: 8000, gratisOngkir: 60000    // ongkir flat & batas gratis ongkir
};
CFG.maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.mapQuery);
CFG.jam = `Setiap hari, ${String(CFG.bukaJam).padStart(2,"0")}.00 – ${String(CFG.tutupJam).padStart(2,"0")}.00`;

// badge: "Best Seller" | "Baru" | "Pedas 🌶️" | "" ; hot = skor terlaris
const PRODUK = [
  { id:1, nama:"Nasi Goreng Telor",    kat:"Makanan", harga:20000, img:"images/nasgor-telor.jpg",    badge:"",            hot:70, desc:"Nasi goreng klasik berbumbu meresap dengan telur ceplok setengah matang dan kerupuk renyah." },
  { id:2, nama:"Nasi Goreng Spesial",  kat:"Makanan", harga:28000, img:"images/nasgor-spesial.jpg",  badge:"Best Seller", hot:100,desc:"Paling favorit! Nasi goreng komplit dengan telur, sayur segar, dan bumbu rahasia kami." },
  { id:3, nama:"Nasi Goreng Sayur",    kat:"Makanan", harga:22000, img:"images/nasgor-sayur.jpg",    badge:"Baru",        hot:40, desc:"Ringan dan segar dengan paprika warna-warni, wortel, dan daun bawang." },
  { id:4, nama:"Nasi Goreng Ayam",     kat:"Makanan", harga:25000, img:"images/nasgor-ayam.jpg",     badge:"Pedas",    hot:85, desc:"Potongan ayam empuk, cabai segar, dan kerupuk. Cocok untuk pecinta pedas." },
  { id:5, nama:"Nasi Goreng Seafood",  kat:"Makanan", harga:32000, img:"images/nasgor-seafood.jpg",  badge:"",            hot:75, desc:"Udang dan bakso ikan pilihan dengan aroma wajan yang menggoda." },
  { id:6, nama:"Thai Tea",             kat:"Minuman", harga:15000, img:"images/thai-tea.jpg",        badge:"Best Seller", hot:90, desc:"Teh Thailand creamy, manis, dan dingin menyegarkan." },
  { id:7, nama:"Es Teh Aneka Rasa",    kat:"Minuman", harga:12000, img:"images/es-teh.jpg",          badge:"",            hot:55, desc:"Es teh segar dengan pilihan rasa buah yang menyegarkan." },
  { id:8, nama:"Es Jeruk Segar",       kat:"Minuman", harga:13000, img:"images/es-jeruk.jpg",        badge:"Baru",        hot:50, desc:"Jeruk peras asli dengan serutan es dan sedikit mint." },
  { id:9, nama:"Es Cincau Susu Hijau", kat:"Minuman", harga:14000, img:"images/es-cincau.jpg",       badge:"",            hot:60, desc:"Cincau hitam kenyal dalam susu hijau yang manis dan creamy." }
];
const OPSI = {
  Makanan: { pedas:["Tidak pedas","Pedas 1","Pedas 2","Pedas 3","Pedas 4","Pedas 5"],
             top:[{n:"Telur Ceplok",h:4000},{n:"Kerupuk",h:2000},{n:"Extra Ayam",h:8000},{n:"Sosis",h:5000}] },
  Minuman: { gula:["Normal","Kurang manis","Tanpa gula"], es:["Normal","Sedikit es","Tanpa es"],
             top:[{n:"Boba",h:4000},{n:"Jelly",h:3000}] }
};
const ULASAN = [
  { n:"Rina, Medan",   s:5, t:"Nasi gorengnya juara! Bumbunya meresap dan porsinya pas. Langganan tiap minggu." },
  { n:"Budi, Medan",   s:5, t:"Pesan lewat WhatsApp gampang banget, sampai masih hangat. Pedas level 3 mantap!" },
  { n:"Sari, Binjai",  s:5, t:"Thai Tea-nya enak banget, creamy tapi tidak eneg. Pasti pesan lagi." },
  { n:"Andi, Medan",   s:4, t:"Seafood-nya segar dan udangnya banyak. Harga sepadan dengan rasanya." },
  { n:"Dewi, Deli Serdang", s:5, t:"Kemasan rapi, rasa konsisten. Cocok untuk makan bareng keluarga." }
];
/* ======================================================================= */

const $ = id => document.getElementById(id);
const ico = (n, c = "") => `<svg class="ic ${c}"><use href="#i-${n}"/></svg>`;
const rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
const waLink = t => `https://wa.me/${CFG.wa}?text=${encodeURIComponent(t)}`;
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

let kat = "Semua", cart = load("keranjang", []), fav = load("fav", []), modal = null;

/* ---------- FOTO: cadangan, placeholder, dan ganti foto (mode admin) ---------- */
const ADMIN = location.hash.includes("admin");        // buka index.html#admin untuk ganti foto
let FOTO = load("fotoCustom", {}), camId = 0;
const foto = p => FOTO[p.id] || p.img;
function fotoErr(el) {
  const s = el.getAttribute("src") || "";
  if (!el.dataset.t && s.startsWith("images/")) { el.dataset.t = 1; el.src = s.replace("images/", ""); return; } // coba di folder yang sama dengan index.html
  el.onerror = null;
  const a = (el.alt || "Foto belum ada").replace(/[&<>"]/g, "");
  el.src = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3e47"/><stop offset="1" stop-color="#15171c"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><g fill="none" stroke="#aab0ba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(158 120) scale(3.5)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></g><text x="200" y="300" text-anchor="middle" fill="#aab0ba" font-family="sans-serif" font-size="20">${a}</text></svg>`);
}
function ubahFoto(file) {
  if (!file || !camId) return;
  const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => {
    const m = Math.min(im.width, im.height), S = Math.min(700, m), c = document.createElement("canvas"); c.width = c.height = S;
    c.getContext("2d").drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, S, S);
    FOTO[camId] = c.toDataURL("image/jpeg", .82); save("fotoCustom", FOTO);
    renderMenu(); renderCart(); setHero(); toast("Foto berhasil diganti");
  }; im.src = r.result; };
  r.readAsDataURL(file);
}
function setHero() { const h = $("heroImg"); h.dataset.t = ""; h.onerror = () => fotoErr(h); h.src = foto(PRODUK[0]); }
const prod = id => PRODUK.find(p => p.id == id);
const defOpt = p => p.kat === "Makanan" ? { pedas: 1, top: [] } : { gula: 0, es: 0, top: [] };

/* ---------- harga & deskripsi opsi ---------- */
function unit(it) {
  const p = prod(it.id), L = OPSI[p.kat].top;
  return p.harga + it.o.top.reduce((a, n) => a + (L.find(t => t.n === n)?.h || 0), 0);
}
function opsiTxt(it) {
  const p = prod(it.id), o = it.o, a = [];
  if (p.kat === "Makanan") a.push(OPSI.Makanan.pedas[o.pedas]);
  else a.push("Gula: " + OPSI.Minuman.gula[o.gula], "Es: " + OPSI.Minuman.es[o.es]);
  if (o.top.length) a.push("+ " + o.top.join(", "));
  return a.join(" · ");
}

/* ---------- status buka / tutup ---------- */
const isOpen = () => { const h = new Date().getHours(); return h >= CFG.bukaJam && h < CFG.tutupJam; };
function renderStatus() {
  const e = $("status"), o = isOpen();
  e.className = "status" + (o ? "" : " off");
  e.innerHTML = o ? `<i></i> Buka sekarang · tutup ${CFG.tutupJam}.00` : `<i></i> Tutup · buka ${CFG.bukaJam}.00`;
}

/* ---------- promo countdown ---------- */
function promoEnd() { const [h, m] = CFG.promoSampai.split(":"); const d = new Date(); d.setHours(+h, +m, 0, 0); return d; }
const promoAktif = () => new Date() < promoEnd();
function tickPromo() {
  $("promoTxt").textContent = CFG.promoJudul;
  const left = promoEnd() - new Date();
  if (left <= 0) { $("cd").innerHTML = '<div class="over">Promo hari ini sudah berakhir — sampai jumpa besok!</div>'; return; }
  const h = Math.floor(left / 36e5), m = Math.floor(left % 36e5 / 6e4), s = Math.floor(left % 6e4 / 1e3);
  $("cd").innerHTML = [[h, "JAM"], [m, "MENIT"], [s, "DETIK"]].map(x => `<div><b>${String(x[0]).padStart(2, "0")}</b><small>${x[1]}</small></div>`).join("");
}

/* ---------- menu ---------- */
function chips() {
  $("chips").innerHTML = ["Semua", "Makanan", "Minuman", "Favorit"]
    .map(k => `<button class="${k === kat ? "on" : ""}" data-k="${k}">${k === "Favorit" ? ico("hr") + " Favorit" : k}</button>`).join("");
}
function renderMenu() {
  const s = $("q").value.toLowerCase().trim(), so = $("sort").value;
  let l = PRODUK.filter(p => (kat === "Semua" || (kat === "Favorit" ? fav.includes(p.id) : p.kat === kat)) && p.nama.toLowerCase().includes(s));
  if (so === "low") l.sort((a, b) => a.harga - b.harga);
  if (so === "high") l.sort((a, b) => b.harga - a.harga);
  if (so === "hot") l.sort((a, b) => b.hot - a.hot);
  $("grid").innerHTML = l.length ? l.map((p, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="pic" data-det="${p.id}">
        <img src="${foto(p)}" alt="${p.nama}" loading="lazy" onerror="fotoErr(this)">
        <span class="cat">${p.kat}</span>
        ${p.badge ? `<span class="badge">${p.badge === "Pedas" ? ico("fl") : ""}${p.badge}</span>` : ""}
        ${ADMIN ? `<button class="cam" data-cam="${p.id}" aria-label="Ganti foto">${ico("cm")}</button>` : ""}
        <button class="heart ${fav.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favorit">${ico("hr")}</button>
      </div>
      <div class="info">
        <h3>${p.nama}</h3>
        <p class="desc">${p.desc}</p>
        <div class="price">${rp(p.harga)}</div>
        <div class="acts">
          <button class="det" data-det="${p.id}"><span class="lg">Atur Pesanan</span><span class="sm">Atur</span></button>
          <button class="add" data-add="${p.id}"><span class="lg">+ Keranjang</span><span class="sm">+ Tambah</span></button>
        </div>
      </div>
    </article>`).join("")
    : `<div class="empty">${kat === "Favorit" ? "Belum ada favorit. Tekan ikon hati pada menu!" : "Menu tidak ditemukan"}</div>`;
}

/* ---------- popup detail ---------- */
function openModal(id) { const p = prod(id); modal = { p, o: JSON.parse(JSON.stringify(defOpt(p))), q: 1 }; renderModal(); $("modal").classList.add("on"); kunci(); }
function closeModal() { $("modal").classList.remove("on"); kunci(); }
function mUnit() { return unit({ id: modal.p.id, o: modal.o }); }
function renderModal() {
  const { p, o, q } = modal, O = OPSI[p.kat];
  const grp = (t, arr, key, cur) => `<div class="grp"><b>${t}</b><div class="opts">${arr.map((x, i) => `<button class="${cur === i ? "on" : ""}" data-m-${key}="${i}">${x}</button>`).join("")}</div></div>`;
  $("mbox").innerHTML = `
    <button class="mclose" data-mc aria-label="Tutup">✕</button>
    <img src="${foto(p)}" alt="${p.nama}" onerror="fotoErr(this)">
    <div class="mx">
      <div><span class="cat" style="color:var(--accent);font-size:13px">${p.kat}${p.badge ? " · " + p.badge : ""}</span><h2>${p.nama}</h2></div>
      <p class="desc">${p.desc}</p>
      ${p.kat === "Makanan" ? grp("Tingkat Pedas", O.pedas, "pedas", o.pedas) : grp("Tingkat Gula", O.gula, "gula", o.gula) + grp("Es", O.es, "es", o.es)}
      <div class="grp"><b>Tambahan</b><div class="opts">${O.top.map(t => `<button class="${o.top.includes(t.n) ? "on" : ""}" data-m-top="${t.n}">${t.n} +${rp(t.h)}</button>`).join("")}</div></div>
      <div class="mfoot">
        <div class="mrow"><div class="qty"><button data-mq="-1">−</button><span>${q}</span><button data-mq="1">+</button></div>
          <div class="price">${rp(mUnit() * q)}</div></div>
        <div class="btns2"><button class="btn ghost" data-m-wa>Pesan WA</button><button class="btn primary" data-m-add>+ Keranjang</button></div>
      </div>
    </div>`;
}

/* ---------- keranjang ---------- */
function addItem(id, o, q = 1) {
  const key = JSON.stringify(o), f = cart.find(c => c.id == id && JSON.stringify(c.o) === key);
  f ? f.q += q : cart.push({ id, o, q });
  renderCart();
}
function totals() {
  const sub = cart.reduce((a, c) => a + unit(c) * c.q, 0);
  const dis = promoAktif() ? sub * CFG.diskon / 100 : 0;
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const ong = mode === "Delivery" && sub > 0 && sub - dis < CFG.gratisOngkir ? CFG.ongkir : 0;
  return { sub, dis, ong, mode, total: sub - dis + ong };
}
function renderCart() {
  save("keranjang", cart);
  $("items").innerHTML = cart.length ? cart.map((c, i) => { const p = prod(c.id);
    return `<div class="it"><img src="${foto(p)}" alt="${p.nama}" onerror="fotoErr(this)"><div><b>${p.nama}</b><small>${opsiTxt(c)}</small><span class="pr">${rp(unit(c) * c.q)}</span></div>
    <span class="q"><button data-cm="${i}">−</button>${c.q}<button data-cp="${i}">+</button></span></div>`; }).join("")
    : `<p class="empty" style="padding:50px 0">Keranjang masih kosong</p>`;
  const t = totals();
  $("sSub").textContent = rp(t.sub);
  $("rDis").style.display = t.dis ? "flex" : "none"; $("lDis").textContent = `Diskon promo ${CFG.diskon}%`; $("sDis").textContent = "-" + rp(t.dis);
  $("rOng").style.display = t.mode === "Delivery" ? "flex" : "none";
  $("sOng").textContent = t.ong ? rp(t.ong) : (t.sub ? "GRATIS" : rp(0));
  $("tt").textContent = rp(t.total);
  $("cn").textContent = cart.reduce((a, c) => a + c.q, 0);
  $("ad2").style.display = t.mode === "Delivery" ? "" : "none";
}
let scrollY0 = 0;
function kunci() { // kunci scroll halaman saat popup / keranjang terbuka
  const buka = $("modal").classList.contains("on") || $("cart").classList.contains("on"), b = document.body;
  if (buka && !b.classList.contains("lock")) { scrollY0 = scrollY; b.style.top = -scrollY0 + "px"; b.classList.add("lock"); }
  else if (!buka && b.classList.contains("lock")) { b.classList.remove("lock"); b.style.top = ""; scrollTo({ top: scrollY0, behavior: "instant" }); }
}
function setCart(on) { $("cart").classList.toggle("on", on); $("ov").classList.toggle("on", on); kunci(); }
function toast(t) { const e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("on"), 1900); }

function fly(imgSrc, from) {
  const b = $("openCart").getBoundingClientRect(), r = from.getBoundingClientRect(), el = document.createElement("img");
  el.src = imgSrc; el.className = "fly"; el.style.left = r.left + r.width / 2 - 30 + "px"; el.style.top = r.top + "px";
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.left = b.left + "px"; el.style.top = b.top + "px"; el.style.width = el.style.height = "20px"; el.style.opacity = ".3"; });
  setTimeout(() => el.remove(), 800);
}

function pesanTeks(items, extra) {
  const t = totals();
  let m = "*PESANAN BARU* 🍚\n\n" + items.map(c => `${c.q}x ${prod(c.id).nama}\n   (${opsiTxt(c)})\n   = ${rp(unit(c) * c.q)}`).join("\n") + "\n";
  m += `\nSubtotal: ${rp(t.sub)}`;
  if (t.dis) m += `\nDiskon ${CFG.diskon}%: -${rp(t.dis)}`;
  if (t.mode === "Delivery") m += `\nOngkir: ${t.ong ? rp(t.ong) : "GRATIS"}`;
  m += `\n*Total: ${rp(t.total)}*\n` + extra;
  return m;
}

/* ---------- event ---------- */
document.addEventListener("click", e => {
  const d = e.target.closest("[data-cam],[data-k],[data-add],[data-det],[data-fav],[data-cp],[data-cm],[data-mc],[data-m-pedas],[data-m-gula],[data-m-es],[data-m-top],[data-mq],[data-m-add],[data-m-wa]");
  if (e.target.id === "modal") return closeModal();
  if (!d) return;
  const D = d.dataset;
  if (D.cam) { camId = +D.cam; $("fileIn").value = ""; $("fileIn").click(); }
  else if (D.k) { kat = D.k; chips(); renderMenu(); }
  else if (D.fav) { e.stopPropagation(); const id = +D.fav; fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id]; save("fav", fav); renderMenu(); toast(fav.includes(id) ? "Masuk favorit" : "Dihapus dari favorit"); }
  else if (D.add) { const p = prod(D.add); addItem(p.id, defOpt(p)); fly(foto(p), d); toast("Ditambahkan ke keranjang"); }
  else if (D.det) openModal(D.det);
  else if (D.cp) { cart[D.cp].q++; renderCart(); }
  else if (D.cm) { if (--cart[D.cm].q <= 0) cart.splice(D.cm, 1); renderCart(); }
  else if ("mc" in D) closeModal();
  else if (D.mPedas) { modal.o.pedas = +D.mPedas; renderModal(); }
  else if (D.mGula) { modal.o.gula = +D.mGula; renderModal(); }
  else if (D.mEs) { modal.o.es = +D.mEs; renderModal(); }
  else if (D.mTop) { const a = modal.o.top; a.includes(D.mTop) ? a.splice(a.indexOf(D.mTop), 1) : a.push(D.mTop); renderModal(); }
  else if (D.mq) { modal.q = Math.max(1, modal.q + +D.mq); renderModal(); }
  else if ("mAdd" in D) { addItem(modal.p.id, modal.o, modal.q); fly(foto(modal.p), d); closeModal(); toast("Ditambahkan ke keranjang"); }
  else if ("mWa" in D) {
    const it = [{ id: modal.p.id, o: modal.o, q: modal.q }], tot = unit(it[0]) * it[0].q;
    window.open(waLink(`*PESANAN BARU* 🍚\n\n${it[0].q}x ${modal.p.nama}\n   (${opsiTxt(it[0])})\n   = ${rp(tot)}\n\nMohon info ketersediaan & total. Terima kasih!`), "_blank");
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); setCart(false); } });
$("q").addEventListener("input", renderMenu);
$("sort").addEventListener("change", renderMenu);
$("openCart").onclick = () => setCart(true);
$("closeCart").onclick = $("ov").onclick = () => setCart(false);
document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener("change", renderCart));
$("toTop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

$("checkout").onclick = () => {
  if (!cart.length) return toast("Keranjang masih kosong");
  const t = totals(), nama = $("nm").value.trim(), alamat = $("ad2").value.trim();
  if (!nama) { $("nm").focus(); return toast("Isi nama Anda dulu ya"); }
  if (t.mode === "Delivery" && !alamat) { $("ad2").focus(); return toast("Isi alamat pengantaran"); }
  if (!isOpen() && !confirm(`Toko sedang tutup (buka ${CFG.bukaJam}.00). Tetap kirim pesanan?`)) return;
  let ex = `\nJenis: ${t.mode}\nNama: ${nama}`;
  if (t.mode === "Delivery") ex += `\nAlamat: ${alamat}`;
  ex += `\nPembayaran: ${$("pay").value}`;
  if ($("ct").value.trim()) ex += `\nCatatan: ${$("ct").value.trim()}`;
  window.open(waLink(pesanTeks(cart, ex)), "_blank");
};

/* ---------- efek: tilt kartu, header, scroll ---------- */
const hover = matchMedia("(hover:hover)").matches;
if (hover) {
  $("grid").addEventListener("mousemove", e => {
    const c = e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transition = "transform .08s"; c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
  });
  $("grid").addEventListener("mouseout", e => { const c = e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.transition = ""; c.style.transform = ""; } });
}
addEventListener("scroll", () => { $("hdr").classList.toggle("scrolled", scrollY > 30); $("toTop").classList.toggle("on", scrollY > 600); });
document.addEventListener("gesturestart", e => e.preventDefault()); // cegah zoom cubit di iOS
const io = !("IntersectionObserver" in window) ? { observe: el => el.classList.add("in") } : new IntersectionObserver(es => es.forEach(x => x.isIntersecting && x.target.classList.add("in")), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- ulasan slider ---------- */
let ri = 0, rt;
function renderUlasan() {
  const u = ULASAN[ri];
  $("rBody").innerHTML = `<div class="st">${"★".repeat(u.s)}${"☆".repeat(5 - u.s)}</div><p>“${u.t}”</p><b>— ${u.n}</b>`;
  $("rBody").style.animation = "none"; void $("rBody").offsetWidth; $("rBody").style.animation = "";
  $("dots").innerHTML = ULASAN.map((_, i) => `<i class="${i === ri ? "on" : ""}" data-r="${i}"></i>`).join("");
}
function goU(n) { ri = (n + ULASAN.length) % ULASAN.length; renderUlasan(); clearInterval(rt); rt = setInterval(() => goU(ri + 1), 5500); }
$("rPrev").onclick = () => goU(ri - 1); $("rNext").onclick = () => goU(ri + 1);
$("dots").addEventListener("click", e => e.target.dataset.r !== undefined && goU(+e.target.dataset.r));

/* ---------- tema ---------- */
const root = document.documentElement;
function setTema(t) { root.dataset.theme = t; $("themeBtn").innerHTML = ico(t === "dark" ? "sun" : "mn"); try { localStorage.setItem("tema", t); } catch (e) {} document.querySelector('meta[name="theme-color"]').content = t === "dark" ? "#0b0c0f" : "#fff6e9"; }
$("themeBtn").onclick = () => setTema(root.dataset.theme === "dark" ? "light" : "dark");

/* ---------- mulai ---------- */
$("ad").textContent = CFG.alamat; $("ph").textContent = CFG.tampil; $("jm").textContent = CFG.jam;
$("wal").href = $("fabWa").href = waLink("Halo, saya ingin bertanya tentang menu.");
$("mp").href = $("fMp").href = CFG.maps; $("ig").href = $("fIg").href = CFG.ig; $("fWa").href = $("wal").href;
$("mapf").src = "https://www.google.com/maps?q=" + encodeURIComponent(CFG.mapQuery) + "&output=embed";
cart = cart.filter(c => prod(c.id));
setTema(root.dataset.theme || "dark");
$("fileIn").addEventListener("change", e => ubahFoto(e.target.files[0]));
if (ADMIN) {
  $("adminBar").style.display = "flex";
  $("resetFoto").onclick = () => { FOTO = {}; save("fotoCustom", FOTO); renderMenu(); renderCart(); setHero(); toast("Foto dikembalikan"); };
  $("doneAdmin").onclick = () => { location.hash = ""; location.reload(); };
}
addEventListener("hashchange", () => location.reload());
setHero(); chips(); renderMenu(); renderCart(); renderStatus(); tickPromo(); goU(0);
setInterval(tickPromo, 1000); setInterval(() => { renderStatus(); renderCart(); }, 60000);

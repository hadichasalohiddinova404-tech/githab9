const STORAGE_KEY = "chain-estate-demo-v1";

const seedState = {
  selectedPropertyId: "PROP-1002",
  properties: [
    {
      id: "PROP-1001",
      type: "Uy",
      name: "Chilonzor Family House",
      address: "Toshkent, Chilonzor tumani, 12-mavze, 18-uy",
      area: "260 m²",
      price: 185000,
      description: "3 qavatli zamonaviy hovli, garaj va yashil hovliga ega.",
      owner: { name: "Aliyev Azizbek", id: "AA1234567", phone: "+998 90 123 45 67" },
      verification: {
        status: "Tasdiqlandi",
        verifier: "Davlat kadastr agentligi",
        notes: "Pasport, kadastr va egalik hujjatlari mos tushdi.",
        updatedAt: "2026-04-10 10:20"
      },
      documents: [
        { id: "DOC-1", type: "Kadastr hujjati", title: "Kadastr № 11-204", content: "Kadastr ma'lumotlari.", hash: "DOC5F2A90B8" }
      ],
      access: [
        { role: "Davlat organi", party: "Kadastr agentligi", scope: "To'liq audit", grantedAt: "2026-04-10 10:21" },
        { role: "Bank", party: "Kapitalbank", scope: "Ko'rish va yuklab olish", grantedAt: "2026-04-10 10:22" }
      ]
    },
    {
      id: "PROP-1002",
      type: "Ofis",
      name: "Oybek Business Center Office",
      address: "Toshkent, Mirobod tumani, Oybek ko'chasi, 22A",
      area: "480 m²",
      price: 320000,
      description: "Markaziy lokatsiyadagi premium ofis maydoni, tayyor ijarachilar bilan.",
      owner: { name: "Karimova Madina", id: "BB9876543", phone: "+998 91 321 00 11" },
      verification: {
        status: "Qo'shimcha tekshiruv kerak",
        verifier: "Notarial audit markazi",
        notes: "Yangi ijara shartnomalari yuklanishi kerak.",
        updatedAt: "2026-04-11 16:05"
      },
      documents: [
        { id: "DOC-2", type: "Oldi-sotdi shartnomasi", title: "Office Deal #77", content: "Sotib olish summasi va notarial raqamlar.", hash: "DOC7E8912FD" }
      ],
      access: [
        { role: "Notarius", party: "Mirobod notarius ofisi", scope: "To'liq audit", grantedAt: "2026-04-11 16:07" }
      ]
    }
  ],
  ledger: [
    { index: 1, propertyId: "PROP-1001", action: "Mulk ro'yxatdan o'tkazildi", actor: "System", timestamp: "2026-04-10 10:18", details: "Chilonzor Family House uchun genesis ro'yxati yaratildi.", prevHash: "GENESIS", hash: "BLK4AF23B19" },
    { index: 2, propertyId: "PROP-1001", action: "Ega tasdiqlandi", actor: "Davlat kadastr agentligi", timestamp: "2026-04-10 10:20", details: "Owner identifikatsiyasi va hujjatlar tasdiqlandi.", prevHash: "BLK4AF23B19", hash: "BLK91CD882E" },
    { index: 3, propertyId: "PROP-1002", action: "Mulk ro'yxatdan o'tkazildi", actor: "System", timestamp: "2026-04-11 15:58", details: "Oybek Business Center Office registrga qo'shildi.", prevHash: "BLK91CD882E", hash: "BLK3DC7E1A4" },
    { index: 4, propertyId: "PROP-1002", action: "Verifikatsiya yangilandi", actor: "Notarial audit markazi", timestamp: "2026-04-11 16:05", details: "Qo'shimcha tekshiruv kerak statusi berildi.", prevHash: "BLK3DC7E1A4", hash: "BLK83FB440A" }
  ]
};

const state = loadState();

const metricsGrid = document.querySelector("#metricsGrid");
const heroStats = document.querySelector("#heroStats");
const miniChain = document.querySelector("#miniChain");
const propertyGrid = document.querySelector("#propertyGrid");
const ledgerTimeline = document.querySelector("#ledgerTimeline");
const propertyInspector = document.querySelector("#propertyInspector");
const toast = document.querySelector("#toast");

const propertyForm = document.querySelector("#propertyForm");
const verificationForm = document.querySelector("#verificationForm");
const transferForm = document.querySelector("#transferForm");
const documentForm = document.querySelector("#documentForm");
const accessForm = document.querySelector("#accessForm");

const propertySelects = [
  document.querySelector("#verificationPropertySelect"),
  document.querySelector("#transferPropertySelect"),
  document.querySelector("#documentPropertySelect"),
  document.querySelector("#accessPropertySelect")
];

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

propertyForm.addEventListener("submit", handlePropertySubmit);
verificationForm.addEventListener("submit", handleVerificationSubmit);
transferForm.addEventListener("submit", handleTransferSubmit);
documentForm.addEventListener("submit", handleDocumentSubmit);
accessForm.addEventListener("submit", handleAccessSubmit);

render();

function handlePropertySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const propertyId = `PROP-${1000 + state.properties.length + 1}`;
  const property = {
    id: propertyId,
    type: formData.get("type"),
    name: formData.get("name").trim(),
    address: formData.get("address").trim(),
    area: formData.get("area").trim(),
    price: Number(formData.get("price")),
    description: formData.get("description").trim(),
    owner: {
      name: formData.get("ownerName").trim(),
      id: formData.get("ownerId").trim(),
      phone: formData.get("ownerPhone").trim()
    },
    verification: {
      status: "Tekshiruv kutilmoqda",
      verifier: "Kutilmoqda",
      notes: "Yangi mulk verifikatsiyaga yuborildi.",
      updatedAt: now()
    },
    documents: [],
    access: [{ role: "Davlat organi", party: "Kadastr agentligi", scope: "To'liq audit", grantedAt: now() }]
  };

  state.properties.unshift(property);
  state.selectedPropertyId = propertyId;
  addLedgerBlock({
    propertyId,
    action: "Mulk ro'yxatdan o'tkazildi",
    actor: "System",
    details: `${property.name} blockchain registriga muvaffaqiyatli qo'shildi.`
  });
  persistAndRender();
  event.currentTarget.reset();
  showToast("Yangi mulk blockchain registriga qo'shildi.");
}

function handleVerificationSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const property = findProperty(formData.get("propertyId"));
  if (!property) return;

  property.verification = {
    status: formData.get("result"),
    verifier: formData.get("verifier").trim(),
    notes: formData.get("notes").trim() || "Izoh kiritilmadi.",
    updatedAt: now()
  };

  addLedgerBlock({
    propertyId: property.id,
    action: "Verifikatsiya yangilandi",
    actor: property.verification.verifier,
    details: `${property.verification.status}: ${property.verification.notes}`
  });
  state.selectedPropertyId = property.id;
  persistAndRender();
  event.currentTarget.reset();
  showToast("Ega tekshiruvi blockchain tarixiga yozildi.");
}

function handleTransferSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const property = findProperty(formData.get("propertyId"));
  if (!property) return;

  const previousOwner = `${property.owner.name} (${property.owner.id})`;
  property.owner = {
    name: formData.get("newOwnerName").trim(),
    id: formData.get("newOwnerId").trim(),
    phone: formData.get("newOwnerPhone").trim()
  };
  property.price = Number(formData.get("amount"));
  property.verification = {
    status: "Tasdiqlandi",
    verifier: "Transfer smart workflow",
    notes: `${formData.get("mode")} jarayoni muvaffaqiyatli yozildi.`,
    updatedAt: now()
  };

  addLedgerBlock({
    propertyId: property.id,
    action: formData.get("mode"),
    actor: "Transfer smart workflow",
    details: `${previousOwner} dan ${property.owner.name} ga o'tdi. Summa: $${formatMoney(property.price)}. ${formData.get("notes").trim()}`
  });
  state.selectedPropertyId = property.id;
  persistAndRender();
  event.currentTarget.reset();
  showToast("Ownership transfer blokka saqlandi.");
}

function handleDocumentSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const property = findProperty(formData.get("propertyId"));
  if (!property) return;

  const payload = formData.get("content").trim();
  const documentItem = {
    id: `DOC-${Date.now()}`,
    type: formData.get("documentType"),
    title: formData.get("title").trim(),
    content: payload,
    hash: hashText(`${property.id}:${payload}:${Date.now()}`)
  };
  property.documents.unshift(documentItem);

  addLedgerBlock({
    propertyId: property.id,
    action: "Hujjat qo'shildi",
    actor: "Document vault",
    details: `${documentItem.title} (${documentItem.type}) xeshi ${documentItem.hash} bilan saqlandi.`
  });
  state.selectedPropertyId = property.id;
  persistAndRender();
  event.currentTarget.reset();
  showToast("Hujjat blokka biriktirildi.");
}

function handleAccessSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const property = findProperty(formData.get("propertyId"));
  if (!property) return;

  const access = {
    role: formData.get("role"),
    party: formData.get("party").trim(),
    scope: formData.get("scope"),
    grantedAt: now()
  };
  property.access.unshift(access);

  addLedgerBlock({
    propertyId: property.id,
    action: "Access policy yangilandi",
    actor: access.party,
    details: `${access.role} roliga ${access.scope} huquqi berildi.`
  });
  state.selectedPropertyId = property.id;
  persistAndRender();
  event.currentTarget.reset();
  showToast("Kirish huquqi ledgerga yozildi.");
}

function render() {
  renderMetrics();
  renderHeroStats();
  renderPropertyOptions();
  renderMiniChain();
  renderProperties();
  renderTimeline();
  renderInspector();
}

function renderMetrics() {
  const verifiedCount = state.properties.filter((item) => item.verification.status === "Tasdiqlandi").length;
  const documentCount = state.properties.reduce((sum, item) => sum + item.documents.length, 0);
  const accessCount = state.properties.reduce((sum, item) => sum + item.access.length, 0);
  const metrics = [
    { label: "Mulklar", value: state.properties.length, note: "Registrdagi aktivlar soni" },
    { label: "Tasdiqlangan", value: verifiedCount, note: "Verifikatsiyadan o'tgan mulklar" },
    { label: "Blockchain bloklar", value: state.ledger.length, note: "Audit trail yozuvlari" },
    { label: "Hujjatlar", value: documentCount, note: "Saqlangan yuridik fayllar" },
    { label: "Access policy", value: accessCount, note: "Berilgan ruxsatlar soni" }
  ];

  metricsGrid.innerHTML = metrics.map((metric) => `
    <article class="metric-card">
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
      <span>${metric.note}</span>
    </article>
  `).join("");
}

function renderHeroStats() {
  const totalValue = state.properties.reduce((sum, item) => sum + item.price, 0);
  const pending = state.properties.filter((item) => item.verification.status !== "Tasdiqlandi").length;
  const chips = [
    { value: `$${formatMoney(totalValue)}`, label: "Umumiy aktiv qiymati" },
    { value: state.ledger.length, label: "Hash bilan bog'langan bloklar" },
    { value: pending, label: "Tekshiruvdagi obyektlar" }
  ];

  heroStats.innerHTML = chips.map((chip) => `
    <div class="stat-chip">
      <strong>${chip.value}</strong>
      <span>${chip.label}</span>
    </div>
  `).join("");
}

function renderPropertyOptions() {
  const options = state.properties.map((property) => `<option value="${property.id}">${property.id} • ${property.name}</option>`).join("");
  propertySelects.forEach((select) => {
    const previousValue = select.value;
    select.innerHTML = options;
    select.value = state.properties.some((property) => property.id === previousValue)
      ? previousValue
      : state.selectedPropertyId || state.properties[0]?.id || "";
  });
}

function renderMiniChain() {
  miniChain.innerHTML = state.ledger.slice(0, 4).map((block) => `
    <div class="chain-node">
      <span class="chain-badge">#${block.index}</span>
      <div>
        <strong>${block.action}</strong>
        <div class="property-meta">${block.propertyId} • ${block.timestamp}</div>
      </div>
      <span class="tag">${block.hash.slice(0, 8)}</span>
    </div>
  `).join("");
}

function renderProperties() {
  propertyGrid.innerHTML = state.properties.map((property) => `
    <article class="property-card ${property.id === state.selectedPropertyId ? "active" : ""}" data-property-id="${property.id}">
      <header>
        <div>
          <span class="eyebrow">${property.type}</span>
          <h4>${property.name}</h4>
        </div>
        <span class="tag ${statusClass(property.verification.status)}">${property.verification.status}</span>
      </header>
      <div class="property-meta">
        <span><strong>${property.id}</strong></span>
        <span>${property.address}</span>
        <span>Egasi: ${property.owner.name}</span>
        <span>Qiymati: $${formatMoney(property.price)}</span>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-property-id]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedPropertyId = card.dataset.propertyId;
      persistState();
      renderProperties();
      renderInspector();
    });
  });
}

function renderTimeline() {
  ledgerTimeline.innerHTML = [...state.ledger].reverse().map((block) => `
    <article class="timeline-item">
      <header>
        <div>
          <span class="eyebrow">${block.propertyId}</span>
          <h4>${block.action}</h4>
        </div>
        <span class="tag">#${block.index}</span>
      </header>
      <p>${block.details}</p>
      <p class="timeline-hash">Hash: ${block.hash} | Prev: ${block.prevHash}</p>
      <p>${block.actor} • ${block.timestamp}</p>
    </article>
  `).join("");
}

function renderInspector() {
  const property = findProperty(state.selectedPropertyId) || state.properties[0];
  if (!property) {
    propertyInspector.className = "inspector empty-state";
    propertyInspector.textContent = "Hozircha mulk mavjud emas.";
    return;
  }

  state.selectedPropertyId = property.id;
  const propertyLedger = state.ledger.filter((block) => block.propertyId === property.id).reverse();
  propertyInspector.className = "inspector-grid";
  propertyInspector.innerHTML = `
    <section class="inspector-panel full">
      <div class="inspector-header">
        <div>
          <span class="eyebrow">${property.type}</span>
          <h3>${property.name}</h3>
        </div>
        <span class="tag ${statusClass(property.verification.status)}">${property.verification.status}</span>
      </div>
      <p>${property.description}</p>
      <div class="property-meta">
        <span>ID: ${property.id}</span>
        <span>Manzil: ${property.address}</span>
        <span>Maydon: ${property.area}</span>
        <span>Qiymati: $${formatMoney(property.price)}</span>
      </div>
    </section>

    <section class="inspector-panel">
      <strong>Joriy egasi</strong>
      <p>${property.owner.name}</p>
      <p>ID: ${property.owner.id}</p>
      <p>Tel: ${property.owner.phone}</p>
    </section>

    <section class="inspector-panel">
      <strong>Verifikatsiya</strong>
      <p>Status: ${property.verification.status}</p>
      <p>Tekshiruvchi: ${property.verification.verifier}</p>
      <p>${property.verification.updatedAt}</p>
    </section>

    <section class="inspector-panel full">
      <strong>Hujjatlar</strong>
      <div class="document-list">
        ${property.documents.length ? property.documents.map((item) => `
          <div class="document-entry">
            <div>
              <strong>${item.title}</strong>
              <p>${item.type}</p>
            </div>
            <div class="timeline-hash">${item.hash}</div>
          </div>
        `).join("") : '<p class="empty-note">Hali hujjat qo\'shilmagan.</p>'}
      </div>
    </section>

    <section class="inspector-panel full">
      <strong>Access control</strong>
      <div class="access-list">
        ${property.access.length ? property.access.map((entry) => `
          <div class="access-entry">
            <div>
              <strong>${entry.party}</strong>
              <p>${entry.role}</p>
            </div>
            <div>
              <div class="tag">${entry.scope}</div>
              <p>${entry.grantedAt}</p>
            </div>
          </div>
        `).join("") : '<p class="empty-note">Hali access policy kiritilmagan.</p>'}
      </div>
    </section>

    <section class="inspector-panel full">
      <strong>Mulk tarixi</strong>
      <div class="timeline">
        ${propertyLedger.map((block) => `
          <article class="timeline-item">
            <header>
              <h4>${block.action}</h4>
              <span class="tag">#${block.index}</span>
            </header>
            <p>${block.details}</p>
            <p>${block.timestamp}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function addLedgerBlock({ propertyId, action, actor, details }) {
  const prevHash = state.ledger[0]?.hash || "GENESIS";
  const index = state.ledger.length + 1;
  const timestamp = now();
  const hash = hashText(`${index}|${propertyId}|${action}|${actor}|${timestamp}|${details}|${prevHash}`);
  state.ledger.unshift({ index, propertyId, action, actor, timestamp, details, prevHash, hash });
}

function findProperty(id) {
  return state.properties.find((property) => property.id === id);
}

function persistAndRender() {
  persistState();
  render();
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedState);
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("State parse error", error);
    return structuredClone(seedState);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function now() {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date()).replace(",", "");
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }
  return `BLK${Math.abs(hash).toString(16).toUpperCase().padStart(8, "0")}`.slice(0, 11);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function statusClass(status) {
  if (status === "Tasdiqlandi") return "ok";
  if (status === "Rad etildi") return "bad";
  return "warn";
}

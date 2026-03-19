const timeElement = document.getElementById("local-time");
const pingList = document.getElementById("ping-list");
const deviceTable = document.getElementById("device-table");
const deviceTableNodes = document.getElementById("device-table-nodes");
const deviceForm = document.getElementById("device-form");
const deviceSearchInput = document.getElementById("device-search");
const statusFilterButtons = document.querySelectorAll(".status-filter");
const eventsFilterButtons = document.querySelectorAll("[data-event-filter]");
const eventsTable = document.getElementById("events-table");
const eventsLiveToggle = document.getElementById("events-live-toggle");
const eventsLiveStatus = document.getElementById("events-live-status");
const reportsPeriodSelect = document.getElementById("reports-period-select");
const reportsSlaPath = document.getElementById("reports-sla-path");
const reportsSlaLabel = document.getElementById("reports-sla-label");
const reportsSlaSubtitle = document.getElementById("reports-sla-subtitle");
const categoryTabs = document.querySelectorAll(".tab");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const dashboardTopology = document.getElementById("dashboard-topology");
const topologyTabs = document.querySelectorAll(".topology-tab");
const topologyAreaSelect = document.getElementById("topology-area-select");
const topologyStage = document.getElementById("topology-stage");
const languageSelect = document.getElementById("language-select");
const themeSelect = document.getElementById("theme-select");
const roleSelect = document.getElementById("role-select");
const roleHint = document.getElementById("role-hint");
const topologyNodeForm = document.getElementById("topology-node-form");
const topologyLinkForm = document.getElementById("topology-link-form");
const topologyNodeList = document.getElementById("topology-node-list");
const topologyNodeCount = document.getElementById("topology-node-count");
const topologyLinkCount = document.getElementById("topology-link-count");
const topologyLinkFrom = document.getElementById("topology-link-from");
const topologyLinkTo = document.getElementById("topology-link-to");
const topologyEditToggle = document.getElementById("topology-edit-toggle");
const topologyLinkToggle = document.getElementById("topology-link-toggle");
const topologyClearLinks = document.getElementById("topology-clear-links");
const topologyViewReset = document.getElementById("topology-view-reset");
const topologySaveBtn = document.getElementById("topology-save-btn");
const topologyExportBtn = document.getElementById("topology-export-btn");
const topologyImportBtn = document.getElementById("topology-import-btn");
const topologyImportFile = document.getElementById("topology-import-file");
const topologyStageLayers = new Map();

const formatTime = (date) =>
  date.toLocaleTimeString(activeLanguage === "uz" ? "uz-UZ" : "ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const updateTime = () => {
  timeElement.textContent = formatTime(new Date());
};

const pingSamples = [
  { label: "SW-101", min: 9, max: 18 },
  { label: "SW-205", min: 18, max: 38 },
  { label: "SW-312", min: 11, max: 22 },
  { label: "SW-509", min: 0, max: 0, timeoutChance: 0.4 },
  { label: "IP-PHONE-128", min: 12, max: 26 },
];

const pingClass = (value) => {
  if (value === null) return "danger";
  if (value > 28) return "warning";
  return "success";
};

const formatPingValue = (value) => (value === null ? "timeout" : `${value} мс`);

const renderPingList = () => {
  if (!pingList) return;
  pingList.innerHTML = "";
  pingSamples.forEach((sample) => {
    const isTimeout =
      sample.timeoutChance && Math.random() < sample.timeoutChance;
    const value = isTimeout
      ? null
      : Math.floor(sample.min + Math.random() * (sample.max - sample.min));
    const item = document.createElement("div");
    item.className = "ping-item";
    item.innerHTML = `\n      <span>${sample.label}</span>\n      <span class=\"pill ${pingClass(value)}\">${formatPingValue(value)}</span>\n    `;
    pingList.appendChild(item);
  });
};

const devices = [
  { name: "Core-SW-01", ip: "10.10.0.1", category: "switch", status: "online" },
  { name: "Access-SW-12", ip: "10.10.12.1", category: "switch", status: "online" },
  { name: "Access-SW-18", ip: "10.10.18.1", category: "switch", status: "warning" },
  { name: "VoIP-GW-01", ip: "10.20.0.10", category: "router", status: "online" },
  { name: "IP-PHONE-128", ip: "10.30.12.128", category: "phone", status: "online" },
  { name: "IP-PHONE-209", ip: "10.30.21.209", category: "phone", status: "offline" },
  { name: "Edge-RTR-05", ip: "10.40.5.1", category: "router", status: "warning" },
  { name: "Monitoring-DB", ip: "10.50.0.12", category: "server", status: "online" },
  { name: "Call-Manager", ip: "10.50.0.20", category: "server", status: "online" },
];

const translations = {
  ru: {
    "brand.title": "Центр контроля",
    "brand.subtitle": "Network Command",
    "nav.dashboard": "Дашборд",
    "nav.network": "Сеть",
    "nav.topology": "Топология",
    "nav.nodes": "Узлы",
    "nav.events": "События",
    "nav.reports": "Отчёты",
    "nav.settings": "Настройки",
    "sidebar.statusLabel": "Состояние агента",
    "sidebar.statusActive": "Активен",
    "sidebar.languageLabel": "Язык",
    "sidebar.themeLabel": "Тема",
    "sidebar.roleLabel": "Роль",
    "roles.viewer": "Viewer",
    "roles.operator": "Operator",
    "roles.admin": "Admin",
    "roles.hintViewer": "Только просмотр",
    "roles.hintOperator": "Редактирование без импорта",
    "roles.hintAdmin": "Полный доступ",
    "dashboard.title": "Центр контроля сети",
    "dashboard.subtitle": "250 коммутаторов • 600 IP-телефонов • живые пинги",
    "actions.export": "Экспорт",
    "actions.createReport": "Создать отчёт",
    "actions.import": "Импорт",
    "actions.addNode": "Добавить узел",
    "actions.filter": "Фильтр",
    "actions.exportCsv": "Экспорт CSV",
    "actions.templates": "Шаблоны",
    "actions.reset": "Сброс",
    "actions.save": "Сохранить",
    "actions.optimize": "Оптимизация",
    "actions.diagnostics": "Диагностика",
    "actions.escalate": "Эскалация",
    "actions.plan": "План работ",
    "actions.createTicket": "Создать тикет",
    "actions.details": "Подробнее",
    "actions.configure": "Настроить",
    "categories.title": "Категории устройств",
    "categories.subtitle": "Переключайтесь между группами и добавляйте новые устройства",
    "categories.all": "Все",
    "categories.switch": "Коммутаторы",
    "categories.phone": "IP-телефоны",
    "categories.router": "Маршрутизаторы",
    "categories.server": "Серверы",
    "traffic.title": "Трафик магистрали",
    "traffic.subtitle": "Gbps, последние 12 часов",
    "traffic.realtime": "Real-time",
    "incidents.title": "Инциденты по зонам",
    "incidents.subtitle": "Текущие состояния",
    "topologyCard.title": "Топология нагрузки",
    "topologyCard.subtitle": "Графическая карта коммутаторов",
    "ping.title": "Пинг критичных узлов",
    "ping.subtitle": "Живые пинги",
    "network.title": "Сеть",
    "network.subtitle": "Обзор каналов связи и сегментов",
    "network.coreLinks": "Каналы ядра",
    "network.coreLinksSubtitle": "Средняя загрузка 68%",
    "network.segmentMap": "Карта сегментов",
    "network.segmentMapSubtitle": "Core • Access • Voice",
    "network.segmentOverlay": "Сегменты: Core, Access, Voice",
    "network.segmentActive": "Активно: 14",
    "nodes.title": "Узлы",
    "nodes.subtitle": "Список устройств и групп",
    "inventory.title": "Инвентарь устройств",
    "inventory.subtitle": "Доступно через таблицу на дашборде",
    "inventory.searchPlaceholder": "Поиск по имени или IP",
    "inventory.filterAll": "Все",
    "inventory.filterOnline": "Онлайн",
    "inventory.filterWarning": "Предупреждение",
    "inventory.filterOffline": "Оффлайн",
    "topology.title": "Топология",
    "topology.subtitle": "Соберите схему сети и наблюдайте за связями",
    "topology.edit": "Редактировать",
    "topology.editing": "Редактирование",
    "topology.linksOn": "Линии: вкл",
    "topology.linksOff": "Линии: выкл",
    "topology.clearLinks": "Очистить линии",
    "topology.viewReset": "Сброс вида",
    "topology.save": "Сохранить схему",
    "topology.builderTitle": "Конструктор топологии",
    "topology.builderSubtitle": "Добавляйте узлы и связи — данные сразу появятся на дашборде",
    "topology.nodeName": "Имя узла",
    "topology.nodeNamePlaceholder": "SW-###",
    "topology.nodeType": "Тип устройства",
    "topology.nodeZone": "Зона",
    "topology.addNode": "Добавить узел",
    "topology.nodeA": "Узел A",
    "topology.nodeB": "Узел B",
    "topology.linkType": "Тип связи",
    "topology.addLink": "Добавить связь",
    "topology.hintTitle": "Быстрое соединение",
    "topology.hintText":
      "Включите «Редактировать» и «Линии», кликните по двум узлам и выберите тип связи.",
    "topology.panZoomHint": "Колёсиком — масштаб, перетаскиванием пустой области — панорама.",
    "topology.summaryNodes": "Узлов",
    "topology.summaryLinks": "Связей",
    "topology.summaryZones": "Зон",
    "events.title": "События",
    "events.subtitle": "Лента инцидентов и уведомлений",
    "events.recentTitle": "Инциденты за 24 часа",
    "events.filterAll": "Все",
    "events.filterCritical": "Критично",
    "events.filterWarning": "Предупреждение",
    "events.filterInfo": "Инфо",
    "events.liveOn": "Live: вкл",
    "events.liveOff": "Live: выкл",
    "events.liveStatus": "Обновлено только что",
    "events.updatedAt": "Обновлено",
    "reports.title": "Отчёты",
    "reports.subtitle": "Подготовка аналитики и отчётности",
    "reports.availabilityTitle": "Доступность",
    "reports.period24h": "24ч",
    "reports.period7d": "7д",
    "reports.period30d": "30д",
    "reports.slaSubtitle24h": "Отчёт по SLA за сутки",
    "reports.slaSubtitle7d": "Отчёт по SLA за неделю",
    "reports.slaSubtitle30d": "Отчёт по SLA за месяц",
    "reports.slaAvg": "Средний SLA",
    "settings.title": "Настройки",
    "settings.subtitle": "Параметры мониторинга и интеграций",
    "labels.device": "Устройство",
    "labels.ip": "IP",
    "labels.category": "Категория",
    "labels.status": "Статус",
    "labels.actions": "Действия",
    "labels.ping": "Пинг",
    "labels.edit": "Редактировать",
    "category.switch": "Коммутатор",
    "category.phone": "IP-телефон",
    "category.router": "Маршрутизатор",
    "category.server": "Сервер",
    "status.online": "Онлайн",
    "status.warning": "Предупреждение",
    "status.offline": "Оффлайн",
    "type.core": "Core",
    "type.access": "Access",
    "type.voice": "Voice",
    "type.edge": "Edge",
  },
  uz: {
    "brand.title": "Nazorat markazi",
    "brand.subtitle": "Network Command",
    "nav.dashboard": "Panel",
    "nav.network": "Tarmoq",
    "nav.topology": "Topologiya",
    "nav.nodes": "Tugunlar",
    "nav.events": "Hodisalar",
    "nav.reports": "Hisobotlar",
    "nav.settings": "Sozlamalar",
    "sidebar.statusLabel": "Agent holati",
    "sidebar.statusActive": "Faol",
    "sidebar.languageLabel": "Til",
    "sidebar.themeLabel": "Mavzu",
    "sidebar.roleLabel": "Rol",
    "roles.viewer": "Viewer",
    "roles.operator": "Operator",
    "roles.admin": "Admin",
    "roles.hintViewer": "Faqat ko‘rish",
    "roles.hintOperator": "Importsiz tahrirlash",
    "roles.hintAdmin": "To‘liq ruxsat",
    "dashboard.title": "Tarmoq nazorat markazi",
    "dashboard.subtitle": "250 kommutator • 600 IP-telefon • jonli pinglar",
    "actions.export": "Eksport",
    "actions.createReport": "Hisobot yaratish",
    "actions.import": "Import",
    "actions.addNode": "Tugun qo‘shish",
    "actions.filter": "Filtr",
    "actions.exportCsv": "CSV eksport",
    "actions.templates": "Shablonlar",
    "actions.reset": "Qayta tiklash",
    "actions.save": "Saqlash",
    "actions.optimize": "Optimallashtirish",
    "actions.diagnostics": "Diagnostika",
    "actions.escalate": "Eskalatsiya",
    "actions.plan": "Ishlar rejasi",
    "actions.createTicket": "Tiket yaratish",
    "actions.details": "Batafsil",
    "actions.configure": "Sozlash",
    "categories.title": "Qurilma kategoriyalari",
    "categories.subtitle": "Guruhlar o‘rtasida o‘ting va yangi qurilmalar qo‘shing",
    "categories.all": "Barchasi",
    "categories.switch": "Kommutatorlar",
    "categories.phone": "IP-telefonlar",
    "categories.router": "Marshrutizatorlar",
    "categories.server": "Serverlar",
    "traffic.title": "Magistral trafik",
    "traffic.subtitle": "Gbps, oxirgi 12 soat",
    "traffic.realtime": "Real-time",
    "incidents.title": "Zonalar bo‘yicha hodisalar",
    "incidents.subtitle": "Joriy holatlar",
    "topologyCard.title": "Yuklama topologiyasi",
    "topologyCard.subtitle": "Kommutatorlarning grafik xaritasi",
    "ping.title": "Muhim tugunlar pingi",
    "ping.subtitle": "Jonli pinglar",
    "network.title": "Tarmoq",
    "network.subtitle": "Aloqa kanallari va segmentlar sharhi",
    "network.coreLinks": "Yadro kanallari",
    "network.coreLinksSubtitle": "O‘rtacha yuklama 68%",
    "network.segmentMap": "Segmentlar xaritasi",
    "network.segmentMapSubtitle": "Core • Access • Voice",
    "network.segmentOverlay": "Segmentlar: Core, Access, Voice",
    "network.segmentActive": "Faol: 14",
    "nodes.title": "Tugunlar",
    "nodes.subtitle": "Qurilmalar va guruhlar ro‘yxati",
    "inventory.title": "Qurilmalar inventari",
    "inventory.subtitle": "Paneldagi jadval orqali mavjud",
    "inventory.searchPlaceholder": "Nomi yoki IP bo‘yicha qidirish",
    "inventory.filterAll": "Barchasi",
    "inventory.filterOnline": "Onlayn",
    "inventory.filterWarning": "Ogohlantirish",
    "inventory.filterOffline": "Oflayn",
    "topology.title": "Topologiya",
    "topology.subtitle": "Tarmoq sxemasini yig‘ing va bog‘lanishlarni kuzating",
    "topology.edit": "Tahrirlash",
    "topology.editing": "Tahrirlash rejimi",
    "topology.linksOn": "Chiziqlar: yoq",
    "topology.linksOff": "Chiziqlar: o‘ch",
    "topology.clearLinks": "Chiziqlarni tozalash",
    "topology.viewReset": "Ko‘rishni tiklash",
    "topology.save": "Sxemani saqlash",
    "topology.builderTitle": "Topologiya konstruktori",
    "topology.builderSubtitle": "Tugunlar va bog‘lanishlarni qo‘shing — ma’lumotlar panelda darhol ko‘rinadi",
    "topology.nodeName": "Tugun nomi",
    "topology.nodeNamePlaceholder": "SW-###",
    "topology.nodeType": "Qurilma turi",
    "topology.nodeZone": "Zona",
    "topology.addNode": "Tugun qo‘shish",
    "topology.nodeA": "Tugun A",
    "topology.nodeB": "Tugun B",
    "topology.linkType": "Bog‘lanish turi",
    "topology.addLink": "Bog‘lanish qo‘shish",
    "topology.hintTitle": "Tez ulash",
    "topology.hintText":
      "«Tahrirlash» va «Chiziqlar»ni yoqing, ikki tugunni bosing va bog‘lanish turini tanlang.",
    "topology.panZoomHint": "G‘ildirak — masshtab, bo‘sh joyni tortish — panorama.",
    "topology.summaryNodes": "Tugunlar",
    "topology.summaryLinks": "Bog‘lanishlar",
    "topology.summaryZones": "Zonalar",
    "events.title": "Hodisalar",
    "events.subtitle": "Hodisalar va bildirishnomalar lentasi",
    "events.recentTitle": "Oxirgi 24 soatdagi hodisalar",
    "events.filterAll": "Barchasi",
    "events.filterCritical": "Kritik",
    "events.filterWarning": "Ogohlantirish",
    "events.filterInfo": "Info",
    "events.liveOn": "Live: yoq",
    "events.liveOff": "Live: o‘ch",
    "events.liveStatus": "Hozirgina yangilandi",
    "events.updatedAt": "Yangilandi",
    "reports.title": "Hisobotlar",
    "reports.subtitle": "Tahlil va hisobot tayyorlash",
    "reports.availabilityTitle": "Mavjudlik",
    "reports.period24h": "24soat",
    "reports.period7d": "7kun",
    "reports.period30d": "30kun",
    "reports.slaSubtitle24h": "Sutkalik SLA hisoboti",
    "reports.slaSubtitle7d": "Haftalik SLA hisoboti",
    "reports.slaSubtitle30d": "Oylik SLA hisoboti",
    "reports.slaAvg": "O‘rtacha SLA",
    "settings.title": "Sozlamalar",
    "settings.subtitle": "Monitoring va integratsiya parametrlari",
    "labels.device": "Qurilma",
    "labels.ip": "IP",
    "labels.category": "Kategoriya",
    "labels.status": "Holat",
    "labels.actions": "Amallar",
    "labels.ping": "Ping",
    "labels.edit": "Tahrirlash",
    "category.switch": "Kommutator",
    "category.phone": "IP-telefon",
    "category.router": "Marshrutizator",
    "category.server": "Server",
    "status.online": "Onlayn",
    "status.warning": "Ogohlantirish",
    "status.offline": "Oflayn",
    "type.core": "Core",
    "type.access": "Access",
    "type.voice": "Voice",
    "type.edge": "Edge",
  },
};

let activeLanguage = "ru";

const translate = (key) =>
  translations[activeLanguage]?.[key] ?? translations.ru[key] ?? key;

const categoryLabels = {
  switch: () => translate("category.switch"),
  phone: () => translate("category.phone"),
  router: () => translate("category.router"),
  server: () => translate("category.server"),
};

const statusLabels = {
  online: () => translate("status.online"),
  warning: () => translate("status.warning"),
  offline: () => translate("status.offline"),
};

const baseTopologyNodes = [
  { id: "core-sw", name: "CORE-SW", type: "core", zone: "РЖУ-1", x: 50, y: 14 },
  { id: "sw-101", name: "SW-101", type: "access", zone: "РЖУ-1", x: 18, y: 48 },
  { id: "sw-205", name: "SW-205", type: "access", zone: "РЖУ-1", x: 82, y: 48 },
  { id: "sw-312", name: "SW-312", type: "voice", zone: "РЖУ-2", x: 50, y: 70 },
  { id: "sw-509", name: "SW-509", type: "edge", zone: "РЖУ-4", x: 88, y: 78 },
  { id: "sw-041", name: "SW-041", type: "access", zone: "РЖУ-3", x: 8, y: 78 },
];

const clampPercent = (value, min = 6, max = 94) =>
  Math.min(max, Math.max(min, value));

const buildTopologyNodes = (suffix, offsetX, offsetY) =>
  baseTopologyNodes.map((node) => ({
    ...node,
    id: `${node.id}-${suffix}`,
    x: clampPercent(node.x + offsetX),
    y: clampPercent(node.y + offsetY, 8, 92),
  }));

const topologyData = {
  "rju-1": { label: "РЖУ-1", nodes: buildTopologyNodes("rju-1", 0, 0), links: [] },
  "rju-2": { label: "РЖУ-2", nodes: buildTopologyNodes("rju-2", -6, 4), links: [] },
  "rju-3": { label: "РЖУ-3", nodes: buildTopologyNodes("rju-3", 4, -6), links: [] },
  "rju-4": { label: "РЖУ-4", nodes: buildTopologyNodes("rju-4", -10, -2), links: [] },
  "rju-5": { label: "РЖУ-5", nodes: buildTopologyNodes("rju-5", 8, 6), links: [] },
  "rju-6": { label: "РЖУ-6", nodes: buildTopologyNodes("rju-6", 2, 10), links: [] },
};

const TOPOLOGY_STORAGE_KEY = "topology-data-v1";


const cloneNode = (node) => ({
  id: node.id,
  name: node.name,
  type: node.type,
  zone: node.zone,
  x: Number(node.x),
  y: Number(node.y),
});

const cloneLink = (link) => ({
  from: link.from,
  to: link.to,
  type: link.type,
});

const saveTopologyState = () => {
  const payload = Object.fromEntries(
    Object.entries(topologyData).map(([key, value]) => [
      key,
      {
        nodes: value.nodes.map(cloneNode),
        links: value.links.map(cloneLink),
      },
    ])
  );
  localStorage.setItem(TOPOLOGY_STORAGE_KEY, JSON.stringify(payload));
};

const loadTopologyState = () => {
  const raw = localStorage.getItem(TOPOLOGY_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.keys(topologyData).forEach((key) => {
      const section = parsed[key];
      if (!section || !Array.isArray(section.nodes) || !Array.isArray(section.links)) return;
      topologyData[key].nodes = section.nodes.map(cloneNode);
      topologyData[key].links = section.links.map(cloneLink);
    });
  } catch (error) {
    console.error("Failed to load topology state", error);
  }
};

const importTopologyState = (parsed) => {
  Object.keys(topologyData).forEach((key) => {
    const section = parsed[key];
    if (!section || !Array.isArray(section.nodes) || !Array.isArray(section.links)) return;
    topologyData[key].nodes = section.nodes.map(cloneNode);
    topologyData[key].links = section.links.map(cloneLink);
  });
  saveTopologyState();
  syncLinkOptions();
  renderTopology();
};

let activeCategory = "all";
let activeStatusFilter = "all";
let deviceSearchQuery = "";
let activeTopologyKey = "rju-1";
let activeEventFilter = "all";
let currentRole = "admin";
let isLiveEventsEnabled = true;
let activeReportsPeriod = "7d";
let isTopologyEditMode = false;
let isTopologyLinkMode = false;
let selectedLinkNodeId = null;
let selectedLinkType = "core";
const topologyView = { scale: 1, offsetX: 0, offsetY: 0 };

const slaTrendData = {
  "24h": {
    subtitleKey: "reports.slaSubtitle24h",
    avg: "99.91%",
    points: [99.82, 99.88, 99.9, 99.84, 99.89, 99.93, 99.9, 99.94, 99.92, 99.95, 99.91],
  },
  "7d": {
    subtitleKey: "reports.slaSubtitle7d",
    avg: "99.96%",
    points: [99.9, 99.92, 99.93, 99.91, 99.95, 99.96, 99.94, 99.97, 99.96, 99.98, 99.96],
  },
  "30d": {
    subtitleKey: "reports.slaSubtitle30d",
    avg: "99.89%",
    points: [99.78, 99.8, 99.82, 99.81, 99.83, 99.84, 99.85, 99.86, 99.87, 99.88, 99.89],
  },
};

const buildDeviceTable = (rows, target) => {
  if (!target) return;
  target.innerHTML = `
    <div class="device-row header">
      <span>${translate("labels.device")}</span>
      <span>IP</span>
      <span>${translate("labels.category")}</span>
      <span>${translate("labels.status")}</span>
      <span>${translate("labels.actions")}</span>
    </div>
  `;

  rows.forEach((device) => {
    const statusClass = device.status;
    const row = document.createElement("div");
    row.className = "device-row";
    row.innerHTML = `
      <span>${device.name}</span>
      <span>${device.ip}</span>
      <span class="device-pill">${categoryLabels[device.category]()}</span>
      <span class="device-status ${statusClass}">${statusLabels[device.status]()}</span>
      <span class="device-actions">
        <button class="ghost small" type="button">${translate("labels.ping")}</button>
        <button class="ghost small" type="button">${translate("labels.edit")}</button>
      </span>
    `;
    target.appendChild(row);
  });
};

const renderDeviceTable = () => {
  const query = deviceSearchQuery.trim().toLowerCase();
  const rows = devices.filter((device) => {
    const byCategory = activeCategory === "all" || device.category === activeCategory;
    const byStatus = activeStatusFilter === "all" || device.status === activeStatusFilter;
    const byQuery =
      !query ||
      device.name.toLowerCase().includes(query) ||
      device.ip.toLowerCase().includes(query);
    return byCategory && byStatus && byQuery;
  });
  buildDeviceTable(rows, deviceTable);
  buildDeviceTable(rows, deviceTableNodes);
};

const setStatusFilter = (status) => {
  activeStatusFilter = status;
  statusFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.statusFilter === status);
  });
  renderDeviceTable();
};

const filterEventsTable = () => {
  if (!eventsTable) return;
  const rows = eventsTable.querySelectorAll(".event-row");
  rows.forEach((row) => {
    const severity = row.dataset.severity || "info";
    row.style.display = activeEventFilter === "all" || severity === activeEventFilter ? "grid" : "none";
  });
};

const setEventFilter = (severity) => {
  activeEventFilter = severity;
  eventsFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.eventFilter === severity);
  });
  filterEventsTable();
};

const buildSparklinePath = (points) => {
  if (!points.length) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 200;
      const y = 52 - ((value - min) / range) * 34;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

const renderReportsTrend = () => {
  const trend = slaTrendData[activeReportsPeriod] || slaTrendData["7d"];
  if (reportsSlaPath) {
    reportsSlaPath.setAttribute("d", buildSparklinePath(trend.points));
  }
  if (reportsSlaLabel) {
    reportsSlaLabel.textContent = `${translate("reports.slaAvg")}: ${trend.avg}`;
  }
  if (reportsSlaSubtitle) {
    reportsSlaSubtitle.textContent = translate(trend.subtitleKey);
  }
  if (reportsPeriodSelect) {
    reportsPeriodSelect.value = activeReportsPeriod;
  }
};


const setEventsLiveStatus = (text) => {
  if (!eventsLiveStatus) return;
  eventsLiveStatus.textContent = text;
};

const appendLiveEvent = (severity, title) => {
  if (!eventsTable) return;
  const row = document.createElement("div");
  row.className = "event-row";
  row.dataset.severity = severity;
  const indicatorClass = severity === "critical" ? "danger" : severity === "warning" ? "warning" : "success";
  row.innerHTML = `
    <div class="event-indicator ${indicatorClass}"></div>
    <div>
      <p class="event-title">${title}</p>
      <p class="event-meta">${severity === "critical" ? translate("events.filterCritical") : severity === "warning" ? translate("events.filterWarning") : translate("events.filterInfo")} • ${formatTime(new Date())}</p>
    </div>
    <div class="event-actions">
      <button class="ghost small" type="button">${translate("actions.details")}</button>
    </div>
  `;
  eventsTable.prepend(row);
  const rows = eventsTable.querySelectorAll('.event-row');
  if (rows.length > 20) rows[rows.length - 1].remove();
  filterEventsTable();
  setEventsLiveStatus(`${translate("events.updatedAt")}: ${formatTime(new Date())}`);
};

const setLiveEventsEnabled = (enabled) => {
  isLiveEventsEnabled = enabled;
  if (eventsLiveToggle) {
    eventsLiveToggle.classList.toggle('active', enabled);
    eventsLiveToggle.textContent = enabled ? translate('events.liveOn') : translate('events.liveOff');
  }
};

const setActiveCategory = (category) => {
  activeCategory = category;
  categoryTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderDeviceTable();
};

const typeLabels = {
  core: () => translate("type.core"),
  access: () => translate("type.access"),
  voice: () => translate("type.voice"),
  edge: () => translate("type.edge"),
};

const typeClass = (type) => {
  if (type === "core") return "node-core";
  if (type === "voice") return "node-voice";
  if (type === "edge") return "node-edge";
  return "node-access";
};

const getActiveTopology = () => topologyData[activeTopologyKey];
const getActiveNodes = () => getActiveTopology().nodes;
const getActiveLinks = () => getActiveTopology().links;

const renderTopology = () => {
  if (!dashboardTopology || !topologyStage) return;
  const topologyNodes = getActiveNodes();
  const topologyLinks = getActiveLinks();

  const renderStage = (target, isInteractive) => {
    target.innerHTML = "";
    const stage = document.createElement("div");
    stage.className = "topology-stage-inner";
    const linksLayer = document.createElement("div");
    linksLayer.className = "topology-links";
    const nodesLayer = document.createElement("div");
    nodesLayer.className = "topology-nodes";
    stage.appendChild(linksLayer);
    stage.appendChild(nodesLayer);
    topologyStageLayers.set(target, { linksLayer, nodesLayer, stageInner: stage });

    const buildLinks = () => {
      linksLayer.innerHTML = "";
      topologyLinks.forEach((link) => {
        const from = topologyNodes.find((node) => node.id === link.from);
        const to = topologyNodes.find((node) => node.id === link.to);
        if (!from || !to) return;
        const line = document.createElement("div");
        line.className = `topology-link link-${link.type}`;
        const x1 = from.x;
        const y1 = from.y;
        const x2 = to.x;
        const y2 = to.y;
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        line.style.left = `${x1}%`;
        line.style.top = `${y1}%`;
        line.style.width = `${length}%`;
        line.style.transform = `rotate(${angle}deg)`;
        linksLayer.appendChild(line);
      });
    };

    topologyNodes.forEach((node) => {
      const card = document.createElement("div");
      card.className = `topology-node ${typeClass(node.type)}`;
      if (isInteractive) {
        card.classList.add("is-interactive");
        if (isTopologyEditMode) card.classList.add("is-draggable");
        if (selectedLinkNodeId === node.id) {
          card.classList.add("is-selected");
        }
      }
      card.dataset.id = node.id;
      card.style.left = `${node.x}%`;
      card.style.top = `${node.y}%`;
      card.innerHTML = `
        <span class="node-name">${node.name}</span>
        <span class="node-zone">${node.zone}</span>
      `;
      nodesLayer.appendChild(card);
    });

    buildLinks();
    target.appendChild(stage);
  };

  renderStage(dashboardTopology, false);
  renderStage(topologyStage, true);
  applyTopologyTransform();

  if (topologyNodeList) {
    topologyNodeList.innerHTML = "";
    topologyNodes.forEach((node) => {
      const row = document.createElement("div");
      row.className = "topology-node-row";
      row.innerHTML = `
        <span>${node.name}</span>
        <span class="node-pill">${typeLabels[node.type]()}</span>
        <span class="node-zone-label">${node.zone}</span>
      `;
      topologyNodeList.appendChild(row);
    });
  }

  if (topologyNodeCount) topologyNodeCount.textContent = `${topologyNodes.length}`;
  if (topologyLinkCount) topologyLinkCount.textContent = `${topologyLinks.length}`;
};

const rebuildLinksForStage = (target) => {
  const layers = topologyStageLayers.get(target);
  if (!layers) return;
  const topologyNodes = getActiveNodes();
  const topologyLinks = getActiveLinks();
  layers.linksLayer.innerHTML = "";
  topologyLinks.forEach((link) => {
    const from = topologyNodes.find((node) => node.id === link.from);
    const to = topologyNodes.find((node) => node.id === link.to);
    if (!from || !to) return;
    const line = document.createElement("div");
    line.className = `topology-link link-${link.type}`;
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.width = `${length}%`;
    line.style.transform = `rotate(${angle}deg)`;
    layers.linksLayer.appendChild(line);
  });
};

const updateNodePositions = (nodeId) => {
  const topologyNodes = getActiveNodes();
  const node = topologyNodes.find((item) => item.id === nodeId);
  if (!node) return;
  [dashboardTopology, topologyStage].forEach((target) => {
    if (!target) return;
    const nodeElement = target.querySelector(`.topology-node[data-id="${nodeId}"]`);
    if (!nodeElement) return;
    nodeElement.style.left = `${node.x}%`;
    nodeElement.style.top = `${node.y}%`;
  });
};

const syncLinkOptions = () => {
  if (!topologyLinkFrom || !topologyLinkTo) return;
  const topologyNodes = getActiveNodes();
  const buildOptions = (select) => {
    select.innerHTML = "";
    topologyNodes.forEach((node) => {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = node.name;
      select.appendChild(option);
    });
  };
  buildOptions(topologyLinkFrom);
  buildOptions(topologyLinkTo);
};

const updateSelectedLinkType = (type) => {
  selectedLinkType = type;
};

const applyTopologyTransform = () => {
  const layers = topologyStageLayers.get(topologyStage);
  if (!layers?.stageInner) return;
  layers.stageInner.style.transform = `translate(${topologyView.offsetX}px, ${topologyView.offsetY}px) scale(${topologyView.scale})`;
};

const resetTopologyView = () => {
  topologyView.scale = 1;
  topologyView.offsetX = 0;
  topologyView.offsetY = 0;
  applyTopologyTransform();
};

const updateTopologyToggleLabels = () => {
  if (topologyEditToggle) {
    topologyEditToggle.textContent = isTopologyEditMode
      ? translate("topology.editing")
      : translate("topology.edit");
  }
  if (topologyLinkToggle) {
    topologyLinkToggle.textContent = isTopologyLinkMode
      ? translate("topology.linksOn")
      : translate("topology.linksOff");
  }
};

const applyTranslations = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translate(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.setAttribute("placeholder", translate(key));
  });
  updateTopologyToggleLabels();
  renderDeviceTable();
  renderTopology();
  renderReportsTrend();
  applyRolePermissions();
  setLiveEventsEnabled(isLiveEventsEnabled);
  if (eventsLiveStatus && !eventsLiveStatus.textContent.trim()) {
    setEventsLiveStatus(translate("events.liveStatus"));
  }
};

const rolePermissions = {
  viewer: {
    manageDevices: false,
    editTopology: false,
    importTopology: false,
    saveTopology: false,
  },
  operator: {
    manageDevices: true,
    editTopology: true,
    importTopology: false,
    saveTopology: true,
  },
  admin: {
    manageDevices: true,
    editTopology: true,
    importTopology: true,
    saveTopology: true,
  },
};

const can = (action) => Boolean(rolePermissions[currentRole]?.[action]);

const setControlEnabled = (element, enabled) => {
  if (!element) return;
  element.disabled = !enabled;
  element.classList.toggle("is-disabled", !enabled);
};

const applyRolePermissions = () => {
  setControlEnabled(deviceForm?.querySelector('button[type="submit"]'), can("manageDevices"));
  deviceForm?.querySelectorAll("input, select").forEach((el) => {
    if (el.type === "submit") return;
    el.disabled = !can("manageDevices");
  });

  setControlEnabled(topologyEditToggle, can("editTopology"));
  setControlEnabled(topologyLinkToggle, can("editTopology"));
  setControlEnabled(topologyClearLinks, can("editTopology"));
  setControlEnabled(topologySaveBtn, can("saveTopology"));
  setControlEnabled(topologyImportBtn, can("importTopology"));

  topologyNodeForm?.querySelectorAll("input, select, button").forEach((el) => {
    el.disabled = !can("editTopology");
  });
  topologyLinkForm?.querySelectorAll("select, button").forEach((el) => {
    el.disabled = !can("editTopology");
  });

  if (roleHint) {
    const key =
      currentRole === "admin"
        ? "roles.hintAdmin"
        : currentRole === "operator"
          ? "roles.hintOperator"
          : "roles.hintViewer";
    roleHint.textContent = translate(key);
  }
};

const setRole = (role) => {
  const nextRole = rolePermissions[role] ? role : "admin";
  currentRole = nextRole;
  localStorage.setItem("role", nextRole);
  if (roleSelect) roleSelect.value = nextRole;
  applyRolePermissions();
  setLiveEventsEnabled(isLiveEventsEnabled);
  if (eventsLiveStatus && !eventsLiveStatus.textContent.trim()) {
    setEventsLiveStatus(translate("events.liveStatus"));
  }
};

const setTheme = (theme) => {
  const allowedThemes = ["dark", "light", "ops", "zabbix", "graphite"];
  const nextTheme = allowedThemes.includes(theme) ? theme : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  if (themeSelect) themeSelect.value = nextTheme;
};

const setLanguage = (language) => {
  if (!translations[language]) return;
  activeLanguage = language;
  localStorage.setItem("language", language);
  if (languageSelect) languageSelect.value = language;
  applyTranslations();
  updateTime();
  setTheme(document.documentElement.dataset.theme || "dark");
};

const setActiveTopology = (key) => {
  if (!topologyData[key]) return;
  activeTopologyKey = key;
  selectedLinkNodeId = null;
  topologyTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.topology === key);
  });
  if (topologyAreaSelect) topologyAreaSelect.value = key;
  syncLinkOptions();
  renderTopology();
};

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveCategory(tab.dataset.category);
  });
});

statusFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setStatusFilter(button.dataset.statusFilter || "all");
  });
});

eventsFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setEventFilter(button.dataset.eventFilter || "all");
  });
});

if (deviceSearchInput) {
  deviceSearchInput.addEventListener("input", (event) => {
    deviceSearchQuery = event.target.value;
    renderDeviceTable();
  });
}

if (deviceForm) {
  deviceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!can("manageDevices")) return;
    const formData = new FormData(deviceForm);
    const newDevice = {
      name: formData.get("name").trim(),
      ip: formData.get("ip").trim(),
      category: formData.get("category"),
      status: formData.get("status"),
    };
    if (!newDevice.name || !newDevice.ip) return;
    devices.unshift(newDevice);
    deviceForm.reset();
    renderDeviceTable();
  });
}

if (topologyNodeForm) {
  topologyNodeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!can("editTopology")) return;
    const topologyNodes = getActiveNodes();
    const formData = new FormData(topologyNodeForm);
    const name = formData.get("name").trim();
    const type = formData.get("type");
    const zone = formData.get("zone");
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const x = Math.min(90, Math.max(10, 10 + Math.random() * 80));
    const y = Math.min(85, Math.max(8, 10 + Math.random() * 70));
    topologyNodes.push({ id, name, type, zone, x, y });
    topologyNodeForm.reset();
    syncLinkOptions();
    renderTopology();
    saveTopologyState();
  });
}

if (topologyLinkForm) {
  topologyLinkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!can("editTopology")) return;
    const topologyLinks = getActiveLinks();
    const formData = new FormData(topologyLinkForm);
    const from = formData.get("from");
    const to = formData.get("to");
    const type = formData.get("linkType");
    updateSelectedLinkType(type);
    if (!from || !to || from === to) return;
    topologyLinks.push({ from, to, type });
    topologyLinkForm.reset();
    syncLinkOptions();
    renderTopology();
    saveTopologyState();
  });
}

if (topologyStage) {
  let activeDragId = null;
  let activePointerId = null;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panOriginX = 0;
  let panOriginY = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const handlePointerMove = (event) => {
    if (!activeDragId) return;
    const bounds = topologyStage.getBoundingClientRect();
    const xPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((event.clientY - bounds.top) / bounds.height) * 100;
    const topologyNodes = getActiveNodes();
    const node = topologyNodes.find((item) => item.id === activeDragId);
    if (!node) return;
    node.x = clamp(xPercent, 6, 94);
    node.y = clamp(yPercent, 8, 92);
    updateNodePositions(activeDragId);
    rebuildLinksForStage(topologyStage);
    rebuildLinksForStage(dashboardTopology);
  };

  const stopInteraction = () => {
    if (!activeDragId) return;
    activeDragId = null;
    activePointerId = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopInteraction);
    saveTopologyState();
  };

  const handlePanMove = (event) => {
    if (!isPanning) return;
    topologyView.offsetX = panOriginX + (event.clientX - panStartX);
    topologyView.offsetY = panOriginY + (event.clientY - panStartY);
    applyTopologyTransform();
  };

  const stopPan = () => {
    if (!isPanning) return;
    isPanning = false;
    topologyStage.classList.remove("is-panning");
    window.removeEventListener("pointermove", handlePanMove);
    window.removeEventListener("pointerup", stopPan);
  };

  topologyStage.addEventListener("pointerdown", (event) => {
    const nodeEl = event.target.closest(".topology-node");
    if (nodeEl) {
      if (!isTopologyEditMode || !can("editTopology")) return;
      event.preventDefault();
      activeDragId = nodeEl.dataset.id;
      activePointerId = event.pointerId;
      nodeEl.setPointerCapture(activePointerId);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopInteraction);
      return;
    }
    event.preventDefault();
    isPanning = true;
    topologyStage.classList.add("is-panning");
    panStartX = event.clientX;
    panStartY = event.clientY;
    panOriginX = topologyView.offsetX;
    panOriginY = topologyView.offsetY;
    window.addEventListener("pointermove", handlePanMove);
    window.addEventListener("pointerup", stopPan);
  });

  topologyStage.addEventListener("pointerleave", () => {
    stopInteraction();
    stopPan();
  });

  topologyStage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const bounds = topologyStage.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const nextScale = Math.min(2.2, Math.max(0.6, topologyView.scale * zoomFactor));
    const scaleRatio = nextScale / topologyView.scale;
    topologyView.offsetX = pointerX - (pointerX - topologyView.offsetX) * scaleRatio;
    topologyView.offsetY = pointerY - (pointerY - topologyView.offsetY) * scaleRatio;
    topologyView.scale = nextScale;
    applyTopologyTransform();
  });
}

if (topologyEditToggle) {
  topologyEditToggle.addEventListener("click", () => {
    isTopologyEditMode = !isTopologyEditMode;
    if (!isTopologyEditMode) {
      isTopologyLinkMode = false;
      selectedLinkNodeId = null;
    }
    topologyEditToggle.classList.toggle("active", isTopologyEditMode);
    if (topologyLinkToggle) {
      topologyLinkToggle.classList.toggle("active", isTopologyLinkMode);
    }
    updateTopologyToggleLabels();
    renderTopology();
  });
}

if (topologyStage) {
  topologyStage.addEventListener("click", (event) => {
    if (!isTopologyEditMode || !isTopologyLinkMode || !can("editTopology")) return;
    const nodeEl = event.target.closest(".topology-node");
    if (!nodeEl) return;
    const nodeId = nodeEl.dataset.id;
    if (!selectedLinkNodeId) {
      selectedLinkNodeId = nodeId;
      renderTopology();
      return;
    }
    if (selectedLinkNodeId === nodeId) {
      selectedLinkNodeId = null;
      renderTopology();
      return;
    }
    const topologyLinks = getActiveLinks();
    topologyLinks.push({
      from: selectedLinkNodeId,
      to: nodeId,
      type: selectedLinkType,
    });
    selectedLinkNodeId = null;
    syncLinkOptions();
    renderTopology();
    saveTopologyState();
  });
}

if (topologyLinkForm) {
  topologyLinkForm.addEventListener("change", (event) => {
    if (event.target.name !== "linkType") return;
    updateSelectedLinkType(event.target.value);
  });
}

if (topologyLinkToggle) {
  topologyLinkToggle.addEventListener("click", () => {
    if (!isTopologyEditMode || !can("editTopology")) return;
    isTopologyLinkMode = !isTopologyLinkMode;
    if (!isTopologyLinkMode) {
      selectedLinkNodeId = null;
    }
    topologyLinkToggle.classList.toggle("active", isTopologyLinkMode);
    updateTopologyToggleLabels();
    renderTopology();
  });
}

if (topologyClearLinks) {
  topologyClearLinks.addEventListener("click", () => {
    if (!can("editTopology")) return;
    const topologyLinks = getActiveLinks();
    topologyLinks.length = 0;
    selectedLinkNodeId = null;
    renderTopology();
    saveTopologyState();
  });
}

if (topologyViewReset) {
  topologyViewReset.addEventListener("click", resetTopologyView);
}

if (topologySaveBtn) {
  topologySaveBtn.addEventListener("click", () => {
    if (!can("saveTopology")) return;
    saveTopologyState();
  });
}

if (topologyExportBtn) {
  topologyExportBtn.addEventListener("click", () => {
    const payload = Object.fromEntries(
      Object.entries(topologyData).map(([key, value]) => [
        key,
        { nodes: value.nodes.map(cloneNode), links: value.links.map(cloneLink) },
      ])
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `topology-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (topologyImportBtn && topologyImportFile) {
  topologyImportBtn.addEventListener("click", () => {
    if (!can("importTopology")) return;
    topologyImportFile.click();
  });
  topologyImportFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importTopologyState(parsed);
    } catch (error) {
      console.error("Failed to import topology", error);
    } finally {
      topologyImportFile.value = "";
    }
  });
}

topologyTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTopology(tab.dataset.topology);
  });
});

if (topologyAreaSelect) {
  topologyAreaSelect.addEventListener("change", (event) => {
    setActiveTopology(event.target.value);
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
}

if (themeSelect) {
  themeSelect.addEventListener("change", (event) => {
    setTheme(event.target.value);
  });
}

if (roleSelect) {
  roleSelect.addEventListener("change", (event) => {
    setRole(event.target.value);
  });
}

if (reportsPeriodSelect) {
  reportsPeriodSelect.addEventListener("change", (event) => {
    activeReportsPeriod = event.target.value;
    renderReportsTrend();
  });
}

if (eventsLiveToggle) {
  eventsLiveToggle.addEventListener("click", () => {
    setLiveEventsEnabled(!isLiveEventsEnabled);
    if (!isLiveEventsEnabled) {
      setEventsLiveStatus(translate("events.liveStatus"));
    }
  });
}

const setActiveSection = (sectionId) => {
  sections.forEach((section) => {
    section.classList.toggle("active", section.dataset.section === sectionId);
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.dataset.section;
    if (!sectionId) return;
    event.preventDefault();
    window.location.hash = sectionId;
  });
});

const knownSections = Array.from(sections).map(
  (section) => section.dataset.section
);

const resolveSectionFromHash = () => {
  const hash = window.location.hash.replace("#", "");
  if (knownSections.includes(hash)) {
    setActiveSection(hash);
    return;
  }
  setActiveSection("dashboard");
};

window.addEventListener("hashchange", resolveSectionFromHash);
resolveSectionFromHash();

loadTopologyState();

const storedLanguage = localStorage.getItem("language");
const storedTheme = localStorage.getItem("theme");
const storedRole = localStorage.getItem("role");
setTheme(storedTheme || "dark");
setLanguage(storedLanguage || "ru");
setRole(storedRole || "admin");
setEventFilter("all");
setLiveEventsEnabled(true);
setEventsLiveStatus(translate("events.liveStatus"));
renderReportsTrend();

updateTime();
setInterval(updateTime, 1000 * 30);
renderPingList();
setInterval(renderPingList, 5000);
setActiveTopology(activeTopologyKey);

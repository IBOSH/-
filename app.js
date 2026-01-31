const timeElement = document.getElementById("local-time");
const pingList = document.getElementById("ping-list");
const deviceTable = document.getElementById("device-table");
const deviceTableNodes = document.getElementById("device-table-nodes");
const deviceForm = document.getElementById("device-form");
const categoryTabs = document.querySelectorAll(".tab");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const dashboardTopology = document.getElementById("dashboard-topology");
const topologyStage = document.getElementById("topology-stage");
const topologyNodeForm = document.getElementById("topology-node-form");
const topologyLinkForm = document.getElementById("topology-link-form");
const topologyNodeList = document.getElementById("topology-node-list");
const topologyNodeCount = document.getElementById("topology-node-count");
const topologyLinkCount = document.getElementById("topology-link-count");
const topologyLinkFrom = document.getElementById("topology-link-from");
const topologyLinkTo = document.getElementById("topology-link-to");
const topologyEditToggle = document.getElementById("topology-edit-toggle");
const topologyStageLayers = new Map();

const formatTime = (date) =>
  date.toLocaleTimeString("ru-RU", {
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

const categoryLabels = {
  switch: "Коммутатор",
  phone: "IP-телефон",
  router: "Маршрутизатор",
  server: "Сервер",
};

const statusLabels = {
  online: "Онлайн",
  warning: "Предупреждение",
  offline: "Оффлайн",
};

const topologyNodes = [
  { id: "core-sw", name: "CORE-SW", type: "core", zone: "Moscow-DC1", x: 50, y: 14 },
  { id: "sw-101", name: "SW-101", type: "access", zone: "Moscow-DC1", x: 18, y: 48 },
  { id: "sw-205", name: "SW-205", type: "access", zone: "Moscow-DC1", x: 82, y: 48 },
  { id: "sw-312", name: "SW-312", type: "voice", zone: "Saint-Petersburg", x: 50, y: 70 },
  { id: "sw-509", name: "SW-509", type: "edge", zone: "Berlin POP", x: 88, y: 78 },
  { id: "sw-041", name: "SW-041", type: "access", zone: "Almaty Edge", x: 8, y: 78 },
];

const topologyLinks = [
  { from: "core-sw", to: "sw-101", type: "core" },
  { from: "core-sw", to: "sw-205", type: "core" },
  { from: "core-sw", to: "sw-312", type: "core" },
  { from: "sw-205", to: "sw-509", type: "alert" },
  { from: "sw-101", to: "sw-041", type: "access" },
];

let activeCategory = "all";
let isTopologyEditMode = false;
let selectedLinkNodeId = null;
let selectedLinkType = "core";

const buildDeviceTable = (rows, target) => {
  if (!target) return;
  target.innerHTML = `
    <div class="device-row header">
      <span>Устройство</span>
      <span>IP</span>
      <span>Категория</span>
      <span>Статус</span>
      <span>Действия</span>
    </div>
  `;

  rows.forEach((device) => {
    const statusClass = device.status;
    const row = document.createElement("div");
    row.className = "device-row";
    row.innerHTML = `
      <span>${device.name}</span>
      <span>${device.ip}</span>
      <span class="device-pill">${categoryLabels[device.category]}</span>
      <span class="device-status ${statusClass}">${statusLabels[device.status]}</span>
      <span class="device-actions">
        <button class="ghost small" type="button">Ping</button>
        <button class="ghost small" type="button">Редактировать</button>
      </span>
    `;
    target.appendChild(row);
  });
};

const renderDeviceTable = () => {
  const rows = devices.filter(
    (device) => activeCategory === "all" || device.category === activeCategory
  );
  buildDeviceTable(rows, deviceTable);
  buildDeviceTable(rows, deviceTableNodes);
};

const setActiveCategory = (category) => {
  activeCategory = category;
  categoryTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderDeviceTable();
};

const typeLabels = {
  core: "Core",
  access: "Access",
  voice: "Voice",
  edge: "Edge",
};

const typeClass = (type) => {
  if (type === "core") return "node-core";
  if (type === "voice") return "node-voice";
  if (type === "edge") return "node-edge";
  return "node-access";
};

const renderTopology = () => {
  if (!dashboardTopology || !topologyStage) return;

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
    topologyStageLayers.set(target, { linksLayer, nodesLayer });

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

  if (topologyNodeList) {
    topologyNodeList.innerHTML = "";
    topologyNodes.forEach((node) => {
      const row = document.createElement("div");
      row.className = "topology-node-row";
      row.innerHTML = `
        <span>${node.name}</span>
        <span class="node-pill">${typeLabels[node.type]}</span>
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

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveCategory(tab.dataset.category);
  });
});

if (deviceForm) {
  deviceForm.addEventListener("submit", (event) => {
    event.preventDefault();
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
  });
}

if (topologyLinkForm) {
  topologyLinkForm.addEventListener("submit", (event) => {
    event.preventDefault();
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
  });
}

if (topologyStage) {
  let activeDragId = null;
  let activePointerId = null;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const handlePointerMove = (event) => {
    if (!activeDragId) return;
    const bounds = topologyStage.getBoundingClientRect();
    const xPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((event.clientY - bounds.top) / bounds.height) * 100;
    const node = topologyNodes.find((item) => item.id === activeDragId);
    if (!node) return;
    node.x = clamp(xPercent, 6, 94);
    node.y = clamp(yPercent, 8, 92);
    updateNodePositions(activeDragId);
    rebuildLinksForStage(topologyStage);
    rebuildLinksForStage(dashboardTopology);
  };

  const stopDrag = () => {
    if (!activeDragId) return;
    activeDragId = null;
    activePointerId = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopDrag);
  };

  topologyStage.addEventListener("pointerdown", (event) => {
    const nodeEl = event.target.closest(".topology-node");
    if (!nodeEl) return;
    if (!isTopologyEditMode) return;
    event.preventDefault();
    activeDragId = nodeEl.dataset.id;
    activePointerId = event.pointerId;
    nodeEl.setPointerCapture(activePointerId);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
  });

  topologyStage.addEventListener("pointerleave", stopDrag);
}

if (topologyEditToggle) {
  topologyEditToggle.addEventListener("click", () => {
    isTopologyEditMode = !isTopologyEditMode;
    if (!isTopologyEditMode) {
      selectedLinkNodeId = null;
    }
    topologyEditToggle.classList.toggle("active", isTopologyEditMode);
    topologyEditToggle.textContent = isTopologyEditMode
      ? "Редактирование"
      : "Редактировать";
    renderTopology();
  });
}

if (topologyStage) {
  topologyStage.addEventListener("click", (event) => {
    if (!isTopologyEditMode) return;
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
    topologyLinks.push({
      from: selectedLinkNodeId,
      to: nodeId,
      type: selectedLinkType,
    });
    selectedLinkNodeId = null;
    syncLinkOptions();
    renderTopology();
  });
}

if (topologyLinkForm) {
  topologyLinkForm.addEventListener("change", (event) => {
    if (event.target.name !== "linkType") return;
    updateSelectedLinkType(event.target.value);
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

updateTime();
setInterval(updateTime, 1000 * 30);
renderPingList();
setInterval(renderPingList, 5000);
renderDeviceTable();
syncLinkOptions();
renderTopology();

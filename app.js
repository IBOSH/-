const timeElement = document.getElementById("local-time");
const pingList = document.getElementById("ping-list");
const deviceTable = document.getElementById("device-table");
const deviceForm = document.getElementById("device-form");
const categoryTabs = document.querySelectorAll(".tab");

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

let activeCategory = "all";

const renderDeviceTable = () => {
  if (!deviceTable) return;
  const rows = devices.filter(
    (device) => activeCategory === "all" || device.category === activeCategory
  );

  deviceTable.innerHTML = `
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
    deviceTable.appendChild(row);
  });
};

const setActiveCategory = (category) => {
  activeCategory = category;
  categoryTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderDeviceTable();
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

updateTime();
setInterval(updateTime, 1000 * 30);
renderPingList();
setInterval(renderPingList, 5000);
renderDeviceTable();

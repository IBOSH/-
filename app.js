const timeElement = document.getElementById("local-time");
const pingList = document.getElementById("ping-list");

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

updateTime();
setInterval(updateTime, 1000 * 30);
renderPingList();
setInterval(renderPingList, 5000);

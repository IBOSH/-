const timeElement = document.getElementById("local-time");

const formatTime = (date) =>
  date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const updateTime = () => {
  timeElement.textContent = formatTime(new Date());
};

updateTime();
setInterval(updateTime, 1000 * 30);

const cityInput = document.getElementById("city");
const temperatureDisplay = document.getElementById("temperature");
const weatherDisplay = document.getElementById("current-weather");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const deleteCompletedButton = document.getElementById("delete-completed");
const timeDisplay = document.getElementById("time");
const dateDisplay = document.getElementById("date");

// использовал свои картинки так как указанные в ТЗ не рабочие
const images = ["./img/1.avif", "./img/2.avif", "./img/3.avif", "./img/4.avif"];

function updateBackground() {
    const hour = new Date().getHours();
    const background = document.body;

    if (hour >= 0 && hour < 6) {
        background.style.backgroundImage = `url(${images[0]})`; // Исправлено
    } else if (hour >= 6 && hour < 12) {
        background.style.backgroundImage = `url(${images[1]})`; // Исправлено
    } else if (hour >= 12 && hour < 18) {
        background.style.backgroundImage = `url(${images[2]})`; // Исправлено
    } else {
        background.style.backgroundImage = `url(${images[3]})`; // Исправлено
    }
}

function updateTimeAndDate() {
    const now = new Date();
    timeDisplay.innerText = now.toLocaleTimeString();
    dateDisplay.innerText = now.toLocaleDateString("ru-RU", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
}

function fetchWeather(city) {
    const apiKey = 'edef2f08f1ba0561fa8800768cb20f3c'; // Замените на ваш API-ключ при неисправности моего
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Город не найден');
            }
            return response.json();
        })
        .then((data) => {
            // Проверяем, существуют ли элементы перед их использованием
            if (temperatureDisplay && weatherDisplay) {
                temperatureDisplay.innerText = `${data.main.temp} °C`; // Исправлено использование шаблонной строки
                const weatherDescription = data.weather[0].description;
                weatherDisplay.innerText = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
            } else {
                console.error("Элементы для отображения температуры или погоды не найдены");
            }
        })
        .catch((error) => {
            console.error("Error fetching weather:", error);
            if (weatherDisplay) {
                weatherDisplay.innerText = error.message;
            }
            if (temperatureDisplay) {
                temperatureDisplay.innerText = "";
            }
        }); // Закрывающая скобка для fetchWeather
}

function loadCity() {
    const storedCity = localStorage.getItem("city") || "Краснодар";
    cityInput.value = storedCity;
    fetchWeather(storedCity);
}

function saveCity() {
    const city = cityInput.value.trim();
    if (city) {
        localStorage.setItem("city", city);
        fetchWeather(city);
    } else {
        alert("Введите название города!");
    }
}

function addTask(event) {
    if (event.key === "Enter" && taskInput.value.trim() !== "") {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"/> ${taskInput.value} <button class="delete">Удалить</button>`; // Исправлено
        taskList.appendChild(li);
        taskInput.value = "";

        li.querySelector(".delete").onclick = () => li.remove();
        li.querySelector('input[type="checkbox"]').onclick = () => li.classList.toggle("completed");
    } else if (event.key === "Enter") {
        alert("Введите задачу!");
    }
}

function deleteCompletedTasks() {
    const completedTasks = document.querySelectorAll(".completed");
    completedTasks.forEach((task) => task.remove());
}

cityInput.addEventListener("change", saveCity);
taskInput.addEventListener("keypress", addTask);
deleteCompletedButton.addEventListener("click", deleteCompletedTasks);

updateBackground();
setInterval(updateTimeAndDate, 1000);
loadCity();
// function accepterCookies() {
//   setCookie('rgpd_consent', 'true', 365); // 1 an
//   document.getElementById('cookie-banner').style.display = 'none';
// }

// if (!getCookie('rgpd_consent')) {
//   document.getElementById('cookie-banner').style.display = 'block';
// }


let todos = [];
const addTask = document.querySelector("#todo-form");
const inputTask = document.querySelector("#todo-input");
const selectList = document.querySelector("#todo-list");


//acquisition de la tâche et ajout 
addTask.addEventListener("submit", function (event) {
    event.preventDefault();
    todos.push({ id: Date.now(), texte: inputTask.value, fait: false });
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    const span = document.createElement("span");
    checkBox.setAttribute("type", "checkbox");
    span.textContent = todos[todos.length - 1].texte;
    li.style.listStyle = "none";
    li.appendChild(checkBox);
    li.appendChild(span);
    selectList.appendChild(li);
    inputTask.value = "";
    checkBox.setAttribute("data-id", todos[todos.length - 1].id);

    checkBox.addEventListener("change", function () {
        let checkData = Number(checkBox.getAttribute("data-id"));
        for (let ido of todos) {
            if (ido.id === checkData) {
                ido.fait = checkBox.checked;
                if (checkBox.checked) {
                    const span = checkBox.nextSibling;
                    span.style.textDecoration = "line-through";
                } else {
                    span.style.textDecoration = "none";
                }
            }
        }
    });
});

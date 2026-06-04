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

const filterBtn = document.querySelectorAll(".filter-btn");
console.log(filterBtn);


//acquisition de la tâche et ajout 
addTask.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!inputTask.value.trim()) return;
    todos.push({ id: Date.now(), texte: inputTask.value, fait: false });
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    const span = document.createElement("span");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("checkbox");
    span.textContent = todos[todos.length - 1].texte;
    li.style.listStyle = "none";
    // selectList.classList.add("todo-list");
    li.appendChild(checkBox);
    li.appendChild(span);
    selectList.appendChild(li);
    inputTask.value = "";

    //checkbox
    checkBox.setAttribute("data-id", todos[todos.length - 1].id);
    checkBox.addEventListener("change", function () {
        let checkData = Number(checkBox.getAttribute("data-id"));
        for (let ido of todos) {
            if (ido.id === checkData) {
                ido.fait = checkBox.checked;
                const span = checkBox.nextSibling;
                if (checkBox.checked) {
                    span.style.textDecoration = "line-through";
                } else {
                    span.style.textDecoration = "none";
                }
            }
        }
    });

    //bouton delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("deleteBtn");
    li.appendChild(deleteBtn);
    deleteBtn.setAttribute("data-id", todos[todos.length - 1].id);
    deleteBtn.addEventListener("click", function () {
        if (!checkBox.checked) return;
        let deleteData = Number(deleteBtn.getAttribute("data-id"));
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === deleteData) {
                todos.splice(i, 1);   // ✔️ suppression dans le tableau
                break;
            }
        }
        li.remove();
    });


});


for (let btn of filterBtn) {
    btn.addEventListener("click", function () {
        let dataFilter = btn.getAttribute("data-filter");
        console.log(dataFilter);
        for (let b of filtreBtn) {
            b.classList.remove("active");
        }
        btn.classList.add("active");

    });
};

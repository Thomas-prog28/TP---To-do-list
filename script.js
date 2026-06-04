let todos = [];
const addTask = document.querySelector("#todo-form");
const inputTask = document.querySelector("#todo-input");
const selectList = document.querySelector("#todo-list");
const addBtn = document.querySelector(".todo_btn");
const filtreBtn = document.querySelectorAll(".disabledBtn");

//on récupère une collection de bouton filtre
const filterBtn = document.querySelectorAll(".filter-btn");
console.log(filterBtn);

window.addEventListener("DOMContentLoaded", () => {
    if (document.cookie.includes("rgpd_consent=")) {
        document.getElementById('cookie-banner').style.display = 'none';
    } else {
        document.getElementById('cookie-banner').style.display = 'block';
        inputTask.classList.add("disabled");
        addBtn.classList.add("disabled");
        filtreBtn.classList.add("disabled");
        let cookieBtn = document.getElementById('cookieBtn');
        cookieBtn.addEventListener("click", function () {
            document.cookie = "rgpd_consent=true; max-age=2592000; path=/";
            document.getElementById('cookie-banner').style.display = 'none';
            inputTask.classList.remove("disabled");
            addBtn.classList.remove("disabled");
            filtreBtn.classList.remove("disabled");
        });
    }
});

//acquisition de la tâche et ajout 
addTask.addEventListener("submit", function (event) {
    if (!document.cookie.includes("rgpd_consent=")) {
        event.preventDefault();
        return;
    }
    if (!inputTask.value.trim()) return;
    todos.push({ id: Date.now(), texte: inputTask.value, fait: false });
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    const span = document.createElement("span");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("checkbox");
    span.textContent = todos[todos.length - 1].texte;
    li.style.listStyle = "none";
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

//on parcours la collection de "bouton" du filtrage
for (let btn of filterBtn) {
    //on écoute sur quel bouton on a cliqué
    btn.addEventListener("click", function () {

        for (let b of filterBtn) {
            b.classList.remove("active");
        }
        btn.classList.add("active");

        let tableLi = document.querySelectorAll("li");
        console.log(tableLi);

        for (let tab of tableLi) {
            console.log(tab);
            let dataFilter = btn.getAttribute("data-filter");
            let checkbox = tab.querySelector("input[type='checkbox']");
            let isDone = checkbox.checked;

            if (dataFilter === "all") {
                tab.style.display = "flex";
            }
            else if (dataFilter === "todo") {
                if (isDone === true) {
                    tab.style.display = "none";

                } else {
                    tab.style.display = "flex";
                }
            }
            else if (dataFilter === "done") {
                if (isDone === true) {
                    tab.style.display = "flex";
                } else {
                    tab.style.display = "none";
                }
            }

        }

        //retirer le fond gris dans la conditions ou toutes les tâches sont cochés et le filtre sur "à faire"
        let visibleCount = 0;

        for (let tab of tableLi) {
            if (tab.style.display !== "none") {
                visibleCount++;
            }
        }

        if (visibleCount === 0) {
            selectList.classList.add("empty");
        } else {
            selectList.classList.remove("empty");
        }

    });
};




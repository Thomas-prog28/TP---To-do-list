let todos = [];
const addTask = document.querySelector("#todo-form");
const inputTask = document.querySelector("#todo-input");
const selectList = document.querySelector("#todo-list");
const addBtn = document.querySelector(".todo_btn");


//on récupère une collection de bouton filtre
const filterBtn = document.querySelectorAll(".filter-btn");
console.log(filterBtn);

window.addEventListener("DOMContentLoaded", () => {
    if (document.cookie.split("; ").includes("rgpd_consent=true")) {
        document.getElementById('cookie-banner').style.display = 'none';
    } else {
        document.getElementById('cookie-banner').style.display = 'block';
        inputTask.classList.add("disabled-btn");
        addBtn.classList.add("disabled-btn");
        for (let fil of filterBtn) {
            fil.classList.add("disabled-btn");
        }
        let cookieBtn = document.getElementById('cookieBtn');
        cookieBtn.addEventListener("click", function () {
            document.cookie = "rgpd_consent=true; max-age=2592000; path=/";
            document.getElementById('cookie-banner').style.display = 'none';
            inputTask.classList.remove("disabled-btn");
            addBtn.classList.remove("disabled-btn");
            for (let fil of filterBtn) {
                fil.classList.remove("disabled-btn");
            }
        });
    }
    loadTodos();
    initFilters();
});

//acquisition de la tâche et ajout 
addTask.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!document.cookie.includes("rgpd_consent=")) return;
    if (!inputTask.value.trim()) return;
    addTodo(inputTask.value.trim());
    inputTask.value = "";
});

//créer les éléments bouton de check, tâches, et deleteBtn
function createTaskElement(todo) {
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("checkbox");
    checkBox.checked = todo.fait;
    checkBox.dataset.id = todo.id;

    const span = document.createElement("span");
    span.textContent = todo.texte;
    if (todo.fait) {
        span.style.textDecoration = "line-through";
    } else {
        span.style.textDecoration = "none";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.dataset.id = todo.id;

    li.style.listStyle = "none";
    li.appendChild(checkBox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return { li, checkBox, deleteBtn };
}

//mets à jour l'état d'une tâche : coché/pas coché, 
function toggleTodo(id, checked) {
    for (let todo of todos) {
        if (todo.id === id) {
            todo.fait = checked;
            saveTodos();
            return todo.fait;
        }
    }
}

//réalise la suppression des tâches
function deleteTodo(id, li) {
    let index = -1;
    let i = 0;
    for (let todo of todos) {
        if (todo.id === id) {
            index = i;
            break;
        }
        i++;
    }
    if (index !== -1) {
        todos.splice(index, 1);
    }
    li.remove();
    saveTodos();
}

function attachEvents(checkBox, deleteBtn, li) {
    // Quand on coche / décoche
    checkBox.addEventListener("change", () => {
        const id = Number(checkBox.dataset.id);

        // Mise à jour de la donnée
        const fait = toggleTodo(id, checkBox.checked);

        // Mise à jour du style visuel
        const span = checkBox.nextSibling;
        if (checkBox.checked) {
            span.style.textDecoration = "line-through";
        }
        else {
            span.style.textDecoration = "none";
        }
    });
    deleteBtn.addEventListener("click", () => {
        const id = Number(deleteBtn.dataset.id);
        if (!checkBox.checked) return;
        deleteTodo(id, li);
    });
}

function addTodo(text) {
    // 1. Créer l’objet tâche
    const todo = {
        id: Date.now(),
        texte: text,
        fait: false
    };

    // 2. L’ajouter au tableau
    todos.push(todo);

    // 3. Créer les éléments DOM
    const { li, checkBox, deleteBtn } = createTaskElement(todo);

    // 4. Brancher les événements
    attachEvents(checkBox, deleteBtn, li);

    // 5. Ajouter dans la liste
    selectList.appendChild(li);

    // 6. Sauvegarder
    saveTodos();
}

function loadTodos() {
    const data = localStorage.getItem("tache");
    if (!data) return;

    todos = JSON.parse(data);

    for (let todo of todos) {
        // 1. Créer les éléments DOM
        const { li, checkBox, deleteBtn } = createTaskElement(todo);

        // 2. Brancher les événements
        attachEvents(checkBox, deleteBtn, li);

        // 3. Ajouter dans la liste
        selectList.appendChild(li);
    }
}

// on parcours la collection de "bouton" du filtrage
function initFilters() {
    for (let btn of filterBtn) {

        btn.addEventListener("click", function () {

            // Active le bouton cliqué
            for (let b of filterBtn) b.classList.remove("active");
            btn.classList.add("active");

            const dataFilter = btn.getAttribute("data-filter");
            const tableLi = document.querySelectorAll("li");

            // Filtrage
            for (let tab of tableLi) {
                const checkbox = tab.querySelector("input[type='checkbox']");
                const isDone = checkbox.checked;

                if (dataFilter === "all") {
                    tab.style.display = "flex";
                }
                else if (dataFilter === "todo") {
                    if (isDone) {
                        tab.style.display = "none";
                    } else {
                        tab.style.display = "flex";
                    }
                } else if (dataFilter === "done") {
                    if (isDone) {
                        tab.style.display = "flex";
                    } else {
                        tab.style.display = "none";
                    }
                }
            }

            // Gestion du fond gris si aucune tâche visible
            let visibleCount = 0;
            for (let tab of tableLi) {
                if (tab.style.display !== "none") visibleCount++;
            }

            if (visibleCount === 0) {
                selectList.classList.add("empty");
            } else {
                selectList.classList.remove("empty");
            }
        });
    }
}

//prends l'état actuel du tableau TODOS contenant l'ID de la checkbox, le span et le delBtn 
//et l'enregistre en localStorage
function saveTodos() {
    localStorage.setItem("tache", JSON.stringify(todos));
}














































// CODE FONCTIONNEL OK
// let todos = [];
// const addTask = document.querySelector("#todo-form");
// const inputTask = document.querySelector("#todo-input");
// const selectList = document.querySelector("#todo-list");
// const addBtn = document.querySelector(".todo_btn");

// //on récupère une collection de bouton filtre
// const filterBtn = document.querySelectorAll(".filter-btn");
// console.log(filterBtn);

// window.addEventListener("DOMContentLoaded", () => {
//     if (document.cookie.split("; ").includes("rgpd_consent=true")) {
//         document.getElementById('cookie-banner').style.display = 'none';
//     } else {
//         document.getElementById('cookie-banner').style.display = 'block';
//         inputTask.classList.add("disabled-btn");
//         addBtn.classList.add("disabled-btn");
//         for (let fil of filterBtn) {
//             fil.classList.add("disabled-btn");
//         }
//         let cookieBtn = document.getElementById('cookieBtn');
//         cookieBtn.addEventListener("click", function () {
//             document.cookie = "rgpd_consent=true; max-age=2592000; path=/";
//             document.getElementById('cookie-banner').style.display = 'none';
//             inputTask.classList.remove("disabled-btn");
//             addBtn.classList.remove("disabled-btn");
//             for (let fil of filterBtn) {
//                 fil.classList.remove("disabled-btn");
//             }
//         });
//     }

//     let tache = localStorage.getItem("tache");
//     if (tache) {
//         todos = JSON.parse(tache);
//         for (let todo of todos) {
//             const li = document.createElement("li");

//             const checkBox = document.createElement("input");
//             checkBox.setAttribute("type", "checkbox");
//             checkBox.classList.add("checkbox");
//             checkBox.checked = todo.fait;
//             checkBox.setAttribute("data-id", todo.id);

//             const span = document.createElement("span");
//             span.textContent = todo.texte;
//             if (todo.fait) {
//                 span.style.textDecoration = "line-through";
//             }

//             li.appendChild(checkBox);
//             li.appendChild(span);

//             const deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "X";
//             deleteBtn.classList.add("deleteBtn");
//             deleteBtn.setAttribute("data-id", todo.id);
//             li.appendChild(deleteBtn);

//             selectList.appendChild(li);

//             checkBox.addEventListener("change", function () {
//                 let checkData = Number(checkBox.getAttribute("data-id"));
//                 for (let ido of todos) {
//                     if (ido.id === checkData) {
//                         ido.fait = checkBox.checked;

//                         const span = checkBox.nextSibling;
//                         if (checkBox.checked) {
//                             span.style.textDecoration = "line-through";
//                         } else {
//                             span.style.textDecoration = "none";
//                         }
//                     }
//                 }

//                 localStorage.setItem("tache", JSON.stringify(todos));
//             });

//             deleteBtn.addEventListener("click", function () {
//                 if (!checkBox.checked) return;

//                 let deleteData = Number(deleteBtn.getAttribute("data-id"));
//                 for (let i = 0; i < todos.length; i++) {
//                     if (todos[i].id === deleteData) {
//                         todos.splice(i, 1);
//                         break;
//                     }
//                 }

//                 localStorage.setItem("tache", JSON.stringify(todos));

//                 li.remove();
//             });

//         }
//     }
// });




// //acquisition de la tâche et ajout
// addTask.addEventListener("submit", function (event) {
//     event.preventDefault();
//     if (!document.cookie.includes("rgpd_consent=")) return;
//     if (!inputTask.value.trim()) return;
//     todos.push({ id: Date.now(), texte: inputTask.value, fait: false });
//     const li = document.createElement("li");
//     const checkBox = document.createElement("input");
//     const span = document.createElement("span");
//     checkBox.setAttribute("type", "checkbox");
//     checkBox.classList.add("checkbox");
//     span.textContent = todos[todos.length -1].texte;
//     li.style.listStyle = "none";
//     li.appendChild(checkBox);
//     li.appendChild(span);
//     selectList.appendChild(li);
//     inputTask.value = "";

//     //checkbox
//     checkBox.setAttribute("data-id", todos[todos.length -1].id);
//     checkBox.addEventListener("change", function () {
//         let checkData = Number(checkBox.getAttribute("data-id"));
//         for (let ido of todos) {
//             if (ido.id === checkData) {
//                 ido.fait = checkBox.checked;
//                 let todosJSON = JSON.stringify(todos);
//                 localStorage.setItem("tache", todosJSON);
//                 const span = checkBox.nextSibling;
//                 if (checkBox.checked) {
//                     span.style.textDecoration = "line-through";
//                 } else {
//                     span.style.textDecoration = "none";
//                 }
//             }
//         }
//     });

//     //bouton delete
//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "X";
//     deleteBtn.classList.add("deleteBtn");
//     console.log("on passe ici");
//     li.appendChild(deleteBtn);
//     deleteBtn.setAttribute("data-id", todos[todos.length -1].id);
//     deleteBtn.addEventListener("click", function () {
//         if (!checkBox.checked) return;
//         let deleteData = Number(deleteBtn.getAttribute("data-id"));
//         for (let i = 0; i < todos.length; i++) {
//             if (todos[i].id === deleteData) {
//                 todos.splice(i, 1);
//                 let todosJSON = JSON.stringify(todos);
//                 localStorage.setItem("tache", todosJSON);
//                 break;
//             }
//         }
//         li.remove();
//     });
//     let todosJSON = JSON.stringify(todos);
//     localStorage.setItem("tache", todosJSON);
// });

// // on parcours la collection de "bouton" du filtrage
// for (let btn of filterBtn) {
//     //on écoute sur quel bouton on a cliqué
//     btn.addEventListener("click", function () {

//         for (let b of filterBtn) {
//             b.classList.remove("active");
//         }
//         btn.classList.add("active");

//         let tableLi = document.querySelectorAll("li");
//         console.log(tableLi);

//         for (let tab of tableLi) {
//             console.log(tab);
//             let dataFilter = btn.getAttribute("data-filter");
//             let checkbox = tab.querySelector("input[type='checkbox']");
//             let isDone = checkbox.checked;

//             if (dataFilter === "all") {
//                 tab.style.display = "flex";
//             }
//             else if (dataFilter === "todo") {
//                 if (isDone === true) {
//                     tab.style.display = "none";

//                 } else {
//                     tab.style.display = "flex";
//                 }
//             }
//             else if (dataFilter === "done") {
//                 if (isDone === true) {
//                     tab.style.display = "flex";
//                 } else {
//                     tab.style.display = "none";
//                 }
//             }

//         }

//         //retirer le fond gris dans la conditions ou toutes les tâches sont cochés et le filtre sur "à faire"
//         let visibleCount = 0;

//         for (let tab of tableLi) {
//             if (tab.style.display !== "none") {
//                 visibleCount++;
//             }
//         }

//         if (visibleCount === 0) {
//             selectList.classList.add("empty");
//         } else {
//             selectList.classList.remove("empty");
//         }

//     });
// };
//Déclaration d'un tableau vide qui contient toutes les tâches sous forme 
// d'objet objet{id, texte, fait}
let todos = [];

//récupération du formulaire d'ajout de tâche
const addTask = document.querySelector(".form__todo");
//récupération du champ de saisie de tâche
const inputTask = document.querySelector(".form__input");
//récupération du bouton d'ajout de la tâche (submit)
const addBtn = document.querySelector(".form__btn");
//récupération de la liste UL qui contiendra les <li> des tâches
const selectList = document.querySelector(".filterarea__list");
//on récupère tous les boutons de filtre (Tous/ A faire / Faîtes)
const filterBtn = document.querySelectorAll(".filter__btn");
// console.log(filterBtn);

//On écoute le moment ou le DOM est complètement chargé
window.addEventListener("DOMContentLoaded", () => {
    //Si le cookie RGPD est déja crée/validé
    if (document.cookie.split("; ").includes("rgpd_consent=true")) {
        //on masque la bannière
        document.getElementById('cookie__banner').style.display = 'none';
    } else {
        //sinon on affiche la bannière
        document.getElementById('cookie__banner').style.display = 'block';
        //et on désactive : le champ de saisie tant que l'utilisateur n'a pas accepté
        inputTask.classList.add("disabled-btn");
        //on désactive le bouton d'ajout de tâche
        addBtn.classList.add("disabled-btn");
        //on désactive la liste qui contient les Li
        selectList.classList.add("disabled-btn");
        //on désactive tous les boutons filtres
        for (let fil of filterBtn) {
            fil.classList.add("disabled-btn");
        }
        //on récupère le bouton "j'accepte" du bouton cookie
        let cookieBtn = document.getElementById('cookie__Btn');
        //on écoute à quel moment se produit un click sur ce bouton
        cookieBtn.addEventListener("click", function () {
            //lorsqu'il y a le clique, on crée le cookie avec expiration à 30J
            document.cookie = "rgpd_consent=true; max-age=2592000; path=/";
            //puis on récupère le bandeau cookie et on le désactive
            document.getElementById('cookie__banner').style.display = 'none';
            //on réactive le champ de saisie
            inputTask.classList.remove("disabled-btn");
            //on réactive le bouton de tâche
            addBtn.classList.remove("disabled-btn");
            //on réactive la liste qui contient les Li
            selectList.classList.remove("disabled-btn");
            //on réactive les boutons filtres
            for (let fil of filterBtn) {
                fil.classList.remove("disabled-btn");
            }
        });
    }

    //on recharge les tâches depuis le localStorage
    loadTodos();

    //on initialise les filtres 
    initFilters();
});

//Gestion de la soumission du formulaire d'ajout de tâche
//on écoute quand on est-ce qu'on clique sur le bouton "ajotuer" (submit)
addTask.addEventListener("submit", function (event) {
    //empêche le rechargement de la page
    event.preventDefault();
    //si l'utilisateur n'a pas accepté le cookie, on ne fait rien
    if (!document.cookie.includes("rgpd_consent=")) return;
    //si le champ est vide ou ne contient que des espaces, on ne fait rien
    if (!inputTask.value.trim()) return;
    //on lance la fonctino d'ajout de la tâche dans la liste avec le texte nettoyé
    //par .trim()
    addTodo(inputTask.value.trim());
    //on vide le champ de saisie
    inputTask.value = "";
});

//Gestion de la création des éléments HTML checkbox, tâches(span) et deleteBtn
function createTaskElement(todo) {
    //on crée l'élément Li qui contiendra la tâche
    const li = document.createElement("li");
    //on crée l'élément input qui représente la checkbox
    const checkBox = document.createElement("input");
    //on spécifie à l'input qu'il est une checkbox avec l'attribut type
    checkBox.setAttribute("type", "checkbox");
    //on stylise l'élément checkbox
    checkBox.classList.add("checkbox");
    //on applique l'état par défaut "false" qui représente que la box n'est pas check
    checkBox.checked = todo.fait;
    //stockage de l'id de la tâche dans data-id
    checkBox.dataset.id = todo.id;
    //on crée l'élément span qui contiendra le texte de la tâche
    const span = document.createElement("span");
    //on applique au contenu du span la tâche qui a été écrit dans l'input
    span.textContent = todo.texte;
    //si la checkbox est checké 
    if (todo.fait) {
        //on raie la tâche
        span.style.textDecoration = "line-through";
    } else {
        //sinon on ne raie pas la tâche
        span.style.textDecoration = "none";
    }
    //on crée l'élément button qui représente le bouton supprimer
    const deleteBtn = document.createElement("button");
    //label du bouton de suppression
    deleteBtn.textContent = "X";
    //on applique un style au bouton suppression
    deleteBtn.classList.add("deleteBtn");
    //stockage de l'id de la tâche dans data-id
    deleteBtn.dataset.id = todo.id;
    //on enlève les puces par défaut sur le <li>
    li.style.listStyle = "none";
    //on assemble les éléments dans le <li>
    li.appendChild(checkBox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    //on retourne les éléments pour pouvoir leur attacher des events
    return { li, checkBox, deleteBtn };
}

//Gestion de l'état d'une tâche : coché/pas coché dans le tableau en fonction 
//des paramètres d'identification id et checked
function toggleTodo(id, checked) {
    //on parcourt toutes les tâches dans le tableau todos
    for (let todo of todos) {
        //quand on trouve celle qui a le bon id
        if (todo.id === id) {
            //on met à jour son état
            todo.fait = checked;
            //on sauvegarde le tableau mis à jour avec la fonction saveTodos() 
            //dans le localStorage;
            saveTodos();
            //on retourne le nouvel état (utile pour le style)
            return todo.fait;
        }
    }
}

//Gestion de la suppression d'une tâche dans le tableau et dans le DOM
//en fonction des paramètres d'identification id et d'une tâche Li
function deleteTodo(id, li) {
    //index de la tâche à supprimer
    let index = -1;
    //compteur pour parcourir le tableau
    let i = 0;
    //on cherche l'index de la tâche à partir de son id
    for (let todo of todos) {
        if (todo.id === id) {
            index = i;
            //on sort dès qu'on a trouvé
            break;
        }
        i++;
    }
    //si on a trouvé la tâche
    if (index !== -1) {
        //on la retire du tableau
        todos.splice(index, 1);
    }
    //on retire le <li> du DOM
    li.remove();
    //on sauvegarde cette modification dans le tableau TODOS
    saveTodos();
}

//Gestion des événements sur le bouton de checkbox et le bouton supprimer
//en fonction des <li>, du bouton de checkbox et du bouton de Delete
function attachEvents(checkBox, deleteBtn, li) {
    //On écoute quand on coche ou décoche la checkbox
    checkBox.addEventListener("change", () => {
        //On récupère l'id de la tâche dans la variable id
        const id = Number(checkBox.dataset.id);
        //On met à jour la donnée (coché ou pas) dans le tableau todos
        const fait = toggleTodo(id, checkBox.checked);
        // Mise à jour du style visuel
        const span = checkBox.nextSibling;
        if (checkBox.checked) {
            //si checkbox coché, on barre le span
            span.style.textDecoration = "line-through";
        }
        else { //si checkbox non coché, on ne barre pas le span
            span.style.textDecoration = "none";
        }
    });
    //On écoute quand on appui sur le bouton supprimer
    deleteBtn.addEventListener("click", () => {
        //on récupère l'id de la tâche
        const id = Number(deleteBtn.dataset.id);
        //on ne supprime que si la tâche est cochée
        if (!checkBox.checked) return;
        //comme checked est coché, on supprime la tâche (tableau + DOM)
        deleteTodo(id, li);
    });
}

//Gestion de l'ajout d'une nouvelle tâche à partir du text dans l'input
function addTodo(text) {
    //Création de l’objet tâche en fonction du texte entré dans l'input
    const todo = {
        //id unique basé sur le timestamp
        id: Date.now(),
        //texte saisie par l'utilisateur
        texte: text,
        //par défaut, tâche non faîte (non coché)
        fait: false
    };
    //ajout de la tâche dans le tableau
    todos.push(todo);
    //création des éléments DOM associés
    const { li, checkBox, deleteBtn } = createTaskElement(todo);
    //on attache les événements sur ces éléments
    attachEvents(checkBox, deleteBtn, li);
    //on ajoute le <li> dans la liste Ul
    selectList.appendChild(li);
    //on sauvegarde le tableau mis à jour
    saveTodos();
}

//Gestion de la recharge des tâches depuis le localStorage 
//et les affiche au rechargement de la page
function loadTodos() {
    //on récupère la chaîne JSON stockée dans le localStorage dans l'objet "tache"
    const data = localStorage.getItem("tache");
    //si rien dans le localStorage, on sort de la fonction
    if (!data) return;
    //si non, on reconstruit le tableau à partir de la chaîne JSON
    todos = JSON.parse(data);
    //pour chaque tâche, on reconstruit le DOM
    for (let todo of todos) {
        //création des éléments DOM
        const { li, checkBox, deleteBtn } = createTaskElement(todo);
        //on attache les événements
        attachEvents(checkBox, deleteBtn, li);
        //ajout des <li> à la liste <ul>
        selectList.appendChild(li);
    }
}

//Gestion des filtres (Tous/A faire/Fait)
function initFilters() {
    //on parcourt chaque bouton de filtre
    for (let btn of filterBtn) {
        //on écoute le clique sur chaque bouton
        btn.addEventListener("click", function () {

            //On retire la classe active de tous les boutons
            for (let b of filterBtn) {
                b.classList.remove("active");
            }
            //on met la classe active sur le bouton sur lequel on a cliqué
            btn.classList.add("active");
            //on récupère le type de filtre sur chacun des boutons (all / todo / done)
            const dataFilter = btn.getAttribute("data-filter");
            //on récupère toutes les tâches affichés (tous les <li>)
            const tableLi = document.querySelectorAll("li");
            //on applique le filtrage sur chaque tâche
            for (let tab of tableLi) {
                //on récupère la checkbox de la tâche
                const checkbox = tab.querySelector("input[type='checkbox']");
                //true si la tâche est faîtes
                const isDone = checkbox.checked;
                //Filtre "toutes"
                if (dataFilter === "all") {
                    tab.style.display = "flex";
                } //Filtre "à faire"
                else if (dataFilter === "todo") {
                    if (isDone) {
                        tab.style.display = "none";
                    } else {
                        tab.style.display = "flex";
                    }
                } //Filtre "terminées"
                else if (dataFilter === "done") {
                    if (isDone) {
                        tab.style.display = "flex";
                    } else {
                        tab.style.display = "none";
                    }
                }
            }

            // Gestion du fond gris si aucune tâche visible
            //on compte combien de tâches restenet visibles
            let visibleCount = 0;
            for (let tab of tableLi) {
                if (tab.style.display !== "none") visibleCount++;
            }
            //si aucune tâche visible, on ajoute une classe pour style "liste vide"
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
    //conversion du tableau en JSON et on le stocke sous la clé "tache"
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
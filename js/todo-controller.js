'use strict'
var numbersForImp = ['1', '2', '3']

function onInit() {
    renderTodos()
}

function onRemoveTodo(ev, todoId) {
    ev.stopPropagation()
    console.log('Removing Todo', todoId);
    var isUserSure = confirm('are you sure you want to delete this To Do?')
    if (!isUserSure) return
    removeTodo(todoId)
    renderTodos()
}

function renderTodos() {
    const todos = getTodosForDisplay()
    if (!todos.length) {
        var msg
        var filter = getFilter()
        if (filter === 'ALL') msg = 'No todos'
        else if (filter === 'DONE') msg = 'No Done Todos'
        else msg = 'No Active Todos'
        var strHTMLs = `<div>${msg}</div>`
    } else {
        var strHTMLs = todos.map(todo =>
            `<li class="${(todo.isDone) ? 'done' : ''}" onclick="onToggleTodo('${todo.id}')">
           ${todo.txt}
           <span class="time-stamp">${renderTime(todo.createdAt)}</span>
           <span class="importance">${todo.importance}</span>
            <button onclick="onRemoveTodo(event, '${todo.id}')">x</button>
        </li>`)
        strHTMLs = strHTMLs.join('')
    }

    document.querySelector('.todo-list').innerHTML = strHTMLs

    document.querySelector('.todos-total-count').innerText = getTodosCount()
    document.querySelector('.todos-active-count').innerText = getActiveTodosCount()
}

function renderTime(time) {
    var dateStructure = new Date(time)
    return dateStructure.toString().slice(16, 24)
}

function onToggleTodo(todoId) {
    console.log('Toggling', todoId);
    toggleTodo(todoId)

    renderTodos()
}

function onAddTodo() {
    const elTxt = document.querySelector('input[name=todoTxt]');
    const elImp = document.querySelector('input[name=todoImp]');
    const txt = elTxt.value
    const imp = elImp.value
    elTxt.value = ''
    elImp.value = ''
    if (!txt || !numbersForImp.includes(imp)) return
    addTodo(txt, imp)
    renderTodos()
}

function onSetFilter(filterBy) {
    console.log('Filtering By:', filterBy)

    setFilter(filterBy)
    renderTodos()
}

function onSetSort(sortBy, category) {
    console.log('Sorting By:', sortBy, 'in cat:', category)
    setSort(sortBy, category)
    renderTodos()
}
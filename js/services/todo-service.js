'use strict'

const STORAGE_KEY = 'todosDB'
var gTodos
var gFilterBy = 'ALL'
var gSortBy = {}
_createTodos()

function getTodosForDisplay() {
    var todos = [];
    console.log('todos',todos);
    if (gFilterBy === 'ALL') todos = gTodos
    else {
        todos = gTodos.filter(todo =>
            todo.isDone && gFilterBy === 'DONE' ||
            !todo.isDone && gFilterBy === 'ACTIVE'
        )
    }
    console.log('todos', todos);
    if (!gSortBy || !todos.length) return todos
    switch (gSortBy.category) {
        case 'AB':
            todos = sortByAB(todos, gSortBy.sortBy === 'A-Z')
        case 'TIME':
            todos = sortByTime(todos, gSortBy.sortBy === 'RECENT')
        case 'IMP':
            todos = sortByImp(todos, gSortBy.sortBy === 'IMPORTANT')
    }
    return todos
}

function sortByAB(todos, isAB) {
    return todos.sort(function (a, b) {
        var nameA = a.txt.toUpperCase(); // ignore upper and lowercase
        var nameB = b.txt.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB && isAB || nameA > nameB && !isAB) return -1
        if (nameA > nameB && isAB || nameA < nameB && !isAB) return 1
        // names must be equal
        return 0;
    })
}

function sortByTime(todos, isRec) {
    return todos.sort(function (a, b) {
        return isRec ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    })
}

function sortByImp(todos, isImp) {
    return todos.sort(function (a, b) {
        return isImp ? b.importance - a.importance : a.importance - b.importance
    })
}

function removeTodo(todoId) {
    const idx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos.splice(idx, 1)
    _saveTodosToStorage()
}

function toggleTodo(todoId) {
    var todo = gTodos.find(todo => todo.id === todoId)
    todo.isDone = !todo.isDone
    _saveTodosToStorage()
}

function addTodo(txt, imp) {
    const todo = _createTodo(txt, imp)
    gTodos.unshift(todo)
    _saveTodosToStorage()
}

function getTodosCount() {
    return gTodos.length
}

function getActiveTodosCount() {
    const activeTodos = gTodos.filter(todo => !todo.isDone)
    return activeTodos.length
}

function setFilter(filterBy) {
    gFilterBy = filterBy
}

function getFilter() {
    return gFilterBy
}

function _createTodos() {
    gTodos = loadFromStorage(STORAGE_KEY)
    if (!gTodos || !gTodos.length) {
        gTodos = [
            _createTodo('Learn HTML', 1),
            _createTodo('Study CSS', 2),
            _createTodo('Master Javascript', 3),
        ]
        _saveTodosToStorage()
    }
}

function _createTodo(txt, imp) {
    const todo = {
        id: _makeId(),
        txt: txt,
        isDone: false,
        createdAt: Date.now(),
        importance: imp
    }
    return todo
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _saveTodosToStorage() {
    saveToStorage(STORAGE_KEY, gTodos)
}

function setSort(sortBy, category) {
    gSortBy.sortBy = sortBy
    gSortBy.category = category
}


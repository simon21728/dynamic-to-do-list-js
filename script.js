// script.js

// All code runs after DOMContentLoaded to ensure elements are available
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements (required names)
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array. Each task: { id: string, text: string }
    let tasks = [];

    // Utility: load tasks array from localStorage
    function loadTasksFromStorage() {
        const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = Array.isArray(stored) ? stored : [];
    }

    // Utility: save current tasks array to localStorage
    function saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create and append a task <li> element to the DOM
    function renderTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id; // attach id for removal lookup

        // create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';

        // When clicked, remove this task element and update storage
        removeBtn.addEventListener('click', () => {
            removeTask(task.id);
        });

        // append remove button to li and li to list
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    // Public: addTask. If taskText is null, it reads from taskInput (as required).
    // save = true controls whether to persist to localStorage (used to avoid double-saving when loading).
    function addTask(taskText = null, save = true) {
        // If no task text supplied, read from input element
        if (taskText === null) {
            taskText = taskInput.value.trim(); // per instructions, trim input
        } else {
            taskText = String(taskText).trim();
        }

        // Validate non-empty
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        // create unique id for the task
        const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);

        const taskObj = { id, text: taskText };

        // update in-memory array and optionally save
        tasks.push(taskObj);
        if (save) saveTasksToStorage();

        // render in DOM
        renderTaskElement(taskObj);

        // clear input field if this call came from the input/button (i.e., taskText was null originally)
        if (taskInput && taskInput.value) {
            taskInput.value = '';
        }
    }

    // Remove task by id (updates both DOM and localStorage)
    function removeTask(id) {
        // Remove from in-memory array
        tasks = tasks.filter(t => t.id !== id);
        saveTasksToStorage();

        // Remove corresponding <li> element from DOM
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        if (li) li.remove();
    }

    // Load tasks from storage and render them (doesn't double-save)
    function loadTasks() {
        loadTasksFromStorage();
        taskList.innerHTML = ''; // clear existing DOM list
        tasks.forEach(t => renderTaskElement(t));
    }

    // Attach event listeners (button click + Enter key)
    addButton.addEventListener('click', () => addTask()); // calls addTask() which reads input
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initialize app by loading saved tasks
    loadTasks();
});

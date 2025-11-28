document.addEventListener('DOMContentLoaded', () => {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage on page load
    loadTasks();

    // Function to add a task
    function addTask(taskText = null, save = true) {

        // If taskText not provided, read from input
        if (taskText === null) {
            taskText = taskInput.value.trim();
        }

        // Validate
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        // --- Create <li> ---
        const li = document.createElement('li');
        li.textContent = taskText;

        // --- Create remove button ---
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.classList.add('remove-btn');   // REQUIRED

        // Remove functionality
        removeBtn.onclick = function () {
            taskList.removeChild(li);    // remove from DOM
            removeFromStorage(taskText); // remove from localStorage
        };

        // Add button to li, then li to ul
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // Save to localStorage
        if (save) {
            saveToStorage(taskText);
        }

        // Clear input field
        taskInput.value = "";
    }

    // Save a task (simple list of strings)
    function saveToStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Remove a task from localStorage
    function removeFromStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks on startup
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(task => addTask(task, false));
    }

    // Event listeners
    addButton.addEventListener('click', () => addTask());

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

});

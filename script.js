const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', loadTasks);

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text !== '') {
    addTask(text);
    taskInput.value = '';
    saveTasks();
  }
});

function addTask(text, completed = false, timestamp = new Date().toLocaleString()) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const taskText = document.createElement('div');
  taskText.className = 'task-text';
  taskText.textContent = text;

  const taskTime = document.createElement('div');
  taskTime.className = 'task-time';
  taskTime.textContent = timestamp;

  const wrapper = document.createElement('div');
  wrapper.appendChild(taskText);
  wrapper.appendChild(taskTime);

  // Toggle complete
  li.addEventListener('click', (e) => {
    if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
      li.classList.toggle('completed');
      saveTasks();
    }
  });

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.onclick = (e) => {
    e.stopPropagation();
    const newText = prompt("Edit Task:", taskText.textContent);
    if (newText) {
      taskText.textContent = newText;
      saveTasks();
    }
  };

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'delete-btn';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.appendChild(wrapper);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  applyFilter();
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('.task-text').textContent,
      completed: li.classList.contains('completed'),
      timestamp: li.querySelector('.task-time').textContent
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.completed, task.timestamp));
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.filters button[onclick*="${filter}"]`).classList.add('active');
  applyFilter();
}

function applyFilter() {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => {
    const isCompleted = task.classList.contains('completed');
    if (
      currentFilter === 'all' ||
      (currentFilter === 'completed' && isCompleted) ||
      (currentFilter === 'incomplete' && !isCompleted)
    ) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
}

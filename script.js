const elements = {
  listsContainer: document.querySelector('[data-lists]'),
  newListForm: document.querySelector('[data-new-list-form]'),
  newListInput: document.querySelector('[data-new-list-input]'),
  deleteListButton: document.querySelector('[data-delete-list-button]'),
  listDisplayContainer: document.querySelector('[data-list-display-container]'),
  listTitleElement: document.querySelector('[data-list-title]'),
  listCountElement: document.querySelector('[data-list-count]'),
  tasksContainer: document.querySelector('[data-tasks]'),
  taskTemplate: document.getElementById('task-template'),
  newTaskForm: document.querySelector('[data-new-task-form]'),
  newTaskInput: document.querySelector('[data-new-task-input]'),
  clearCompleteTasksButton: document.querySelector('[data-clear-complete-tasks-button]')
};
const STORAGE_KEYS = {
  LIST: 'task.lists',
  SELECTED_LIST_ID: 'task.selectedListId'
};
let lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIST)) || [];
let selectedListId = localStorage.getItem(STORAGE_KEYS.SELECTED_LIST_ID);
elements.listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});
elements.tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    saveAndRender();
  }
});
elements.clearCompleteTasksButton.addEventListener('click', () => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});
elements.deleteListButton.addEventListener('click', () => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});
elements.newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = elements.newListInput.value.trim();
  if (!listName) return;
  lists.push(createItem(listName));
  elements.newListInput.value = '';
  saveAndRender();
});
elements.newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = elements.newTaskInput.value.trim();
  if (!taskName) return;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(createItem(taskName, false));
  elements.newTaskInput.value = '';
  saveAndRender();
});
function createItem(name, complete = false) {
  return { id: Date.now().toString(), name, complete, tasks: [] };
}
function saveAndRender() {
  save();
  render();
}
function save() {
  localStorage.setItem(STORAGE_KEYS.LIST, JSON.stringify(lists));
  localStorage.setItem(STORAGE_KEYS.SELECTED_LIST_ID, selectedListId);
}
function render() {
  const selectedList = lists.find(list => list.id === selectedListId);
  clearElement(elements.listsContainer);
  renderLists();
  if (!selectedListId) {
    elements.listDisplayContainer.style.display = 'none';
    return;
  }
  elements.listDisplayContainer.style.display = '';
  elements.listTitleElement.innerText = selectedList.name;
  renderTaskCount(selectedList);
  clearElement(elements.tasksContainer);
  renderTasks(selectedList);
}
function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(elements.taskTemplate.content, true);
    taskElement.querySelector('input').id = task.id;
    taskElement.querySelector('input').checked = task.complete;
    taskElement.querySelector('label').htmlFor = task.id;
    taskElement.querySelector('label').append(task.name);
    elements.tasksContainer.appendChild(taskElement);
  });
}
function renderTaskCount(selectedList) {
  const count = selectedList.tasks.filter(task => !task.complete).length;
  elements.listCountElement.innerText = `${count} ${count === 1 ? "task" : "tasks"} remaining`;
}
function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name", list.id === selectedListId && 'active-list');
    listElement.innerText = list.name;
    elements.listsContainer.appendChild(listElement);
  });
}
function clearElement(element) {
  element.innerHTML = '';
}
render();

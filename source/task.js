/**
 * This file defines functions and implements the behaviors of todo list.
 */

/**
 * Class constructor for <task-list>
 */
customElements.define('task-list', class extends HTMLElement {
  constructor() {
    super()
  }
})

// HTML List of all tasks on HTML page
const list = document.querySelector('.task-container');
list.addEventListener('click', handleEdit);


//HTML Task form for collecting data
const taskForm = document.getElementById("taskform")
taskForm.addEventListener("submit", addTask);

// HTML welcome message
const welcome = document.getElementById('welcome-message');

// Storing all tasks on current page.
let allTasks;

/**
 * When loading page, retrive previously stored task from
 * local storage, and render it, delete welcome message
 */
window.onload = function loadTask() {
  const retrievedObject = localStorage.getItem('allTasks');
  if (!retrievedObject || retrievedObject === 'undefined') {
    allTasks = [];
  } else {
    allTasks = JSON.parse(retrievedObject);
    if (allTasks.length !== 0) {
      welcome.remove();
    }

    for (let i = 0; i < allTasks.length; i++) {
      renderTask(allTasks[i]);
    }
  }
};

/**
 * Closing page will save current task and update local storage
 */
window.onbeforeunload = function storeTask() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
};

/**
 * Add a task to the page and to the global list.
 * @param {event} event Javascript events
 */
function addTask(event) {
  event.preventDefault();

  //create struct and append to global list
  const newTask = {
    id: Math.random().toString(16).slice(2),
    completed: false,
    name: document.getElementById("task-name").value,
    number: document.getElementById("task-num").value,
    current: 0,
    note: document.getElementById("task-note").value
  }
  allTasks.push(newTask);

  // render HTML on page.
  renderTask(newTask);

  // everything else.
  taskForm.reset();
  welcome.remove();
  document.getElementById('add-task-modal').style.display = 'none';
}

/**
 * render a task struct on page, display name and current progress
 * @param {newTask} newTask the task struct to render
 */
function renderTask(newTask) {
  document.querySelector(".task-container").appendChild(new TaskItem(newTask))
  renderCheckmark(newTask);
}

/**
 * render the checkbox status according to localStorage
 * @param {*} newTask the new object created from addTask()
 */
function renderCheckmark(newTask) {
  //setting checkmark
  document.getElementById(newTask.id).checkmark.checked = newTask.completed;
}

/**
 * Retrieving the note in Storage by getting its id
 * and update the checkmark status on the array 
 * @param {*} event 
 */
function handleCheck(element) {
  let targetID = element.getRootNode().host.id;
  // get the element Index in the object list
  const taskIdx = allTasks.findIndex(elem => elem.id === targetID);
  allTasks[taskIdx].completed = !allTasks[taskIdx].completed;
}

/**
 * Click more button, giving user edit and delete options
 * @param {event} event Javascript events.
 */
function handleEdit(event) {
  //getting which is being clicked
  let element = event.target;
  let eleJob;

  //job may be undefined
  if (event.target.attributes.job) {
    eleJob = event.target.attributes.job.value;
  }

  if (eleJob == "delete") {
    deleteTask(element);
  } else if (eleJob == "edit") {
    document.getElementById('add-task-modal').style.display = 'block';
  } else if (eleJob == "play") {
    document.getElementById('play-modal').style.display = 'block';
    showModalTask(element);
  } else if (eleJob == "check") {
    handleCheck(element);
  }
}

/**
 * Delete task
 * @param {event.target} element Javascript event.target
 */
function deleteTask(element) {
  // Delete item in the DOM
  element.closest("task-item").remove();
  // Delete item in allTasks array
  let name = element.closest("task-item").taskName;
  console.log(name)
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].name === name) {
      allTasks.splice(i, 1);
      break;
    }
  }
}


/**
 * For showing the task name, content on the modal when going to timer page.
 * @param {event.target} element The target element that the user wants to start with
 */
function showModalTask(element) {
  // get the closest li from where we click and get the p tag in its children
  const targetName = element.closest('li').getElementsByTagName('p');
  // make the task name appear in the timer modal
  document.getElementById('timer-name').innerText = targetName[0].innerHTML;
  // Retrieving the note in Storage by getting its id
  const targetID = element.closest('li').getAttribute('id');
  // get the element Index in the object list
  const taskStorageIndex = allTasks.findIndex((elem) => elem.id === targetID);
  // make the note from storage appear in the timer modal
  document.getElementById('timer-note').innerText =
    allTasks[taskStorageIndex].note;
}

// getter for the list
const dropzone = document.getElementById('main-container');
// getter for the list items
const nodes = document.getElementsByClassName('taskNode');
// variable for the selected node to be dragged or moved
let selectedNode;
// variable for the position of selected node
let selectedNodePos = 0;

// Listener for the dragstart event
dropzone.addEventListener(
  'dragstart',
  (event) => {
    selectedNode = event.target;
  },
  false
);

// Listener for the dragover event
dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  whereAmI(event.clientY);
});

// Listener for the drop event
dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);
});

/**
 * For measuring the selected node position from the list.
 */
function establishNodePositions() {
  for (let i = 0; i < nodes.length; i++) {
    const element = document.getElementById(nodes[i].id);
    const position = element.getBoundingClientRect(); // info of the element position on the frame
    const yTop = position.top;
    const yBottom = position.bottom;
    // yCenter
    nodes[i].yPos = yTop + (yBottom - yTop) / 2;
  }
}

/**
 * For deciding which position the selected element goes to as measuring which
 * is the closest parent and closet children
 * this function will call establishNodePositions() for selected node position.
 * @param {event.clickY} currentYPos
 */
function whereAmI(currentYPos) {
  establishNodePositions();
  let nodeAbove;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].yPos < currentYPos) {
      nodeAbove = document.getElementById(nodes[i].id);
      selectedNodePos = i + 1;
    }
  }
  // for the top of the list
  if (typeof nodeAbove === 'undefined') {
    selectedNodePos = 0;
  }
  // for the top of the list
  if (typeof nodeAbove === 'undefined') {
    selectedNodePos = 0;
  }
}
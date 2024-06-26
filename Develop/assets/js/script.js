//global variables
const taskTitle = $('#taskTitle');
const dueDate = $('#dueDate')
const taskDescription = $("#description")

const exampleModle = $("#exampleModal")
const swimLane = $(".swim-lanes")





//getting and saving to local storage as well as giving each card that generated a random id so they can be targeted individually
function readTaskFromStorage() {
    let string = localStorage.getItem("taskList")
    let taskList = JSON.parse(string)||[];

        return taskList;
    }

function saveTaskToStorage(taskList) {
    localStorage.setItem('taskList', JSON.stringify(taskList))}


// Todo: create a function to generate a unique task id
function generateTaskId() {
   const id = Math.floor(Math.random() * 10000000);
   return id;
      }
      





// Todo: create a function to create a task card
//this is building the actual card. the body, header and then each piece of information that will be displayed on it including the delete button
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.due);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
 

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.due && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.due, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    //warning means yellow and danger is red. Changed the text to white otherwise it is black by default
    //is same and is after classifys if the task is on the same day or after the due date which helps determine the color
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  //Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  //Return the card so it can be appended to the correct lane.
  return taskCard;
}




//first section is making "lanes" where the card will be placed, then a for loop needs to be made to filter through each step
function renderTaskList() {
  const taskList = readTaskFromStorage();
    
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of taskList) {
    if (task.status == "to-do") {
        todoList.append(createTaskCard(task));
    } else if (task.status == "in-progress" ) {
        inProgressList.append(createTaskCard(task));
    } else if (task.status == "done") {
        doneList.append(createTaskCard(task));
    }
  }
//need this to make it draggable using jquery ui
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
     const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


//this function helps with adding the new tasks
function handleAddTask(){
    const title = taskTitle.val();
    const due = dueDate.val();
    const description = taskDescription.val();
    const task = {
        id: generateTaskId(),
        title: title,
        due: due,
        description: description,
        status: "to-do",
    };
    
    const taskList = readTaskFromStorage();
    taskList.push(task);
    saveTaskToStorage(taskList);
    
    renderTaskList();
    
    taskTitle.val("");
    dueDate.val("");
    taskDescription.val("");
}


//this is the function for deleting each task from storage
function handleDeleteTask(){
    const taskId = $(this).attr("data-task-id");
    const taskList = readTaskFromStorage();

    taskList.forEach((task, i) => {
        if (task.id == taskId) {
           taskList.splice(i, 1);
        }
    });
saveTaskToStorage(taskList);

renderTaskList();
}






//this handle drop functions allows the task itme to be dropped into a new area
function handleDrop(event, ui) {
    const tasks = readTaskFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id == taskId) {
          task.status = newStatus;
        }
    }

    saveTaskToStorage(tasks);
    renderTaskList();
}


exampleModle.on("click", ".addButton", function (event){
    event.preventDefault();

    handleAddTask();

    exampleModle.modal("hide");
})



swimLane.on("click", ".delete", handleDeleteTask);



$(document).ready(function () {
    // ? Print project data to the screen on page load if there is any
    renderTaskList();
  
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
  });


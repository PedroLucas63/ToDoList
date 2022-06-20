//Get the HTML template
function templateTask(){
    let htmlTemplate = $("#taskTemplate").html();
    let template = Handlebars.compile(htmlTemplate);

    return template;
}

//Pass all saved tasks to HTML
function writeTask(task){
    const tasksList = $("#tasks");

    template = templateTask();

    if(task["description"] == ""){
        task["description"] = "No description..."
    }

    if(task["situation"] ==  "true"){
        task["complete"] = "line-through text-gray-600";
        task["complete-icon"] = "checkbox-outline";
    }
    else{
        task["complete"] = "";
        task["complete-icon"] = "stop-outline";
    }

    tasksList.append(template(task));
}

//Get browser data or create data:
function getData(){
    let tasks;

    if(!localStorage.getItem("tasks")){
        tasks = [];
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("length", 0);
    }
    else{
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    return tasks;

}

//Get length of browser data
function getLength(){
    length = JSON.parse(localStorage.getItem("length"));
    return length;
}

//Load tasks that already exist on the page
function loadTasks(){
    let tasks = getData();
    tasks.forEach(writeTask);
}

//Save tasks in the browser data
function saveTasks(tasks, length){
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(tasks));

    localStorage.removeItem("length");
    localStorage.setItem("length", JSON.stringify(length));
}

//Add task in the browser
function addTask(task, length){
    let tasks = getData();
    tasks.push(task);

    saveTasks(tasks, length);
}

//Create task function
function createTask(){
    if(JSON.stringify($("#title").val()).length > 3){
        const title = $("#title").val();
        const description = $("#description").val();

        let newLength = getLength() + 1;

        let id = "task-" + (newLength);
        let situation = "false";

        let task = {
            "title": title,
            "description": description,
            "id": id,
            "situation": situation
        }

        addTask(task, newLength);
        writeTask(task);
    }
    else{
        alert("Enter a title with at least 3 characters");
    }

}

//Search task from the title
function searchTask(){
    const search = $("#search").val();

    let tasks = getData();
    let length = getLength();
    let lengthFor = tasks.length;

    for(let i = 0; i <= lengthFor; i++){
        if(tasks[i]["title"] == search){
            window.location.hash = tasks[i]["id"];
            break;
        }
    }
}

//Role designed to complete or draw completion of a task
function completeTask(button){
    let task = $(button).parents().get(2);
    let taskId = task.id;

    let taskTitle = $(task).find("h3");
    let taskIcon = $(task).find(".icon-task");

    let tasks = getData();
    let length = getLength();
    let lengthFor = tasks.length;

    for(let i=0; i < lengthFor; i++){
        if(tasks[i]["id"] == taskId){
            if(tasks[i]["situation"] == "true"){
                tasks[i]["situation"] = "false";

                taskTitle.attr("class", "");
                taskIcon.attr("name", "stop-outline");
            }
            else{
                tasks[i]["situation"] = "true";

                taskTitle.attr("class", "line-through text-gray-600");
                taskIcon.attr("name", "checkbox-outline");
            }
        }
    }

    saveTasks(tasks, length);

}

//Function dedicated to editing tasks
function editTask(button){
    let taskHtml = $(button).parents().get(2);
    let taskId = taskHtml.id;

    let tasks = getData();
    let length = getLength();

    let lengthFor = tasks.length;

    let task;
    let position;

    for(let i = 0; i < lengthFor; i++){
        if(tasks[i]["id"] == taskId){
            task = tasks[i];
            position = i;

            break;
        }
    }

    const titleInput = $("#title");
    const descriptionInput = $("#description");
    const submitButton = $("#button-form");

    titleInput.val(task["title"]);
    descriptionInput.val(task["description"]);

    $(submitButton).text("Update");

    submitButton.attr("onclick", "");

    let buttonsEdit = $(".edit-task");

    for(let i=0; i < lengthFor; i++){
        $(buttonsEdit[i]).prop("disabled", true);
    }

    submitButton.click(function(){

        if($(titleInput).val().length > 3){
            task["title"] = titleInput.val();
            task["description"] = descriptionInput.val();

            tasks[position]["title"] = titleInput.val();
            tasks[position]["description"] = descriptionInput.val();

            $(taskHtml).find("h3").text(titleInput.val());
            
            if(descriptionInput.val() == ""){
                $(taskHtml).find("p").text("No description...");
            }
            else{
                $(taskHtml).find("p").text(descriptionInput.val());
            }

            saveTasks(tasks, length);

            submitButton.attr("onclick", "createTask()");
            $(submitButton).text("Submit");

            for(let i=0; i < lengthFor; i++){
                $(buttonsEdit[i]).prop("disabled", false);
            }

            submitButton.off();
        }
        else{
            alert("Enter a title with at least 3 characters");
        }
    });

}

//Role dedicated to removing tasks
function removeTask(button){
    let taskHtml = $(button).parents().get(2);
    let taskId = taskHtml.id;

    let tasks = getData();
    let length = getLength();
    let lengthFor = tasks.length;

    for(let i = 0; i < lengthFor; i++){
        if(tasks[i]["id"] == taskId){
            tasks.splice(i, 1);
            break;
        }
    }
    
    taskHtml.remove();
    saveTasks(tasks, length);

}

loadTasks();

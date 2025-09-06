document.addEventListener('DOMContentLoaded', () => {
    const projectNameHeading = document.getElementById('project-name-heading');
    const todoTasks = document.getElementById('todo-tasks');
    const inprogressTasks = document.getElementById('inprogress-tasks');
    const doneTasks = document.getElementById('done-tasks');
    const createTaskForm = document.getElementById('create-task-form');
    const taskAssignee = document.getElementById('task-assignee');
    const discussionThread = document.getElementById('discussion-thread');
    const newCommentForm = document.getElementById('new-comment-form');

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    let projectUsers = [];

    async function fetchProjectData() {
        try {

            const projectRes = await fetch(`/api/projects/${projectId}`, { headers: { 'x-auth-token': token } });
            const project = await projectRes.json();
            projectNameHeading.textContent = project.name;

            const usersRes = await fetch(`/api/users`); 
            projectUsers = await usersRes.json();
            populateAssignees();

            const tasksRes = await fetch(`/api/tasks/${projectId}`, { headers: { 'x-auth-token': token } });
            const tasks = await tasksRes.json();
            renderTasks(tasks);

            const commentsRes = await fetch(`/api/discussions/${projectId}`, { headers: { 'x-auth-token': token } });
            const comments = await commentsRes.json();
            renderComments(comments);

        } catch (err) {
            console.error(err);
        }
    }

    function renderTasks(tasks) {
        todoTasks.innerHTML = '';
        inprogressTasks.innerHTML = '';
        doneTasks.innerHTML = '';

        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'card task-card mb-2';
            taskCard.setAttribute('data-task-id', task.id);
            taskCard.innerHTML = `
                <div class="card-body">
                    <h6 class="card-title">${task.title}</h6>
                    <p class="card-text"><small>Due: ${new Date(task.due_date).toLocaleDateString()}</small></p>
                    <p class="card-text"><small>Assignee: ${projectUsers.find(u => u.id === task.assignee_id)?.name || 'Unassigned'}</small></p>
                </div>
            `;

            if (task.status === 'To-Do') {
                todoTasks.appendChild(taskCard);
            } else if (task.status === 'In Progress') {
                inprogressTasks.appendChild(taskCard);
            } else {
                doneTasks.appendChild(taskCard);
            }
        });
    }

    function renderComments(comments) {
        discussionThread.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'card mb-2';
            commentElement.innerHTML = `<div class="card-body"><strong>${comment.user_name}:</strong> ${comment.comment}</div>`;
            discussionThread.appendChild(commentElement);
        });
    }

    function populateAssignees() {
        taskAssignee.innerHTML = '<option value="">Unassigned</option>';
        projectUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            taskAssignee.appendChild(option);
        });
    }

    if (createTaskForm) {
        createTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('task-name').value;
            const description = document.getElementById('task-description').value;
            const assignee_id = document.getElementById('task-assignee').value;
            const due_date = document.getElementById('task-due-date').value;

            try {
                const res = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ projectId, title, description, assignee_id, due_date, status: 'To-Do' }),
                });
                if (res.ok) {
                    fetchProjectData();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('create-task-modal'));
                    modal.hide();
                    createTaskForm.reset();
                } else {
                    const data = await res.json();
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    if (newCommentForm) {
        newCommentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const comment = document.getElementById('comment-text').value;
            try {
                const res = await fetch('/api/discussions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ projectId, comment }),
                });
                if (res.ok) {
                    fetchProjectData();
                    newCommentForm.reset();
                } else {
                    const data = await res.json();
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    [todoTasks, inprogressTasks, doneTasks].forEach(column => {
        new Sortable(column, {
            group: 'tasks',
            animation: 150,
            onEnd: async function (evt) {
                const taskId = evt.item.dataset.taskId;
                let newStatus;
                if (evt.to.id === 'todo-tasks') newStatus = 'To-Do';
                else if (evt.to.id === 'inprogress-tasks') newStatus = 'In Progress';
                else if (evt.to.id === 'done-tasks') newStatus = 'Done';

                try {
                    await fetch(`/api/tasks/${taskId}`,
                     {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token,
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });
                } catch (err) {
                    console.error('Failed to update task status', err);
                    
                }
            },
        });
    });

    fetchProjectData();
});

document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const createProjectForm = document.getElementById('create-project-form');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    async function fetchProjects() {
        try {
            const res = await fetch('/api/projects', {
                headers: {
                    'x-auth-token': token,
                },
            });
            const projects = await res.json();
            renderProjects(projects);
        } catch (err) {
            console.error(err);
        }
    }

    function renderProjects(projects) {
        projectList.innerHTML = '';
        projects.forEach(project => {
            const projectItem = document.createElement('a');
            projectItem.href = `project.html?id=${project.id}`;
            projectItem.className = 'list-group-item list-group-item-action';
            projectItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${project.name}</h5>
                </div>
                <p class="mb-1">${project.description}</p>
            `;
            projectList.appendChild(projectItem);
        });
    }

    if (createProjectForm) {
        createProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name').value;
            const description = document.getElementById('project-description').value;

            try {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ name, description }),
                });

                if (res.ok) {
                    fetchProjects();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('create-project-modal'));
                    modal.hide();
                    createProjectForm.reset();
                } else {
                    const data = await res.json();
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    fetchProjects();
});

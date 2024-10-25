export interface ITodoItem {
  id: number;
  title: string;
  description: string;
  status: string; // "todo", "inProgress", "done"
}

export default class Todo {
  static idCounter = 4;
  static filterLetter = "";
  todos: Array<ITodoItem>;
  addBtn: HTMLButtonElement | null = null;
  todoList: HTMLUListElement | null = null;
  titleInput: HTMLInputElement | null = null;
  descriptionInput: HTMLInputElement | null = null;
  searchbar: HTMLInputElement | null = null;
  createModalContainer: HTMLDivElement | null = null;
  modalBtn: HTMLButtonElement | null = null;

  constructor() {
    this.todos = [
      {
        id: 1,
        title: "Todo1",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum?",
        status: "todo",
      },
      {
        id: 2,
        title: "Todo2",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum?",
        status: "inProgress",
      },
      {
        id: 3,
        title: "Todo3",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum?",
        status: "done",
      },
    ];

    this.addBtn = document.querySelector("#todo-add-btn");
    this.searchbar = document.querySelector("#search-input");
    this.modalBtn = document.querySelector(".modal_btn");
    this.createModalContainer = document.querySelector(
      "#createModal-container"
    );

    // this.todoList = document.querySelector("#todo-list");

    this.searchbar?.addEventListener("keyup", () => this.updateFilterLetter());
    this.render();
  }

  addTodo(status: any) {
    this.titleInput = document.querySelector("#title-input");
    this.descriptionInput = document.querySelector("#description-input");
    const title = this.titleInput?.value;
    const description = this.descriptionInput?.value;
    if (title && description) {
      this.todos.push({
        id: Todo.idCounter++,
        title,
        description,
        status,
      });

      if (this.titleInput) this.titleInput.value = "";
      if (this.descriptionInput) this.descriptionInput.value = "";
      console.log(this.todos);
      this.render();
    }
  }

  editTodo(id: number) {
    // Fetch one object where todo id = id
    const todoToEdit = this.todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      const newDescription = prompt("Edit To-Do: ", todoToEdit.description);
      if (newDescription) {
        todoToEdit.description = newDescription;
        this.render();
      }
    }
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id != id);
    this.render();
  }

  updateFilterLetter() {
    if (this.searchbar) {
      Todo.filterLetter = this.searchbar.value.toLowerCase();
      this.render();
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drag(event: DragEvent) {
    event.dataTransfer?.setData("text", (event.target as HTMLElement).id);
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData("text");
    const draggedElement = document.getElementById(data!);

    let target = event.target as HTMLElement;

    while (target && target.tagName !== "UL") {
      target = target.parentElement as HTMLElement;
    }

    if (target && target.classList.contains("todo-list") && draggedElement) {
      const todoId = parseInt(draggedElement.id.slice(-1));
      const todo = this.todos.find((todo) => todo.id === todoId);

      if (todo) {
        // Update status of todo based on the target list
        if (target.id.includes("todo")) {
          todo.status = "todo";
        } else if (target.id.includes("in-progress")) {
          todo.status = "inProgress";
        } else if (target.id.includes("done")) {
          todo.status = "done";
        }

        target.appendChild(draggedElement);
      }
    }
  }

  openCreateModal(title: string) {
    if (this.createModalContainer) {
      const createModalElement = document.createElement("div");
      createModalElement.classList.add("createModal_div");
      createModalElement.innerHTML = `
        <div class="modal_background">
          <div class="createModal-description">
            <button class="close-btn">&times;</button>

            <form class="modal-input">
              <label for="title-input">Title</label></br>
              <input type="text" name="title" id="title-input" required /></br>
              <label for="description-input">Description</label></br>
              <textarea type="text" name="description" id="description-input" rows="5" cols="40" required /></textarea></br>
              <button id="todo-add-btn" class="${title}">Add</button>
            </div>
          </div>
        </div>
      `;
      createModalElement
        .querySelector(".close-btn")
        ?.addEventListener("click", () => this.closeModal());

      createModalElement
        .querySelector(".modal_background")
        ?.addEventListener("click", (e) => {
          if (e.target.className === "modal_background") this.closeModal();
          // console.log(e.target.className);

          // if (e.target.closest())
          // e.stopPropagation();
          // this.closeModl();
        });
      const status = createModalElement
        .querySelector("#todo-add-btn")
        ?.getAttribute("class");
      let camelStatus = "";
      if (status === "ToDo") {
        camelStatus = "todo";
      } else if (status === "In Progress") {
        camelStatus = "inProgress";
      } else {
        camelStatus = "done";
      }
      createModalElement
        .querySelector("#todo-add-btn")
        ?.addEventListener("click", () => {
          this.titleInput = document.querySelector("#title-input");
          this.descriptionInput = document.querySelector("#description-input");
          const title = this.titleInput?.value;
          const description = this.descriptionInput?.value;
          if (title && description) {
            this.addTodo(camelStatus);
            this.closeModal();
          }
        });
      this.createModalContainer.appendChild(createModalElement);
    }
  }

  closeModal() {
    if (this.createModalContainer) this.createModalContainer.innerHTML = "";
  }

  render() {
    const filteredTodos = this.todos.filter((todo) =>
      Todo.filterLetter
        ? todo.title.toLowerCase().includes(Todo.filterLetter)
        : true
    );

    const todos = filteredTodos.filter((todo) => todo.status === "todo");
    const inProgress = filteredTodos.filter(
      (todo) => todo.status === "inProgress"
    );
    const done = filteredTodos.filter((todo) => todo.status === "done");

    const todoContainer: HTMLElement | null =
      document.querySelector("#todo-container");
    const inProgressContainer: HTMLElement | null = document.querySelector(
      "#in-progress-container"
    );
    const doneContainer: HTMLElement | null =
      document.querySelector("#done-container");

    if (todoContainer) {
      todoContainer.innerHTML = ""; // Clear the container
      this.renderStatusSection(todoContainer, todos, "ToDo");
    }
    if (inProgressContainer) {
      inProgressContainer.innerHTML = ""; // Clear the container
      this.renderStatusSection(inProgressContainer, inProgress, "In Progress");
    }
    if (doneContainer) {
      doneContainer.innerHTML = ""; // Clear the container
      this.renderStatusSection(doneContainer, done, "Done");
    }
  }

  renderStatusSection(
    container: HTMLElement,
    items: Array<ITodoItem>,
    title: string
  ) {
    const sectionInner = document.createElement("div");
    // sectionInner.classList.add("todo-status");
    // sectionInner.classList.add("todo-upcoming");
    sectionInner.innerHTML = `
      <div class="section-heading">
        <h3 class="section-title">${title}</h3>
        <img
              src="./images/plus.svg"
              alt="plus-btn"
              class="plus-btn modal_btn"
        />
      </div>
      <ul
        class="todo-list todo-list-upcoming"
        id="${title.toLowerCase().replace(" ", "-")}"
      >
      </ul>

    `;
    sectionInner
      .querySelector(".todo-list")
      ?.addEventListener("drop", (event) => this.drop(event as DragEvent));
    sectionInner
      .querySelector(".todo-list")
      ?.addEventListener("dragover", (event) =>
        this.allowDrop(event as DragEvent)
      );
    sectionInner
      .querySelector(".modal_btn")
      ?.addEventListener("click", () => this.openCreateModal(title));

    container.appendChild(sectionInner);

    const ul = sectionInner.querySelector("ul");

    if (ul) {
      items.forEach((todo) => {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.setAttribute("draggable", "true");
        li.setAttribute("id", `todo-item-id${todo.id}`);
        li.innerHTML = `
            <div class="todo-item-heading">
              <h4 class="todo-item-title">${todo.title}</h4>
              <div class="todo-btn-wrapper">
                <img
                  src="/images/edit.svg"
                  alt="edit button"
                  class="btn-edit"
                />
                <img
                  src="/images/delete.svg"
                  alt="delete button"
                  class="btn-delete"
                />
              </div>
            </div>
            <div class="todo-item-contents">
              ${todo.description}
            </div>
        `;

        // Add event listeners for edit and delete buttons
        li
          .querySelector(".btn-edit")
          ?.addEventListener("click", () => this.editTodo(todo.id));
        li
          .querySelector(".btn-delete")
          ?.addEventListener("click", () => this.deleteTodo(todo.id));
        // Add dragstart event listener for todo item
        li
          .querySelector(".todo-item")
          ?.addEventListener("dragstart", (event) =>
            this.drag(event as DragEvent)
          );

        ul.appendChild(li);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new Todo();
});

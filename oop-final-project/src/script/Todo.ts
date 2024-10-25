export interface ITodoItem {
  id: number;
  title: string;
  description: string;
  status: string; // "todo", "inProgress", "done"
  completed: boolean;
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
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum, ipsum blanditiis debitis accusamus? Quasi perspiciatis et repellat?",
        status: "todo",
        completed: false,
      },
      {
        id: 2,
        title: "Todo2",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum, ipsum blanditiis debitis accusamus? Quasi perspiciatis et repellat?",
        status: "inProgress",
        completed: false,
      },
      {
        id: 3,
        title: "Todo3",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius distinctio, ducimus sed quisquam quaerat, numquam reprehenderit nulla dolores eveniet qui tenetur laborum, ipsum blanditiis debitis accusamus? Quasi perspiciatis et repellat?",
        status: "done",
        completed: false,
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
        completed: false
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

  editTodoCompleted(id: number) {
    // Fetch one object where todo id = id
    const todoToEdit = this.todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      todoToEdit.completed = !todoToEdit.completed
      if (todoToEdit.completed) {
        todoToEdit.status = 'done'
      }
      this.render();
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
      this.render()
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
          if ((e.target as HTMLElement).className === "modal_background") this.closeModal();
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
    const sectionInner = document.createElement("section");
    sectionInner.classList.add("todo-status");
    sectionInner.classList.add("todo-upcoming");
    const itemLengthText = items.length === 0 || items.length === 1 ? `${items.length} Task` : `${items.length} Tasks`
    sectionInner.innerHTML = `
      <div class="section-heading">
        <h3 class="section-title">${title}</h3>
        <div class="section-heading-right">
          <span>
            ${itemLengthText}
          </span>
          <button class="modal_btn">+</button>
        </div>
      </div>
      <ul
        class="todo-list todo-list-upcoming"
        id="${title.toLowerCase().replace(" ", "-")}"
      >
      </ul>
      <div class="add-area">
        <img src="./images/plus.svg" alt="add-area" width="100px" />
      </div>
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
        // li.innerHTML = `
        //   <h3>${todo.title}</h3>
        //   <span>${todo.description}</span>
        //   <div class="btns">
        //     <button class="btn-edit">Edit</button>
        //     <button class="btn-delete">Delete</button>
        //   </div>
        // `
        // li.innerHTML = `
        //   <li
        //     class="todo-item"
        //     draggable="true"
        //     ondragstart="drag(event)"
        //     id="drag1"
        //   >
        //     <div class="todo-item-heading">
        //       <h4 class="todo-item-title">${todo.title}</h4>
        //       <div class="detail-btn-wrapper">
        //         <img
        //           src="https://dummyimage.com/600x400/471de0/fff"
        //           alt="detail-btn"
        //           class="detail-btn"
        //           width="50px"
        //         />
        //         <ul class="detail-list">
        //           <button class="edit-btn">
        //             <img
        //               src="./images/edit.svg"
        //               alt="edit"
        //               class="detail-btn-icon"
        //               width="20px"
        //             />
        //             <span class="detail-btn-context">Edit</span>
        //           </button>
        //           <button class="edit-delete-btn">
        //             <img
        //               src="./images/edit.svg"
        //               alt="edit"
        //               class="detail-btn-icon"
        //               width="20px"
        //             />
        //             <span class="detail-btn-context">Delete</span>
        //           </button>
        //           <button class="edit-delete-btn">
        //             <img
        //               src="./images/edit.svg"
        //               alt="edit"
        //               class="detail-btn-icon"
        //               width="20px"
        //             />
        //             <span class="detail-btn-context">In Progress</span>
        //           </button>
        //           <button class="edit-btn">
        //             <img
        //               src="./images/edit.svg"
        //               alt="edit"
        //               class="detail-btn-icon"
        //               width="20px"
        //             />
        //             <span class="detail-btn-context">Done</span>
        //           </button>
        //         </ul>
        //       </div>
        //     </div>
        //     <div class="todo-item-contents">
        //       ${todo.description}
        //     </div>
        //   </li>
        // `;
        li.innerHTML = `
          <li
            class="todo-item"
            draggable="true"
            id="todo-item-id${todo.id}"
          >
            <div class="todo-item-heading">
              <div class="todo-title-wrapper">
                <input type="checkbox" class="input-completed" ${todo.completed ? 'checked' : ''}>
                <h4 class="todo-item-title">${todo.title}</h4>
              </div>
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
          </li>
        `;

        // Add event listeners for edit and delete buttons and checkbox
        li
          .querySelector(".btn-edit")
          ?.addEventListener("click", () => this.editTodo(todo.id));
        li
          .querySelector(".btn-delete")
          ?.addEventListener("click", () => this.deleteTodo(todo.id));
        li
          .querySelector(".input-completed")
          ?.addEventListener("click", () => this.editTodoCompleted(todo.id));
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

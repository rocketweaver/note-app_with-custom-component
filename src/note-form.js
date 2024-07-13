import { notesData } from "./main.js";

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.updateStyle();
    this.render();

    const backBtn = this.querySelector(".back-btn");
    const addBtn = document.querySelector("add-btn");
    const notes = document.querySelector("#notes");
    const newNote = document.querySelector("#new-note");
    const form = this.querySelector("#note-form");

    backBtn.addEventListener("click", function () {
      newNote.classList.add("d-none");
      notes.classList.remove("d-none");
      addBtn.classList.remove("d-none");
    });

    form.addEventListener("submit", this.handleSubmit.bind(this));

    const title = this.querySelector("#title");

    title.addEventListener("change", this.customTitleValidation.bind(this));
    title.addEventListener("invalid", this.customTitleValidation.bind(this));

    const body = this.querySelector("#body");

    body.addEventListener("change", this.customBodyValidation.bind(this));
    body.addEventListener("invalid", this.customBodyValidation.bind(this));
  }

  updateStyle() {
    this._style.textContent = `
        #title, #body {
            display: block;
            outline: 0;
            border: 0;
            width: 100%;
        }
        
        #title {
            font-size: 24px;
            font-weight: bold;
        }
        
        hr {
            margin-top: 20px;
        }
        
        #body {
            resize: none;
            font-size: 1rem;
            height: 80%;
        }
        
        .note-form-container {
            margin-top: 60px;
            padding: 60px;
            border: 1px solid #000;
            border-radius: 24px;
            height: 90vh;
        }
        
        #submit-form-btn {
            background: none;
            border: 0;
            cursor: pointer;
        }

        @media screen and (max-width: 505px) { 
          #title {
              font-size: 18px
          }

          .note-form-container {
            padding: 0;
            border: 0;
            height: 90vh;
        }
        }
      `;
  }

  render() {
    this.updateStyle();

    this.innerHTML = `
        ${this._style.outerHTML}
        <form id="note-form">
          <div class="save-and-back">
            <button type="button" class="back-btn">Back</button>
            <button type="submit" id="submit-form-btn">
              <img src="img/save-btn.svg" alt="Save" />
            </button>
          </div>
          <div class="note-form-container">
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Input your note title here..."
              required
              minlength="5"
              autocomplete="off"
              aria-describedby="titleValidation"
            />
            <hr />
            <br />
            <textarea
              name="body"
              id="body"
              placeholder="Input your note here"
              required
              minlength="12"
              autocomplete="off"
              aria-describedby="bodyValidation"
            ></textarea>
          </div>
        </form>
      `;
  }

  generateId(prefix) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let part1 = "";
    for (let i = 0; i < 2; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    let part2 = "";
    for (let i = 0; i < 14; i++) {
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${prefix}-${part1}-${part2}`;
  }

  getCurrentDate() {
    const date = new Date();
    return date.toISOString();
  }

  customTitleValidation(event) {
    event.target.setCustomValidity("");

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Wajib mengisi judul.");
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity("Minimal panjang adalah 5 karakter.");
      return;
    }
  }

  customBodyValidation(event) {
    event.target.setCustomValidity("");

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Wajib mengisi deskripsi catatan.");
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity("Minimal panjang adalah 12 karakter.");
      return;
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const title = this.querySelector("#title");
    const body = this.querySelector("#body");

    if (!title.checkValidity() || !body.checkValidity()) {
      return;
    }

    const newNoteData = {
      id: this.generateId("notes"),
      title: title.value,
      body: body.value,
      createdAt: this.getCurrentDate(),
      archived: false,
    };

    notesData.push(newNoteData);

    const noteListEl = document.querySelector("note-list");

    notesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    noteListEl.setNoteList(notesData);

    const notes = document.querySelector("#notes");
    const newNote = document.querySelector("#new-note");
    newNote.classList.add("d-none");
    notes.classList.remove("d-none");
  }
}

customElements.define("note-form", NoteForm);

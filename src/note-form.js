const API_URL = "https://notes-api.dicoding.dev/v2";

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
    const intro = document.getElementById("intro");

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

  async handleSubmit(event) {
    event.preventDefault();

    const title = this.querySelector("#title");
    const body = this.querySelector("#body");

    if (!title.checkValidity() || !body.checkValidity()) {
      return;
    }

    intro.style.display = "flex";
    animateIntro(intro);

    const newNoteData = {
      title: title.value,
      body: body.value,
    };

    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNoteData),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("Note successfully added:", result);
        this.updateNoteList();
      } else {
        console.error("Failed to add note:", result.message);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }

    const notes = document.querySelector("#notes");
    const newNote = document.querySelector("#new-note");
    newNote.classList.add("d-none");
    notes.classList.remove("d-none");
  }

  async updateNoteList() {
    try {
      const res = await fetch(`${API_URL}/notes`);
      const resJson = await res.json();

      if (res.ok) {
        const notesData = resJson.data;

        notesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const noteListEl = document.querySelector("note-list");
        noteListEl.setNoteList(notesData);
      } else {
        console.error("Failed to fetch notes:", resJson.message);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }
}

function animateIntro(intro) {
  for (const child of intro.children) {
    const animation = child.animate(
      [
        { left: "-300px", opacity: 0 },
        { left: "0", opacity: 1 },
      ],
      {
        duration: 300,
        iterations: 1,
      }
    );

    animation.addEventListener("finish", function () {
      setTimeout(function () {
        child.animate(
          [
            { left: "0", opacity: 1 },
            { left: "300px", opacity: 0 },
          ],
          {
            duration: 150,
            iterations: 1,
          }
        ).onfinish = function () {
          intro.style.display = "none";
        };
      }, 300);
    });
  }
}

function hideIntro(intro) {
  intro.style.display = "none";
}

customElements.define("note-form", NoteForm);

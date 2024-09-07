const API_URL = "https://notes-api.dicoding.dev/v2";

class NoteItem extends HTMLElement {
  constructor() {
    super();

    this._note = {
      id: "NEED_ID",
      title: "NEED_TITLE",
      body: "NEED_BODY",
      createdAt: "NEED_DATE",
      archived: false,
    };

    this._style = document.createElement("style");
  }

  setNote(value) {
    this._note["id"] = value.id;
    this._note["title"] = value.title;
    this._note["body"] = value.body;
    this._note["createdAt"] = value.createdAt;
    this._note["archived"] = value.archived;

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  updateStyle() {
    this._style.textContent = `
        note-item {
            background-color: #fff;
            padding: 25px 50px;
            border-radius: 24px;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
            position: relative;
            bottom: 0;
            transition: bottom .25s ease-in-out;
        }

        .note-date {
            color: #9a9a9a;
            margin-top: 20px;
            display: block
        }

        .note-link {
            color: #000;
            text-decoration: none;
            transition: all .2s ease-in-out;
        }

        .note-link:hover {
            font-size: 1.25rem;
            cursor: pointer;
        }

        .title {
            margin-top: 5px;
        }

        .body {
            margin-top: 15px
        }

        .remove-form {
          text-align: right;
          margin-top: 15px;
        }

        .remove-icon {
          cursor: pointer;
          background: none;
          border: none;
        }
    `;
  }

  formattedDate() {
    const date = new Date(this._note.createdAt);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  async handleDelete(event) {
    event.preventDefault();

    const noteId = this._note.id;
    const intro = document.getElementById("intro");

    try {
      intro.style.display = "flex";
      animateIntro(intro);

      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the note.");
      }

      this.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete the note. Please try again.");
    }
  }

  render() {
    this.updateStyle();

    this.setAttribute("data-id", this._note.id);

    this.innerHTML = `
            ${this._style.outerHTML}
    
            <div class="title">
                <h3>${this._note.title}</h3>
            </div>
            <div class="body">
                <p>${this._note.title}</p>
            </div>
            <small class="note-date">${this.formattedDate()}</small>
            <form class="remove-form" method="delete">
              <button type="submit" class="remove-icon"><img src="/img/delete-btn.svg"></button>
            </form>
        `;

    this.querySelector(".remove-form").addEventListener(
      "submit",
      this.handleDelete.bind(this)
    );
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

customElements.define("note-item", NoteItem);

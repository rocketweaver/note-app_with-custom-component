class AddBtn extends HTMLElement {
  static observedAttributes = ["background"];

  constructor() {
    super();

    this._background = this.getAttribute("background");
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      this.classList.add("clicked");
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 300);
    });

    const notes = document.querySelector("#notes");
    const newNote = document.querySelector("#new-note");
    const backBtn = document.querySelector(".back-btn");

    this.addEventListener("click", function (e) {
      this.classList.add("d-none");
      notes.classList.add("d-none");
      newNote.classList.remove("d-none");
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.classList.remove("d-none");
        notes.classList.remove("d-none");
        newNote.classList.add("d-none");
      });
    }

    this.render();
  }

  updateStyle() {
    this._style.textContent = `
      add-btn {
        background: ${this._background};
        position: fixed;
        right: 100px;
        bottom: 60px;
        padding: 20px;
        border-radius: 100%;
        border: 1px solid #000;
        width: 60px;
        height: 60px;
        transform: rotateZ(0deg);
        transition: transform .3s ease-in-out;
      }

      add-btn span {
        text-decoration: none;
        color: #fefefe;
        font-size: 2.5rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      add-btn:hover {
        transform: rotateZ(180deg);
        cursor: pointer;
      }

      add-btn.clicked {
        transform: scale(0.8);
      }
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "background") {
      this._background = newValue;
      this.render();
    }
  }

  render() {
    this.updateStyle();
    this.innerHTML = `
      ${this._style.outerHTML}
      <span>+</span>
    `;
  }
}

customElements.define("add-btn", AddBtn);

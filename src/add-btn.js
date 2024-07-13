class AddBtn extends HTMLElement {
  constructor() {
    super();

    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();

    this.addEventListener("click", () => {
      this.classList.add("clicked");
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 300);
    });
  }

  updateStyle() {
    this._style.textContent = `
        add-btn {
            position: fixed;
            right: 100px;
            bottom: 60px;
            padding: 20px;
            border-radius: 100%;
            background: #000;
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

  render() {
    this.updateStyle();

    this.innerHTML = `
        ${this._style.outerHTML}
      
        <span href="#" rel="noopener noreferrer">+</span>
    `;
  }
}

customElements.define("add-btn", AddBtn);

class NoteList extends HTMLElement {
  constructor() {
    super();

    this._noteList = [];

    this._style = document.createElement("style");
  }

  setNoteList(value) {
    this._noteList = value;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  updateStyle() {
    this._style.textContent = `
        note-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            z-index: 0;
        }
        @media screen and (max-width: 768px) { 
          note-list {
              display: grid;
              grid-template-columns: 1fr;
              gap: 2rem;
              z-index: 0;
          }
        }
    `;
  }

  render() {
    this.updateStyle();

    const noteItemElements = this._noteList.map((item) => {
      const note = document.createElement("note-item");
      note.setNote(item);

      return note;
    });

    this.innerHTML = "";
    this.append(this._style, ...noteItemElements);
  }
}

customElements.define("note-list", NoteList);

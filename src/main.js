import '../css/style.css';
import "./note-list.js";
import "./note-item.js";
import "./add-btn.js";
import "./note-form.js";

const API_URL = "https://notes-api.dicoding.dev/v2/notes";

window.addEventListener("load", async function () {
  const intro = document.getElementById("intro");

  intro.style.display = "flex";

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

  try {
    const res = await fetch(API_URL);
    const resJson = await res.json();

    if (res.ok) {
      const notesData = resJson.data;

      console.log("Fetched Notes Data:", notesData);

      notesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const noteListEl = document.querySelector("note-list");
      noteListEl.setNoteList(notesData);
    } else {
      console.error("Failed to fetch notes:", resJson.message);
    }
  } catch (error) {
    console.log("Error fetching notes:", error);
  }
});

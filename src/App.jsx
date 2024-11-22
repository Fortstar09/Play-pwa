import { useEffect, useState } from "react";
import db from "../src/appwrite/database";
import { Query } from "appwrite";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // read
    const response = await db.task.list([Query.orderDesc("$createdAt")]);

    setNotes(response.documents);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newNote = e.target.body.value;

    if (newNote === "") return;

    // Insert

    try {
      const payload = { note: newNote };
      console.log(payload);
      const response = await db.task.create(payload);
      console.log(response);
      setNotes((prev) => [response, ...prev]);
      e.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 py-10 px-10">
        <div>
          <h2 className="text-3xl font-bold text-sky-500 py-1">
            Black World App
          </h2>
          <p className="text-sm pb-4 text-slate-500">
            Write any thing you like.
          </p>
          <div className="w-32 h-0.5 bg-slate-100" />
        </div>
        <form onSubmit={handleAdd} className="flex flex-col gap-3 items-start">
          <textarea
            name="body"
            placeholder="Enter note"
            className="bg-sky-50 p-4 text-sm border-2 text-slate-900 border-sky-200 rounded-lg w-full max-w-96 h-40"
          ></textarea>
          <button
            type="submit"
            className="px-6 py-2 border-sky-200 rounded-md text-base bg-sky-500 hover:bg-sky-400 text-white"
          >
            Send
          </button>
        </form>
        <div className="mt-10">
          <h2 className="text-2xl bg-sky-500 p-3 max-w-96 text-white rounded-t-md">
            My Notes
          </h2>
          <div className="grid gap-4  grid-rows-5">
            {notes.map((note) => (
              <Note key={note.$id} noteData={note} setNotes={setNotes} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

// eslint-disable-next-line react/prop-types
function Note({ noteData, setNotes }) {
  const [note, setNote] = useState(noteData);

  const handleUpdate = async () => {
    const completed = !note.completed;
    db.task.update(note.$id, { completed });
    setNote({ ...note, completed: completed });
  };

  const handleDelete = async () => {
    console.log(note.$id);
    db.task.delete(note.$id);
    setNotes((prev) => prev.filter((i) => i.$id !== note.$id));
  };

  return (
    <div
      className={`${
        note.completed ? "bg-red-100" : "bg-slate-100"
      } relative px-2 py-4 my-6 rounded-md h-full max-w-96`}
      onClick={handleUpdate}
    >
      <p>{note.note}</p>
      <p
        className="absolute bottom-0 px-2 cursor-pointer py-1 text-2xl font-bold text-sky-600 right-0"
        onClick={handleDelete}
      >
        &times;
      </p>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000";
  const [isLoggedIn, setIsLoggedIn] = useState();

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/notes`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Note created successfully");
      fetchNotes();
    } catch (error) {
      setMessage("Failed to create note");
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      setMessage("Failed to fetch notes");
    }
  };

  return (
    <div>
      <h1>User Registration</h1>
      {!isLoggedIn && (
        <>
          <Register setMessage={setMessage} setIsLoggedIn={setIsLoggedIn} />
          <Login setMessage={setMessage} setIsLoggedIn={setIsLoggedIn} />
        </>
      )}
      {isLoggedIn && (
        <form>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={createNote}>Create Note</button>
        </form>
      )}
      {isLoggedIn && (
        <>
          <button onClick={fetchNotes}>Fetch Notes</button>
          <div>
            {notes.map((note, index) => (
              <div key={index}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <p>{note.createdAt}</p>
              </div>
            ))}
          </div>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default App;

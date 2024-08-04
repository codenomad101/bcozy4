import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000";
  const [isLoggedIn, setIsLoggedIn] = useState();

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Registration successful");
      setIsLoggedIn(true);
    } catch (error) {
      setMessage("Registration failed");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful");
    } catch (error) {
      setMessage("Login failed");
    }
  };

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
      <h1>User Registration and Notes</h1>
      {!isLoggedIn && (
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button onClick={register}>Register</button>
          {/* <button onClick={login}>Login</button> */}
        </form>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [questions, setQuestions] = useState([]);

    // Fetch users on mount
    useEffect(() => {
        axios.get('http://localhost:5001/users')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    // Fetch questions whenever the selected user changes
    useEffect(() => {
        if (selectedUser) {
            axios.get(`http://localhost:5001/questions/${selectedUser}`)
                .then((response) => setQuestions(response.data))
                .catch((error) => console.error('Error fetching questions:', error));
        }
    }, [selectedUser]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>User Questions</h1>
                <div>
                    <label htmlFor="user-select">Select a User: </label>
                    <select
                        id="user-select"
                        onChange={(e) => setSelectedUser(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            -- Select a User --
                        </option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedUser && (
                    <div>
                        <h2>Questions for User {users.find(user => user.id === parseInt(selectedUser))?.name}</h2>
                        <ul>
                            {questions.map((q) => (
                                <li key={q.id}>{q.question}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;

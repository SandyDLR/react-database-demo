import React, { useState, useEffect } from 'react';
import { T, LanguagePicker, useLocale } from '@transifex/react'; // Import useLocale
import { tx, t } from "@transifex/native"; // Import t for translations
import axios from 'axios';
import './App.css';

tx.init({
  token: '1/323de0a2d74334d916313a51f1a5d1def0b5d859', // Your Transifex token
});

// Set default language to English
tx.setCurrentLocale('en');

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [questions, setQuestions] = useState([]);

    const locale = useLocale(); // Get the currently selected locale

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
            {/* Language Picker Component */}
            <div className="language-picker-wrapper">
                <label htmlFor="language-picker" className="language-label">
                    <T _str="Select a language: " />
                </label>
                <LanguagePicker id="language-picker" />
            </div>

            <header className="App-header">
                <h1><T _str="User Questions" /></h1>
                <div>
                    <label htmlFor="user-select"><T _str="Select a User: " /></label>
                    <select
                        id="user-select"
                        onChange={(e) => setSelectedUser(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            <T _str="-- Select a User --" />
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
                        <h2>
                            <T _str="Questions for User" /> {users.find(user => user.id === parseInt(selectedUser))?.name}
                        </h2>
                        <ul>
                            {questions.map((q) => (
                                <li key={q.id}>
                                    {/* Use t() to translate dynamically and re-render when locale changes */}
                                    {t(`${q.id}.question`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;

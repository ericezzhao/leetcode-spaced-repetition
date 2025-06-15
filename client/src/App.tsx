import React, { useState, useEffect } from 'react';
import './App.css';
import { Problem, ProblemInput } from './types';

const CATEGORIES = [
  'Arrays & Strings',
  'Hashmaps & Sets',
  '2 Pointers',
  'Stacks',
  'Linked Lists',
  'Binary Search',
  'Sliding Window',
  'Trees',
  'Heaps',
  'Recursive Backtracking',
  'Graphs',
  'Dynamic Programming'
];

function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState<ProblemInput>({
    leetcodeId: 0,
    title: '',
    difficulty: 1,
    category: CATEGORIES[0]
  });

  useEffect(() => {
    fetchProblems();
    
    // Set up polling every second to check for problems that need to be moved to review queue
    const intervalId = setInterval(fetchProblems, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/problems');
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProblem),
      });
      if (response.ok) {
        setNewProblem({ leetcodeId: 0, title: '', difficulty: 1, category: CATEGORIES[0] });
        fetchProblems();
      }
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const handleRate = async (id: number, difficulty: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/problems/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty }),
      });
      if (response.ok) {
        fetchProblems();
      }
    } catch (error) {
      console.error('Error rating problem:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/problems/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProblems();
        }
      } catch (error) {
        console.error('Error deleting problem:', error);
      }
    }
  };

  const getReviewQueue = () => {
    return problems.filter(p => !p.nextReview);
  };

  const getCurrentProblems = () => {
    const now = new Date();
    return problems.filter(p => p.nextReview && new Date(p.nextReview) > now);
  };

  return (
    <div className="App">
      <h1>LCanki</h1>
      <form onSubmit={handleSubmit} className="add-problem-form">
        <input
          type="number"
          value={newProblem.leetcodeId || ''}
          onChange={(e) => setNewProblem({ ...newProblem, leetcodeId: Number(e.target.value) })}
          placeholder="LeetCode ID"
          required
        />
        <input
          type="text"
          value={newProblem.title}
          onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
          placeholder="Problem Title"
          required
        />
        <select
          value={newProblem.category}
          onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
          required
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={newProblem.difficulty}
          onChange={(e) => setNewProblem({ ...newProblem, difficulty: Number(e.target.value) })}
          required
        >
          <option value={1}>Easy</option>
          <option value={2}>Medium</option>
          <option value={3}>Hard</option>
        </select>
        <button type="submit">Add Problem</button>
      </form>

      <div className="review-queue">
        <h2>Review Queue</h2>
        {getReviewQueue().map(problem => (
          <div key={problem.id} className="problem-card">
            <div className="problem-header">
              <h3>
                <a
                  href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.leetcodeId}. {problem.title}
                </a>
              </h3>
              <button className="delete-button" onClick={() => handleDelete(problem.id)}>×</button>
            </div>
            <p>Category: {problem.category}</p>
            <p>Difficulty: {problem.difficulty === 1 ? 'Easy' : problem.difficulty === 2 ? 'Medium' : 'Hard'}</p>
            <div className="rating-buttons">
              <button onClick={() => handleRate(problem.id, 1)}>1</button>
              <button onClick={() => handleRate(problem.id, 2)}>2</button>
              <button onClick={() => handleRate(problem.id, 3)}>3</button>
              <button onClick={() => handleRate(problem.id, 4)}>4</button>
              <button onClick={() => handleRate(problem.id, 5)}>5</button>
            </div>
          </div>
        ))}
      </div>

      <div className="current-problems">
        <h2>Problems Completed</h2>
        {getCurrentProblems().map(problem => (
          <div key={problem.id} className="problem-card">
            <div className="problem-header">
              <h3>
                <a
                  href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.leetcodeId}. {problem.title}
                </a>
              </h3>
              <button className="delete-button" onClick={() => handleDelete(problem.id)}>×</button>
            </div>
            <p>Category: {problem.category}</p>
            <p>Difficulty: {problem.difficulty === 1 ? 'Easy' : problem.difficulty === 2 ? 'Medium' : 'Hard'}</p>
            <p>Next Review: {new Date(problem.nextReview!).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
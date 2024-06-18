import React, { useEffect, useState } from 'react';
import { FaSearch, FaMoon, FaSun } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json();
    const top5StoryIds = storyIds.slice(0, 5);
    const storyPromises = top5StoryIds.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json()));
    const stories = await Promise.all(storyPromises);
    setStories(stories);
  };

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <div className="flex items-center mb-4">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <ul className="space-y-4">
          {filteredStories.map(story => (
            <li key={story.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p className="text-sm">Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Read more</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
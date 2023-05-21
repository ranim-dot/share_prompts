'use client'

import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagCLick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagCLick={handleTagCLick}
        />
      ))}
    </div>
  );
};

const Feed = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [posts, setPosts] = useState([]);

  
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
      
    }
    
    useEffect(() => {
    fetchPosts();
  },[])

  const filterPrompts = (searchtext)=>{
    const regex = new RegExp(searchtext,'i');
    return posts.filter(
      (item) => 
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    );
  }

  const handleSearchEngine = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);

  };

  const handleTagCLick = (tag) => {
    setSearchText(tag)
    const searchResult = filterPrompts(tag);
    setSearchedResults(searchResult);

  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchEngine}
          required
          className='search_input peer'
        />
      </form>
      {searchText ? (<PromptCardList data={searchedResults} handleTagCLick={handleTagCLick} />):(<PromptCardList data={posts} handleTagCLick={handleTagCLick} />)}
      
    </section>
  )
}

export default Feed
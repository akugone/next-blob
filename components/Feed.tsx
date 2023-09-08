'use client';

import { useState, useEffect, useMemo } from 'react';
import HintCardList from './HintCardList';
import HintApiRepository from '@/utils/HintApiRepository';
// for the prisma typing
import prisma from '@prisma/client';

type HintWithAuthor = prisma.Hint & {
  author: prisma.User;
};

const Feed = () => {
  //store all posts
  const [allPosts, setAllPosts] = useState<HintWithAuthor[]>([]);
  console.log('allPosts', allPosts);

  // Search states
  const [searchText, setSearchText] = useState(null);

  // fetch all posts when the component is mounted
  useEffect(() => {
    async function fetchHints() {
      const data = await HintApiRepository.findAll();
      setAllPosts(data);
    }
    fetchHints();
  }, []);

  /**
   * Filters the posts based on the search text.
   * @param {string} searchtext - The text to search for.
   * @returns {Array} - An array of posts that match the search text.
   */
  const filterHints = (searchtext: string) => {
    const regex = new RegExp(searchtext, 'i'); // 'i' flag for case-insensitive search
    return allPosts.filter(
      item =>
        regex.test(item.author.name) ||
        (item.tags && regex.test(item.tags)) ||
        regex.test(item.hint),
    );
  };

  /**
   * Handles the change event of the search input field.
   * @param {Object} e - The event object.
   */
  const handleSearchChange = e => {
    // clearTimeout(searchTimeout);
    setSearchText(e.target.value);
  };

  const filteredHints = useMemo(() => {
    // add a debounce function
    console.log('searchText', searchText);

    if (!searchText) {
      return allPosts;
    }

    return filterHints(searchText);
  }, [searchText, allPosts]);

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);
  };

  console.log('filteredHints', filteredHints);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      <HintCardList data={filteredHints} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;

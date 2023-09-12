const resource = '/api/hint';
import type { Hint, User } from '@prisma/client';

export type HintWithAuthor = Hint & {
  author: User;
};

// Get all the posts from the database
const findAll = async (): Promise<HintWithAuthor[]> => {
  const response = await fetch(resource);
  const data = await response.json();

  // then store the data in the allPosts
  return data;
};

// Get all one post from the database
const findUnique = async (hintId: string): Promise<HintWithAuthor> => {
  const response = await fetch(`${resource}/${hintId}`);
  const data = await response.json();

  // then store the data in the allPosts
  return data;
};

// create a anew hint in the database with the route api/hint/new
export const create = async (hint: string, tag: string) => {
  const response = await fetch(`${resource}/new`, {
    method: 'POST',
    body: JSON.stringify({
      hint: hint,
      tag: tag,
    }),
  });

  if (response.status != 201) {
    throw new Error('Failed to create hint');
  }

  return await response.json();
};

// delete a hint in the database with the route api/hint/delete
export const deleteHint = async (hintId: string) => {
  const response = await fetch(`${resource}/${hintId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return response.json();
  }
};

const HintApiRepository = {
  findAll: findAll,
  findUnique: findUnique,
  create: create,
  deleteHint: deleteHint,
};

export default HintApiRepository;

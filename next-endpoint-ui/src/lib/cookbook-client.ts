// Client-safe exports for cookbook (no Node.js dependencies)

export type Author = {
  name: string;
  username: string;
  avatar: string;
};

export type CookbookItem = {
  id: string;
  title: string;
  href: string;
  date: string;
  tags: string[];
  authors: Author[];
};


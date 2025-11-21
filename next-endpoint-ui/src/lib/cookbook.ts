import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

export type CookbookFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  authors: Array<{
    name: string;
    username: string;
  }>;
};

// Get avatar path from username
export function getAvatarPathForAuthor(username: string): string {
  // Try common image extensions
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
  const publicAvatarsPath = path.join(process.cwd(), "public", "avatars");
  
  for (const ext of extensions) {
    const filePath = path.join(publicAvatarsPath, `${username}${ext}`);
    if (fs.existsSync(filePath)) {
      return `/avatars/${username}${ext}`;
    }
  }
  
  // Fallback to a default avatar or placeholder
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
}

// Internal function used in getAllCookbookItems
function getAvatarPath(username: string): string {
  return getAvatarPathForAuthor(username);
}

// Server-only: uses Node.js fs module
export function getCookbookContent(itemId: string): { content: string; data: CookbookFrontmatter } | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "cookbook",
      `${itemId}.mdx`
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    
    return {
      content,
      data: data as CookbookFrontmatter,
    };
  } catch {
    return null;
  }
}

// Get all cookbook items by reading MDX files
export function getAllCookbookItems(): CookbookItem[] {
  try {
    const cookbookDir = path.join(
      process.cwd(),
      "src",
      "content",
      "cookbook"
    );
    
    const files = fs.readdirSync(cookbookDir);
    const items: CookbookItem[] = [];
    
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      
      const itemId = file.replace(/\.mdx$/, "");
      const result = getCookbookContent(itemId);
      
      if (!result) continue;
      
      const { data } = result;
      
      // Map authors with avatar paths
      const authors: Author[] = (data.authors || []).map((author) => ({
        name: author.name,
        username: author.username,
        avatar: getAvatarPath(author.username),
      }));
      
      items.push({
        id: itemId,
        title: data.title || itemId,
        href: `/cookbook/${itemId}`,
        date: data.date || "",
        tags: data.tags || [],
        authors,
      });
    }
    
    // Sort by date (newest first)
    return items.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch {
    return [];
  }
}

// Client-safe: only uses the cookbookItems array
export function getCookbookItemById(itemId: string): CookbookItem | undefined {
  const items = getAllCookbookItems();
  return items.find((item) => item.id === itemId);
}


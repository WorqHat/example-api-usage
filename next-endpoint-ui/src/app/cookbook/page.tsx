import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { getAllCookbookItems } from "@/lib/cookbook";
import AvatarImage from "@/components/AvatarImage";

export default async function CookbookPage() {
  const cookbookItems = getAllCookbookItems();
  const topics = [
    { label: "Agents", gradient: "from-pink-500 to-orange-500" },
    { label: "Multimodal", gradient: "from-blue-400 to-pink-400" },
    { label: "Text", gradient: "from-green-500 to-emerald-600" },
    { label: "Guardrails", gradient: "from-purple-500 to-purple-700" },
    { label: "Optimization", gradient: "bg-orange-500" },
    { label: "Workflows", gradient: "bg-blue-500" },
  ];

  const tagColors: Record<string, string> = {
    REASONING: "bg-yellow-400 text-black",
    RESPONSES: "bg-lime-400 text-black",
    FUNCTIONS: "bg-purple-500 text-white",
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen">
        {/* Patterned Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px),
              repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)
            `,
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050A30] to-black" />
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <h1 className="mb-12 text-5xl font-bold text-white">Topics</h1>
          <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.label}
                className={`aspect-[4/3] rounded-lg ${
                  topic.gradient.includes("from")
                    ? `bg-gradient-to-br ${topic.gradient}`
                    : topic.gradient
                } flex items-center justify-center p-6 transition-transform hover:scale-105`}
              >
                <span className="text-2xl font-bold text-white">{topic.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cookbookItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 transition-all hover:border-white/20 hover:bg-black/60"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-white/60">{item.date}</span>
                  <div className="flex -space-x-2">
                    {item.authors.map((author, i) => {
                      const avatarPath = author.avatar.startsWith("/") 
                        ? author.avatar 
                        : `/avatars/${author.username}.jpg`;
                      return (
                        <div
                          key={i}
                          className="relative h-8 w-8 rounded-full border-2 border-black overflow-hidden"
                        >
                          <AvatarImage
                            src={avatarPath}
                            alt={author.name}
                            username={author.username}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        tagColors[tag] || "bg-gray-700 text-white"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}


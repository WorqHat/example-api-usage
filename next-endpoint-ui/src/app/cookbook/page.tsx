import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { getAllCookbookItems } from "@/lib/cookbook";
import AvatarImage from "@/components/AvatarImage";
import TopicCard from "@/components/TopicCard";

export default async function CookbookPage() {
  const cookbookItems = getAllCookbookItems();
  const topics = [
    { label: "Agents", image: "/topics/agents.jpg" },
    { label: "Multimodal", image: "/topics/multimodal.jpg" },
    { label: "Text", image: "/topics/text.jpg" },
    { label: "Guardrails", image: "/topics/guardrails.jpg" },
    { label: "Optimization", image: "/topics/optimization.jpg" },
    { label: "Workflows", image: "/topics/workflows.jpg" },
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
          <div className="mb-16 grid grid-cols-2 gap-3 md:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.label}
                label={topic.label}
                image={topic.image}
              />
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
                      // Ensure we're using the correct avatar path
                      const avatarPath = author.avatar || `/avatars/${author.username}.jpg`;
                      return (
                        <div
                          key={i}
                          className="relative h-8 w-8 rounded-full border-2 border-black overflow-hidden bg-white/10"
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


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

          {/* Starter template section */}
          <section className="mb-16 grid gap-6 rounded-3xl border border-white/10 bg-black/50 p-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Featured workflow
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Daily Revenue Briefing Template
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Automate the 09:00 executive revenue email end-to-end. This template includes
                the time-based trigger, data query, Text Gen analysis, graph rendering, and final delivery nodes already wired up in WorqHat.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li>• Structured JSON metrics for charts and KPIs</li>
                <li>• Inline graphs and executive summary</li>
                <li>• Action items generated from live performance</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {["WORKFLOWS", "AUTOMATION", "ANALYTICS"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-6">
              <div>
                <p className="text-sm text-white/60">Ready-made WorqHat workflow</p>
                <p className="mt-2 text-lg font-semibold text-white">Deploy in minutes:</p>
                <ol className="mt-3 space-y-2 text-sm text-white/70 marker:text-white/60">
                  <li>1. Duplicate the workflow template</li>
                  <li>2. Point queries to your sales datasource</li>
                  <li>3. Update recipients and brand copy</li>
                </ol>
              </div>
              <Link
                href="/cookbook/gpt-5-1-prompting-guide"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FDCEB0] px-4 py-3 text-sm font-semibold text-[#050A30] transition hover:bg-[#ffdcb6]"
              >
                Get started with this template
              </Link>
            </div>
          </section>

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


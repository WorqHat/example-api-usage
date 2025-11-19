import PageLayout from "@/components/PageLayout";

export default function CookbookPage() {
  const topics = [
    { label: "Agents", gradient: "from-pink-500 to-orange-500" },
    { label: "Multimodal", gradient: "from-blue-400 to-pink-400" },
    { label: "Text", gradient: "from-green-500 to-emerald-600" },
    { label: "Guardrails", gradient: "from-purple-500 to-purple-700" },
    { label: "Optimization", gradient: "bg-orange-500" },
    { label: "Workflows", gradient: "bg-blue-500" },
  ];

  const cookbookItems = [
    {
      date: "Nov 13, 2025",
      tags: ["REASONING", "RESPONSES"],
      title: "GPT-5.1 Prompting Guide",
      authors: 1,
    },
    {
      date: "Aug 7, 2025",
      tags: ["REASONING", "RESPONSES"],
      title: "GPT-5 prompting guide",
      authors: 3,
    },
    {
      date: "Aug 7, 2025",
      tags: ["FUNCTIONS", "REASONING"],
      title: "GPT-5 New Params and Tools",
      authors: 2,
    },
    {
      date: "Aug 7, 2025",
      tags: ["REASONING", "RESPONSES"],
      title: "Frontend coding with GPT-5",
      authors: 3,
    },
    {
      date: "Aug 7, 2025",
      tags: ["REASONING", "RESPONSES"],
      title: "GPT-5 Prompt Migration and Improvement Using the New...",
      authors: 1,
    },
  ];

  const tagColors: Record<string, string> = {
    REASONING: "bg-yellow-400 text-black",
    RESPONSES: "bg-green-400 text-black",
    FUNCTIONS: "bg-purple-500 text-white",
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
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

        <h2 className="mb-8 text-5xl font-bold text-white">WorqHat</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cookbookItems.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-white/10 bg-gray-900 p-6 transition-colors hover:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-white/60">{item.date}</span>
                <div className="flex -space-x-2">
                  {Array.from({ length: item.authors }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full bg-blue-500 border-2 border-gray-900"
                    />
                  ))}
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
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}


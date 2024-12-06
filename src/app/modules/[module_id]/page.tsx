import { getChaptersByModuleId } from "@/app/api/modules";

interface Props {
  params: {
    module_id: string;
  };
}

export default async function Example({ params: { module_id } }: Props) {
  const chapters = await getChaptersByModuleId(module_id);
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Chapters
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ul role="list" className="divide-y divide-gray-200">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="py-4">
                <a
                  href={`${module_id}/${chapter.id}`}
                  className="text-blue-500 hover:underline"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {chapter.title}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {chapter.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

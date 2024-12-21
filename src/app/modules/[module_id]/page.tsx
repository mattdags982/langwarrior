import { getChaptersByModuleId } from "@/app/api/modules";
import Link from "next/link";

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
              <li key={chapter.id} className="py-8">
                <Link
                  href={`${module_id}/${chapter.id}`}
                  className="text-blue-500"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {chapter.title}
                  </p>
                </Link>
                <div className="flex flex-row gap-4">
                  <Link
                    href={`${module_id}/${chapter.id}/read`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Read
                  </Link>
                  <Link
                    href={`${module_id}/${chapter.id}/listen`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Listen
                  </Link>
                  <Link
                    href={`${module_id}/${chapter.id}/write`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Write
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
          <p className="mt-2 text-sm text-gray-600">Select a chapter to begin reading</p>
        </header>
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <ul role="list" className="divide-y divide-gray-100">
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <Link
                  href={`${module_id}/${chapter.id}/read`}
                  className="block hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900 capitalize">
                            {chapter.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

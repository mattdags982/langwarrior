import { getAllModules } from "@/app/api/modules";

// export const fetchCache = "default-no-store";

interface PageProps {
  params: {
    languageCode: string;
  };
}

export default async function Example({ params }: PageProps) {
  const modules = await getAllModules(params.languageCode);
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Modules</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className="relative bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-gray-300 overflow-hidden"
            >
              <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="p-6">
                <a href={`modules/${module.id}`} className="block focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                    {module.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </a>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11c0 .369.27.68.635.737A7.465 7.465 0 015 15.5c1.61 0 3.09.59 4.25 1.32V4.065z" />
                  </svg>
                  Click to view chapters
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

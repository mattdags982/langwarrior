import { getAllModules } from "@/app/api/modules";

// export const fetchCache = "default-no-store";

export default async function Example() {
  const modules = await getAllModules();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {modules.map((module) => (
        <div
          key={module.id}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 sm:mt-40 sm:h-40 sm:col-start-2"
        >
          <div className="min-w-0 flex-1">
            <a href={`modules/${module.id}`} className="focus:outline-none">
              <span aria-hidden="true" className="absolute inset-0" />
              <p className="text-sm font-medium text-gray-900">
                {module.title}
              </p>
              <p className="truncate sm:text-wrap sm:mt-2 text-sm text-gray-500">
                {module.description}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

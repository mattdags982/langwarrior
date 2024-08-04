import { getChapterById } from "@/app/api/modules";
import AudioPlayer from "@/app/components/AudioPlayer";

interface Props {
  params: {
    module_id: string;
    chapter_id: string;
  };
}

export default async function Example({
  params: { module_id, chapter_id },
}: Props) {
  const chapter = await getChapterById(chapter_id, "es");
  return (
    <>
      <div className="py-10 mb-14">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {chapter.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{chapter.description}</p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <ul role="list" className="divide-y divide-gray-200">
              {chapter.blurbs.map((blurb) => (
                <li key={blurb.id} className="py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {blurb.characterName}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {blurb.contentEnglish}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <AudioPlayer audioSrc="/audio/next.mp3" />
    </>
  );
}

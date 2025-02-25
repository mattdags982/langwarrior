import { getChapterById } from "@/app/api/modules";
import AudioPlayer from "@/app/components/AudioPlayer";
import BlurbRead from "@/app/components/BlurbRead";

interface Props {
  params: {
    module_id: string;
    chapter_id: string;
    languageCode: string;
  };
}

export default async function Example({
  params: { module_id, chapter_id, languageCode },
}: Props) {
  const chapter = await getChapterById(chapter_id, languageCode);
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="py-10 mb-14">
          <header className="mb-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {chapter.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {chapter.description}
              </p>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <ul role="list" className="space-y-8">
                {chapter.blurbs.map((blurb) => (
                  <li key={blurb.id} className="prose prose-lg max-w-none prose-p:mt-2 prose-p:mb-2">
                    <BlurbRead blurb={blurb} languageCode={languageCode} />
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
      <AudioPlayer audioId={chapter.audioLink!} />
    </>
  );
}

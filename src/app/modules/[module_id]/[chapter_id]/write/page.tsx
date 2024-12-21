import { getChapterById } from "@/app/api/modules";
import AudioPlayer from "@/app/components/AudioPlayer";
import BlurbWrite from "@/app/components/BlurbWrite";

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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {chapter.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{chapter.description}</p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <ul role="list">
              {chapter.blurbs.map((blurb) => (
                <BlurbWrite blurb={blurb} key={blurb.id} />
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

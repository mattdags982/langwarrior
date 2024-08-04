import prisma from "../../../lib/prisma";

export async function getAllModules() {
  const modules = await prisma.module.findMany({
    include: {
      chapters: true,
    },
  });
  return modules;
}

export async function getChaptersByModuleId(id: string) {
  const chapters = await prisma.chapter.findMany({
    where: {
      moduleId: id,
    },
  });
  return chapters;
}

export async function getChapterById(id: string, lang: string) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: id,
    },
    include: {
      blurbs: {
        include: {
          translations: {
            where: {
              languageCode: lang,
            },
          },
        },
      },
    },
  });
  if (!chapter) {
    throw new Error(`Chapter with id ${id} not found`);
  }
  return chapter;
}

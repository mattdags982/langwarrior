import prisma from "../../../lib/prisma";

export async function getAllModules(languageCode: string) {
  const modules = await prisma.module.findMany({
    where: {
      chapters: {
        some: {
          blurbs: {
            some: {
              translations: {
                some: {
                  languageCode: languageCode
                }
              }
            }
          }
        }
      }
    },
    include: {
      chapters: {
        include: {
          blurbs: {
            include: {
              translations: {
                where: {
                  languageCode: languageCode
                }
              }
            }
          }
        }
      }
    }
  });
  return modules;
}

export async function getChaptersByModuleId(id: string, languageCode: string) {
  const moduleWithChapters = await prisma.module.findUnique({
    where: {
      id: id,
    },
    include: {
      chapters: {
        where: {
          blurbs: {
            some: {
              translations: {
                some: {
                  languageCode: languageCode
                }
              }
            }
          }
        },
        include: {
          blurbs: {
            include: {
              translations: {
                where: {
                  languageCode: languageCode
                }
              }
            }
          }
        }
      }
    }
  });

  if (!moduleWithChapters) {
    throw new Error(`Module with id ${id} not found`);
  }

  return {
    chapters: moduleWithChapters.chapters,
    moduleTitle: moduleWithChapters.title,
    moduleDescription: moduleWithChapters.description
  };
}

export async function getChapterById(id: string, lang: string) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: id,
    },
    include: {
      blurbs: {
        orderBy: {
          sequence: 'asc'
        },
        include: {
          translations: true
        },
      },
    },
  });

  if (!chapter) {
    throw new Error(`Chapter with id ${id} not found`);
  }

  const hasAllTranslations = chapter.blurbs.every(
    blurb => blurb.translations.some(t => t.languageCode === lang)
  );

  if (!hasAllTranslations) {
    throw new Error(`Some blurbs are missing translations for language: ${lang}`);
  }

  return {
    ...chapter,
    blurbs: chapter.blurbs.map(blurb => ({
      ...blurb,
      translations: blurb.translations.filter(t => t.languageCode === lang)
    }))
  };
}

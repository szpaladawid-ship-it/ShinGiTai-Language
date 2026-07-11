const PROJECTS = {
  en: "core_languages_english",
  english: "core_languages_english",
  no: "core_languages_norwegian",
  nb: "core_languages_norwegian",
  nn: "core_languages_norwegian",
  norwegian: "core_languages_norwegian",
  ja: "core_languages_japanese",
  japanese: "core_languages_japanese",
  pl: "core_languages_polish",
  polish: "core_languages_polish",
} as const;

export const LANGUAGE_CORE_PROJECTS = new Set(["core_languages", ...Object.values(PROJECTS)]);

export function resolveLanguageCoreProject(language: string): string {
  return PROJECTS[language.trim().toLowerCase() as keyof typeof PROJECTS] ?? "core_languages";
}

export function assertLanguageCoreProject(project: string): string {
  if (!LANGUAGE_CORE_PROJECTS.has(project)) throw new Error("Core project is not allowed");
  return project;
}

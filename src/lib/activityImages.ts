// imports all images in the folder and returns an object mapping filenames to URLs
const modules = import.meta.glob("../assets/activities/*.{png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});

export const activityImageByFile: Record<string, string> = {};

for (const path in modules) {
  const fileName = path.split("/").pop();
  if (!fileName) continue;

  activityImageByFile[fileName] = modules[path] as string;
}


import { getTranslations } from "next-intl/server";

export default async function ParentLinkNotFound() {
  const t = await getTranslations("parent");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-xl font-bold text-gray-900">{t("linkInvalid")}</h1>
      <p className="text-sm text-gray-600">{t("linkInvalidDesc")}</p>
    </div>
  );
}

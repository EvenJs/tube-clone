import { CategoriesSection } from "../sections/category-section";
import { VideosSection } from "../sections/videos-section";

interface HomeViewProps {
  categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] max-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
      <VideosSection categoryId={categoryId} />
    </div>
  );
};

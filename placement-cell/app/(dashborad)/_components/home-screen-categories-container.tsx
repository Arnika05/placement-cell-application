"use client";

import Box from "@/components/box";
import { Card } from "@/components/ui/card";
import { iconMapping, IconName } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface HomeSearchCategoriesConatinerProps {
  categories: Category[];
}

const Icon = ({ name }: { name: IconName }) => {
  const IconComponent = iconMapping[name];
  return IconComponent ? <IconComponent className="w-6 h-6 text-blue-600" /> : null;
};

const CategoryListItemCard = ({ data }: { data: Category }) => {
  const router = useRouter();

  const handleClick = (categoryId: string) => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: { categoryId: categoryId || undefined },
    });
    router.push(href);
  };

  return (
    <Card
      onClick={() => handleClick(data.id)}
      className="flex items-center gap-4 p-4 border border-gray-200 shadow-md rounded-lg hover:bg-gray-100 hover:scale-105 transition-all cursor-pointer bg-white"
    >
      <Icon name={data.name as IconName} />
      <span className="text-lg font-semibold text-gray-800">{data.name}</span>
      <ChevronRight className="ml-auto text-gray-500" />
    </Card>
  );
};

const HomeSearchCategoriesConatiner = ({ categories }: HomeSearchCategoriesConatinerProps) => {
  return (
    <Box className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((item) => (
          <CategoryListItemCard key={item.id} data={item} />
        ))}
      </div>
    </Box>
  );
};

export default HomeSearchCategoriesConatiner;

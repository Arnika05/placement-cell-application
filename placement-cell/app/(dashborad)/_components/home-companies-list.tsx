"use client";

import Box from "@/components/box";
import { Card } from "@/components/ui/card";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";

interface HomeCompaniesListProps {
  companies: Company[];
}

const CompanyListItemCard = ({ company }: { company: Company }) => {
  const router = useRouter();
  
  return (
    <Card
      onClick={() => router.push(`/companies/${company.id}`)}
      className="p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg hover:scale-105 transition duration-200 cursor-pointer bg-white"
    >
      <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
    </Card>
  );
};

export const HomeCompaniesList = ({ companies }: HomeCompaniesListProps) => {
  return (
    <Box className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {companies.map((item) => (
          <CompanyListItemCard company={item} key={item.id} />
        ))}
      </div>
    </Box>
  );
};

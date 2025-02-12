import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const JobsPageOverview = () => {
    return ( 
        <div className="p-6">
            <div className="flex justify-end"> {/* Aligns to the right */}
                <Link href={"/admin/create"}>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition rounded-lg shadow-md">
                        <Plus className="w-5 h-5 mr-2" />
                        New Job
                    </Button>
                </Link>
            </div>

            {/* data table */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                Data Table Placeholder
            </div>
        </div>
    );
}
 
export default JobsPageOverview;

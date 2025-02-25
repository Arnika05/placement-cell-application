"use client";

import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarRouteItem } from "./sidebar-route-item";
import Box from "@/components/box";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DateFilter } from "./date-filter";
import { CheckBoxContainer } from "./checkbox-container";
import qs from "query-string";

const adminRoutes = [
    { icon: List, label: "Jobs", href: "/admin/jobs" },
    { icon: List, label: "Companies", href: "/admin/companies" },
    { icon: Compass, label: "Analytics", href: "/admin/analytics" },
];

const guestRoutes = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Search", href: "/search" },
    { icon: User, label: "Profile", href: "/user" },
    { icon: BookMarked, label: "Saved Jobs", href: "/savedJobs" },
];

const employmentData = [
    { label: "2M", value: "2M" },
    { label: "6M", value: "6M" },
    { label: "FTE", value: "FTE" },
    { label: "6M+FTE", value: "6M+FTE" },
];

const jobModeData = [
    { label: "Office", value: "Office" },
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
];

const eligibleCoursesData = [
    { label: "CSE", value: "B.Tech - Computer Science and Engineering" },
    { label: "EE", value: "B.Tech - Electrical Engineering" },
    { label: "ME", value: "B.Tech - Mechanical Engineering" },
    { label: "Civil", value: "B.Tech - Civil Engineering" },
    { label: "ECE", value: "B.Tech - Electronics and Communication Engineering" },
    { label: "Chemical", value: "B.Tech - Chemical Engineering" },
    { label: "MSME", value: "B.Tech - Materials and Metallurgical Engineering" },
    { label: "MDS", value: "B.Tech + M. Tech - Mathematics and Data Science Engineering" },
    { label: "B.Arch", value: "B.Arch" },
    { label: "B.Planning", value: "B.Planning" },
];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isAdminPage = pathname?.startsWith("/admin");
    const isSearchPage = pathname?.startsWith("/search");

    const routes = isAdminPage ? adminRoutes : guestRoutes;

    const handleFilterChange = (key: string, values: string[]) => {
        const { query } = qs.parseUrl(window.location.href);
    
        const updatedQueryParams = {
            ...query,
            [key]: values.length > 0 ? values.join(",") : undefined,
        };
    
        const newUrl = qs.stringifyUrl({ url: pathname, query: updatedQueryParams }, { skipNull: true, skipEmptyString: true });
    
        router.push(newUrl);
    };
    

    return (
        <div className="w-[175px] min-h-screen bg-white flex flex-col ml-1">
            {/* Sidebar Routes */}
            {routes.map((route) => (
                <SidebarRouteItem 
                    key={route.href} 
                    icon={route.icon} 
                    label={route.label} 
                    href={route.href} 
                    
                />
            ))}

            {isSearchPage && (
                <Box className="px-4 py-2 mt-2">
                    {/* Filters Section */}
                    <div className="flex flex-col space-y-4 pt-4">
                        <h2 className="text-lg font-semibold underline text-muted-foreground">Filters</h2>
                        <Separator className="my-2" />

                        {/* Date Filter */}
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-md font-medium text-muted-foreground">Date</h2>
                            <DateFilter />
                        </div>
                        <Separator className="my-2" />

                        {/* Employment Type Filter */}
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-md font-medium text-muted-foreground">Employment Type</h2>
                            <CheckBoxContainer 
                                data={employmentData} 
                                onChange={(values) => handleFilterChange("employmentType", values)} 
                            />
                        </div>
                        <Separator className="my-2" />

                        {/* Job Mode Filter */}
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-md font-medium text-muted-foreground">Job Mode</h2>
                            <CheckBoxContainer 
                                data={jobModeData} 
                                onChange={(values) => handleFilterChange("jobMode", values)} 
                            />
                        </div>
                        <Separator className="my-2" />

                        {/* Eligible Courses Filter */}
                        {/* <div className="flex flex-col space-y-2">
                            <h2 className="text-md font-medium text-muted-foreground">Eligible Courses</h2>
                            <CheckBoxContainer 
                                data={eligibleCoursesData} 
                                onChange={(values) => handleFilterChange("eligibleCourses", values)} 
                            />
                        </div> */}
                    </div>
                </Box>
            )}
        </div>
    );
};

import { Skeleton } from "@/components/ui/skeleton"

export function MySkeleton({ lines, size = [], sideList }) {
    if (lines && typeof lines === 'number') {
        return (
            <div className="flex flex-col justify-start items-start space-y-4">
                {Array.from({ length: lines }, (_, index) => (
                    <Skeleton key={index} className={`h-4`} style={{ width: `${size[index] || '200px'}` }} />
                ))}
            </div>
        );
    }

    if (sideList) {
        return (
            <div className="flex items-center space-x-4 relative my-10">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[220px]" />
                    <Skeleton className="h-4 w-[180px]" />
                </div>
                <Skeleton className="h-12 w-12 bg-[#1b2231] absolute group-hover:bg-[#1b2231] right-[-55px] z-10 rounded-full p-2 border-2 border-white" />
            </div>
        )
    }

    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

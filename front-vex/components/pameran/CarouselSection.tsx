import Link from "next/link";
import ProjectCard from "@/components/shared/ui/ProjectCard";

export default function CarouselSection({ data, href, emblaRef }: any) {
  return (
    <div className="autoMid  overflow-hidden mt-6" ref={emblaRef}>
      <div className="flex gap-5">
        {data.map((item: any) => (
          <div
            key={item.id}
            className="flex-[0_0_100%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_30%]"
          >
            <Link href={`${href}${item.id}`}>
              <ProjectCard className="text-white" project={item} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

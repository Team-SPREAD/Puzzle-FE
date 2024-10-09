import Link from 'next/link';

interface ProjectGridProps {
    projects: { id: string; name: string; teamId: string | null }[];
    buttonColor: string;
    rooms: string[];
}

export default function ProjectGrid({ projects, buttonColor, rooms }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[2/3] flex items-center justify-center">
                <button
                    style={{ backgroundColor: buttonColor }}
                    className="w-3/4 h-3/4 flex items-center justify-center text-white text-6xl rounded-md hover:opacity-90 transition-opacity duration-200"
                >
                    +
                </button>
            </div>
            {projects.map((project, index) => (
                <Link key={project.id} href={`/board/${rooms[index] || project.id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 aspect-[2/3] p-6 flex flex-col justify-between cursor-pointer transform hover:scale-105">
                        <div>
                            <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-500">
                                {project.teamId ? '팀 프로젝트' : '개인 프로젝트'}
                            </p>
                        </div>
                        <div
                            className="w-full h-1 mt-4"
                            style={{ backgroundColor: project.teamId ? buttonColor : 'gray' }}
                        >

                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
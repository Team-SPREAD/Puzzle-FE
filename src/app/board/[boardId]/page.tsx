import Room from "@/components/Room";
// import useAuth from "@/hooks/useAuth";

const BoardIdPage = ({
    params,
}: {
    params: {
        boardId: string;
    };
}) => {
    // useAuth();
    console.log("searchParams", params.boardId);
    return (
        <main className="w-full h-full relative bg-surface-canvas touch-none">
            <Room roomId={params.boardId} />
        </main>
    );
};

export default BoardIdPage;

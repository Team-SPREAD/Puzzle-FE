import Room from "@/components/Room";
// import Header from "@/components/Board/Header";

const BoardPage = ({
    params,
}: {
    params: {
        boardId: string;
    };
}) => {
    return (
        <main className="relative h-full w-full touch-none bg-surface-canvas">
            {/* <Header projectName={params.boardId} /> */}
            <Room roomId={params.boardId} />
        </main>
    );
};

export default BoardPage;

interface MyNode {
    actor: string;
    name: string;
}

const MyNodeComponent: React.FC<{ node: MyNode }> = ({ node }) => {
    return (
        <div className="initechNode">
            {node?.name || "Unknown"}
        </div>
    );
};

export default MyNodeComponent;

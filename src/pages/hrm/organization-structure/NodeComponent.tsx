interface MyNode {
    actor: string;
    name: string;
}

const MyNodeComponent: React.FC<{ node: MyNode }> = ({ node }) => {
    return (
        <div className="initechNode">
            {node.name}
        </div>
    );
};

export default MyNodeComponent;


import { useTranslation } from 'react-i18next';

interface MyNode {
    actor: string;
    name: string;
    className: string;
}

const MyNodeComponent: React.FC<{ node: MyNode }> = ({ node }) => {
    const { t } = useTranslation();
    return (
        <div className={`initechNode ${node?.className}`}>
            <h1>{node?.name || "Unknown"}</h1>
        </div>
    );
};

export default MyNodeComponent;

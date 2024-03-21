
import { useTranslation } from 'react-i18next';

interface MyNode {
    actor: string;
    name: string;
    className: string;
    description: string;
}

const MyNodeComponent: React.FC<{ node: MyNode }> = ({ node }) => {
    const { t } = useTranslation();
    return (
        <div className={`initechNode ${node?.className} inline-flex`}>
            <img className='avatar col' src={node?.avatar} />
            <div className="">
                <p>{node?.name || "Unknown"}</p>
                <p>{node?.description || ""}</p>
            </div>

        </div>
    );
};

export default MyNodeComponent;

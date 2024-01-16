
import { useTranslation } from 'react-i18next';

interface MyNode {
    actor: string;
    name: string;
}

const MyNodeComponent: React.FC<{ node: MyNode }> = ({ node }) => {
    const { t } = useTranslation();
    return (
        <div className="initechNode">
            {t(`${node.name}`)}
        </div>
    );
};

export default MyNodeComponent;

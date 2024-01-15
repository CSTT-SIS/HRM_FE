import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import MyNodeComponent from './NodeComponent';
import { useTranslation } from 'react-i18next';
import { initechOrg } from './listOrganizations'

  const OrganizationChart: React.FC<{ }> = () => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="panel mt-6" style={{overflowY: "scroll"}}>
            <h1>{t('organization_structure')}</h1>
            <OrgChart tree={initechOrg} NodeComponent={MyNodeComponent} />
            </div>
  </div>
);
    };
    export default OrganizationChart;


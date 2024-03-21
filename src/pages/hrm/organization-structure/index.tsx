import {CustomOrgChartData, OrgChart, registerLicense } from '@yworks/react-yfiles-orgchart'
import '@yworks/react-yfiles-orgchart/dist/index.css'
import yFilesLicense from './license.json'
import data from './data.json'

type Employee = {
  id: number;
  name?: string;
  status?: string;
  position?: string;
  email?: string;
  phone?: string;
  description?: string;
  avatar?: string;
};

function MyOrgChartItem(props: RenderItemProps<CustomOrgChartItem<Employee>>) {
  const { dataItem } = props;
  return (
    <div
      className={`${dataItem.name === "Eric Joplin" ? "ceo" : "employee"} item`}
    >
      <div>{dataItem.name}</div>
    </div>
  );
}

function App() {
  return (
    <OrgChart
      data={data}
      renderItem={MyOrgChartItem}
      itemSize={{ width: 150, height: 100 }}
    ></OrgChart>
  );
}

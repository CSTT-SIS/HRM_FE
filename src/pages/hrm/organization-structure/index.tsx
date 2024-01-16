import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import MyNodeComponent from './NodeComponent';
import { useTranslation } from 'react-i18next';

const OrganizationChart: React.FC<{}> = () => {
	const { t } = useTranslation();
	const initechOrg = {
		name: 'Giám đốc',
		children: [
			{
				name: 'Phó Giám đốc phụ trách chế biến',
				children: [
					{
						name: 'Ban đốc nhà máy',
						children: [
							{
								name: 'Nhà máy nghiền khô',
							},
							{
								name: 'Nhà máy tuyến',
							},
							{
								name: 'Nhà máy luyện 2000 tấn, 500 tấn',
							},
							{
								name: 'Tổ kỹ thuật công nghệ, Tổ điện phân',
							},
						],
					},
				],
			},
			{
				name: 'Bộ phận Camera',
			},
			{
				name: 'Ban Giám sát',
			},
			{
				name: 'Phó Giám đốc thường trực',
				children: [
					{
						name: 'Phòng Phân tích, Tổ gia công mã hóa',
					},
					{
						name: 'Phòng Tổ chức hành chính',
						children: [
							{
								name: 'Tổ xe, Bộ phận cấp dưỡng, Bảo vệ',
							},
						],
					},
					{
						name: 'Phòng Kế hoạch vật tư',
						children: [
							{
								name: 'Tổ điện, Tổ làm ngoài, Bộ phận sửa chữa',
							},
						],
					},
					{
						name: 'Phòng Tài chính kế toán',
						children: [
							{
								name: 'Bộ phận kho vật tư',
							},
						],
					},
					{
						name: 'Phòng Kỹ thuật',
						children: [
							{
								name: 'Tổ gia công mẫu, Tổ môi trường',
							},
						],
					},
				],
			},
			{
				name: 'Phó Giám đốc khai thác',
				children: [
					{
						name: 'Bộ phận Kỹ thuật khai thác',
						children: [
							{
								name: 'Tổ lái xe Lào',
							},
							{
								name: 'Tổ lái xe Việt',
							},
							{
								name: 'Tổ máy',
							},
							{
								name: 'Tổ làm hồ',
							},
							{
								name: 'Bộ phận khoan nổ mình',
							},
						],
					},
					{
						name: 'Bộ phận Giám sát hành trình',
					},
				],
			},
		],
	};

	return (
		<div>
			<div className="panel mt-6" style={{ overflowY: 'scroll' }}>
				<h1>{t('organization_structure')}</h1>
				<OrgChart tree={initechOrg} NodeComponent={MyNodeComponent} />
			</div>
		</div>
	);
};
export default OrganizationChart;

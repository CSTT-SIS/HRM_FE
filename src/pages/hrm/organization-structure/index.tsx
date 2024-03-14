import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import MyNodeComponent from './NodeComponent';
import { useTranslation } from 'react-i18next';

const OrganizationChart: React.FC<{}> = () => {
	const { t } = useTranslation();
	const initechOrg = {
		name: 'Giám đốc',
        className: 'level-0',
		children: [
			{
				name: 'Phó Giám đốc phụ trách chế biến',
                className: 'level-1',
				children: [
					{
						name: 'Ban đốc nhà máy',
                        className: 'level-2',
						children: [
							{
								name: 'Nhà máy nghiền khô',
                                className: "level-3"
							},
							{
								name: 'Nhà máy tuyến',
                                className: "level-3"
							},
							{
								name: 'Nhà máy luyện 2000 tấn, 500 tấn',
                                className: "level-3"
							},
							{
								name: 'Tổ kỹ thuật công nghệ, Tổ điện phân',
                                className: "level-3"
							},
						],
					},
				],
			},
			{
				name: 'Bộ phận Camera',
                className: 'level-1',
			},
			{
				name: 'Ban Giám sát',
                className: 'level-1',
			},
			{
				name: 'Phó Giám đốc thường trực',
                className: 'level-1',
				children: [
					{
						name: 'Phòng Phân tích, Tổ gia công mã hóa',
                        className: 'level-2',
					},
					{
						name: 'Phòng Tổ chức hành chính',
                        className: 'level-2',
						children: [
							{
								name: 'Tổ xe, Bộ phận cấp dưỡng, Bảo vệ',
                                className: 'level-3',
							},
						],
					},
					{
						name: 'Phòng Kế hoạch vật tư',
                        className: 'level-2',
						children: [
							{
								name: 'Tổ điện, Tổ làm ngoài, Bộ phận sửa chữa',
                                className: 'level-3',
							},
						],
					},
					{
						name: 'Phòng Hành chính kế toán',
                        className: 'level-2',
						children: [
							{
								name: 'Bộ phận kho vật tư',
                                className: 'level-3',
							},
						],
					},
					{
						name: 'Phòng Kỹ thuật',
                        className: 'level-2',
						children: [
							{
								name: 'Tổ gia công mẫu, Tổ môi trường',
                                className: 'level-3',
							},
						],
					},
				],
			},
			{
				name: 'Phó Giám đốc khai thác',
                className: 'level-1',
				children: [
					{
						name: 'Bộ phận Kỹ thuật khai thác',
                        className: 'level-2',
						children: [
							{
								name: 'Tổ lái xe Lào',
                                className: "level-3"
							},
							{
								name: 'Tổ lái xe Việt',
                                className: "level-3"
							},
							{
								name: 'Tổ máy',
                                className: "level-3"
							},
							{
								name: 'Tổ làm hồ',
                                className: "level-3"
							},
							{
								name: 'Bộ phận khoan nổ mình',
                                className: "level-3"
							},
						],
					},
					{
						name: 'Bộ phận Giám sát hành trình',
                        className: "level-2"
					},
				],
			},
		],
	};

	return (
		<div>
            				<h1 className='uppercase company-name'>{t('organization_structure')}</h1>
            <h1 className='uppercase company-name'>VANGTAT MINING</h1>
			<div className="panel mt-6" style={{ overflowY: 'scroll' }}>
				<OrgChart tree={initechOrg} NodeComponent={MyNodeComponent} />
			</div>
		</div>
	);
};
export default OrganizationChart;

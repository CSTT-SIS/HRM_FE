import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import MyNodeComponent from './NodeComponent';
import { useTranslation } from 'react-i18next';

const OrganizationChart: React.FC<{}> = () => {
	const { t } = useTranslation();
	const initechOrg = {
		name: 'Tổng giám đốc',
        avatar: "/assets/images/profile-26.jpeg",
        className: 'level-0',
		children: [
            {
                name: 'P.Tổng giám đốc đối ngoại',
                avatar: "/assets/images/profile-26.jpeg",
                className: 'level-1'
            },
			{
                name: "P.Tổng giám đôc",
                description: "Giám đốc các dự án",
                avatar: "/assets/images/profile-26.jpeg",
                className: 'level-1',
                children: [
                    {
                        name: "Phó giám đốc thường trực công ty",
                        description: "",
                        avatar: "/assets/images/profile-26.jpeg",
                        className: 'level-2',
                        children: [
                            {
                                name: "Phòng Tài chính Kế toán",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Phòng Tổ chức hành chính",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Ban Giám sát",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Tổ camera",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            }
                        ]
                    },
                         {
                        name: "Phó giám đốc công ty phụ trách sản xuất",
                        description: "",
                        avatar: "/assets/images/profile-26.jpeg",
                        className: 'level-2',
                        children: [
                            {
                                name: "Phòng Kế hoạch vật tư",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Phòng Kỹ thuật",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Tổ Giám sát HT",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                            {
                                name: "Tổ Bảo dưỡng",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            },
                              {
                                name: "Đội sửa chữa (Gara)",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            }
                        ]
                    },
                      {
                        name: "Phó giám đốc công ty khai thác",
                        description: "",
                        avatar: "/assets/images/profile-26.jpeg",
                        className: 'level-2',
                        children: [
                            {
                                name: "Ban Giám đốc khai thác",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3',
                                children: [
                                    {
                                        name: "Các tổ khai thác",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                     {
                                        name: "Đội xe Lào, Việt",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                     {
                                        name: "Đội máy, đội khoan",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    }
                                ]
                            }
                        ]
                    },
                     {
                        name: "Phó giám đốc công ty phụ trách nhà máy",
                        description: "",
                        avatar: "/assets/images/profile-26.jpeg",
                        className: 'level-2',
                        children: [
                            {
                                name: "Ban Giám đốc nhà máy",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3',
                                children: [
                                    {
                                        name: "Tổ phân tích",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                     {
                                        name: "Tổ công nghệ",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                     {
                                        name: "Tổ cơ điện",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                    {
                                        name: "Nhà máy 2000",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                    {
                                        name: "Nhà máy nghiền khô",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                      {
                                        name: "Nhà máy 500",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    },
                                      {
                                        name: "Nhà máy điện phân",
                                        description: "",
                                        avatar: "/assets/images/profile-26.jpeg",
                                        className: 'level-4'
                                    }
                                ]
                            },
                            {
                                 name: "Tổ an ninh sản phẩm",
                                description: "",
                                avatar: "/assets/images/profile-26.jpeg",
                                className: 'level-3'
                            }
                        ]
                    }
				],
			},
	             {
                name: 'P.Tổng giám đốc',
                avatar: "/assets/images/profile-26.jpeg",
                className: 'level-1',
                description: "Phụ trách kỹ thuật"
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

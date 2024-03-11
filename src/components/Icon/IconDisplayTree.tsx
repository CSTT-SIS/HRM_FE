import { FC } from 'react';

interface IconDisplayTree {
    className?: string;
    fill?: string
}

const IconDisplayTree: FC<IconDisplayTree> = ({ className, fill }) => {
    return (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.25 0.5625C0.25 0.25184 0.50184 0 0.8125 0H5.3125C5.62316 0 5.875 0.25184 5.875 0.5625V2.8125C5.875 3.12316 5.62316 3.375 5.3125 3.375H0.8125C0.50184 3.375 0.25 3.12316 0.25 2.8125V0.5625Z" fill={fill} />
            <path d="M8.125 5.0625C8.125 4.75184 8.37684 4.5 8.6875 4.5H13.1875C13.4982 4.5 13.75 4.75184 13.75 5.0625V7.3125C13.75 7.62316 13.4982 7.875 13.1875 7.875H8.6875C8.37684 7.875 8.125 7.62316 8.125 7.3125V5.0625Z" fill={fill} />
            <path d="M8.125 10.125C8.125 9.81434 8.37684 9.5625 8.6875 9.5625H13.1875C13.4982 9.5625 13.75 9.81434 13.75 10.125V12.375C13.75 12.6857 13.4982 12.9375 13.1875 12.9375H8.6875C8.37684 12.9375 8.125 12.6857 8.125 12.375V10.125Z" fill={fill} />
            <path d="M8.125 15.1875C8.125 14.8768 8.37684 14.625 8.6875 14.625H13.1875C13.4982 14.625 13.75 14.8768 13.75 15.1875V17.4375C13.75 17.7482 13.4982 18 13.1875 18H8.6875C8.37684 18 8.125 17.7482 8.125 17.4375V15.1875Z" fill={fill} />
            <path d="M2.5 3.375H3.625V16.875H3.0625C2.75184 16.875 2.5 16.6232 2.5 16.3125V3.375Z" fill={fill} />
            <path d="M3.625 5.625H8.125V6.75H3.625V5.625Z" fill={fill} />
            <path d="M3.625 10.6875H8.125V11.8125H3.625V10.6875Z" fill={fill} />
            <path d="M3.625 15.75H8.125V16.875H3.625V15.75Z" fill={fill} />
        </svg>


    );
};

export default IconDisplayTree;
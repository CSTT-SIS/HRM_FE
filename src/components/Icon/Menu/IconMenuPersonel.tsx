import { FC } from 'react';

interface IconMenuPersonelProps {
    className?: string;
}

const IconMenuPersonel: FC<IconMenuPersonelProps> = ({ className }) => {
    return (

<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="14" height="14" fill="url(#pattern10)"/>
<defs>
<pattern id="pattern10" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_25_409" transform="scale(0.01)"/>
</pattern>
<image id="image0_25_409" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>

    );
};

export default IconMenuPersonel;

import { FC } from 'react';

interface IconMenuFormOTProps {
    className?: string;
}

const IconMenuFormOT: FC<IconMenuFormOTProps> = ({ className }) => {
    return (

<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="14" height="14" fill="url(#pattern_ot)"/>
<defs>
<pattern id="pattern_ot" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_25_477" transform="scale(0.01)"/>
</pattern>
<image id="image0_25_477" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>


    );
};

export default IconMenuFormOT;

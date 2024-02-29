import { FC } from 'react';

interface IconMenuShiftProps {
    className?: string;
}

const IconMenuShift: FC<IconMenuShiftProps> = ({ className }) => {
    return (


<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="14" height="14" fill="url(#pattern_shift)"/>
<defs>
<pattern id="pattern_shift" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_25_413" transform="scale(0.01)"/>
</pattern>
<image id="image0_25_413" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>

    );
};

export default IconMenuShift;

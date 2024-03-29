import { FC } from 'react';

interface IconMenuFormLateEarlyProps {
    className?: string;
}

const IconMenuFormLateEarly: FC<IconMenuFormLateEarlyProps> = ({ className }) => {
    return (

<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="16" height="16" fill="url(#pattern_late_early)"/>
<defs>
<pattern id="pattern_late_early" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_25_475" transform="scale(0.01)"/>
</pattern>
<image id="image0_25_475" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>

    );
};

export default IconMenuFormLateEarly;

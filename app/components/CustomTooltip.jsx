import { Tooltip } from '@mui/material';

export default function CustomTooltip(props) {
    return (
        <Tooltip
            {...props}
            title={props.title}
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -14],
                            },
                        },
                    ],
                },
            }}
        />
    );
}

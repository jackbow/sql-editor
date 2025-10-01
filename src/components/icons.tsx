import type React from 'react';

interface IconProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
}

export const SqlIcon: React.FC<IconProps> = ({
    width = 18,
    height = 18,
    className,
    stroke = "currentColor",
    strokeWidth = "1.5"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        className={className}
    >
        <title>SQL</title>
        <g fill="none" stroke={stroke} strokeWidth={strokeWidth}>
            <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z" />
            <path
                strokeLinecap="round"
                d="M8.415 10A1.5 1.5 0 1 0 7 12a1.5 1.5 0 1 1-1.415 2m6.915 1a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-1.5 1.5Zm0 0l1.5 1.5M16.5 9v4c0 .943 0 1.414.293 1.707S17.557 15 18.5 15"
            />
        </g>
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({
    width = 18,
    height = 18,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <title>run</title>
        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({
    width = 18,
    height = 18,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <title>copy</title>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
    width = 18,
    height = 18,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <title>copied!</title>
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({
    width = 20,
    height = 20,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        className={className}
    >
        <title>Send message</title>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
    </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({
    width = 20,
    height = 20,
    className,
    fill = "currentColor"
}) => (
    <svg
        className={className}
        width={width}
        height={height}
        fill={fill}
        viewBox="0 0 20 20"
    >
        <title>Error</title>
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
        />
    </svg>
);

export const RetryIcon: React.FC<IconProps> = ({
    width = 18,
    height = 18,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <title>retry</title>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = "2"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <title>settings</title>
        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const WarningIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    className,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = 2
}) => (
    <svg
        className={className}
        width={width}
        height={height}
        fill={fill}
        viewBox="0 0 24 24"
        stroke={stroke}
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
    </svg>
);

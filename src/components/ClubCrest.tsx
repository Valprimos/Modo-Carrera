interface ClubCrestProps {
  shape: 'shield' | 'circle' | 'hexagon';
  primary: string;
  secondary: string;
  size?: number;
}

/** Escudo sencillo generado por CSS/SVG a partir de forma + colores del club,
 * tal como pide el brief ("escudo sencillo") sin depender de assets externos. */
export function ClubCrest({ shape, primary, secondary, size = 32 }: ClubCrestProps) {
  const commonProps = { width: size, height: size, viewBox: '0 0 100 100' };

  if (shape === 'circle') {
    return (
      <svg {...commonProps}>
        <circle cx="50" cy="50" r="46" fill={primary} stroke={secondary} strokeWidth="6" />
      </svg>
    );
  }

  if (shape === 'hexagon') {
    return (
      <svg {...commonProps}>
        <polygon
          points="50,4 93,27 93,73 50,96 7,73 7,27"
          fill={primary}
          stroke={secondary}
          strokeWidth="5"
        />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path
        d="M50 4 L92 18 V52 C92 78 74 92 50 96 C26 92 8 78 8 52 V18 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="5"
      />
    </svg>
  );
}

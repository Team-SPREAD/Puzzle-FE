import React, { useMemo } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { getContrastingColor } from '@/utils/getContrastingColor';

type BothProps = {
  variant?: 'avatar' | 'more';
  size?: number;
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
  className?: string;
  style?: Record<string, string>;
};

type PictureProps = BothProps & {
  variant?: 'avatar';
  name?: string;
  src?: string;
  color: [string, string];
  statusColor?: string;
  count?: never;
};

type MoreProps = BothProps & {
  variant: 'more';
  count: number;
  src?: never;
  name?: never;
  statusColor?: never;
  color?: never;
};

type AvatarProps = PictureProps | MoreProps;

export function Avatar({
  variant = 'avatar',
  src = '',
  name = '',
  color = ['', ''],
  size = 36,
  statusColor = '',
  outlineColor = '',
  outlineWidth = 2,
  borderRadius = 9999,
  className = '',
  style = {},
  count = 0,
}: AvatarProps) {
  const innerVariant = variant === 'avatar' && !src ? 'letter' : variant;
  const realSize = size - outlineWidth * 2;

  return (
    <div
      style={{
        height: realSize,
        width: realSize,
        boxShadow: `${outlineColor} 0 0 0 ${outlineWidth}px`,
        margin: outlineWidth,
        borderRadius,
        ...style,
      }}
      className={classNames('avatar text-sm', className)}
      data-tooltip={name}
    >
      {innerVariant === 'more' && (
        <MoreCircle count={count} borderRadius={borderRadius} />
      )}

      {innerVariant === 'avatar' && (
        <PictureCircle
          name={name}
          src={src}
          size={realSize}
          borderRadius={borderRadius}
        />
      )}

      {innerVariant === 'letter' && (
        <LetterCircle name={name} color={color} borderRadius={borderRadius} />
      )}

      {statusColor && (
        <span
          style={{ backgroundColor: statusColor }}
          className="status w-2 h-2"
        />
      )}
    </div>
  );
}

function LetterCircle({
  name,
  color,
  borderRadius,
}: Pick<PictureProps, 'name' | 'color' | 'borderRadius'>) {
  const textColor = useMemo(
    () => (color ? getContrastingColor(color[1]) : undefined),
    [color],
  );

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
        borderRadius,
      }}
      className="letter"
    >
      <div className="letterCharacter" style={{ color: textColor }}>
        {name ? name.charAt(0) : null}
      </div>
    </div>
  );
}

function PictureCircle({
  name,
  src = '',
  size,
  borderRadius,
}: Pick<PictureProps, 'name' | 'src' | 'size' | 'borderRadius'>) {
  return (
    <Image
      alt={name ?? ''}
      src={src}
      height={size}
      width={size}
      style={{ borderRadius }}
    />
  );
}

function MoreCircle({
  count,
  borderRadius,
}: Pick<MoreProps, 'count' | 'borderRadius'>) {
  return (
    <div style={{ borderRadius }} className="more">
      +{count}
    </div>
  );
}

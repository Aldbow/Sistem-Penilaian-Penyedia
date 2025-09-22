import React from 'react';

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  gradient?: 'blue' | 'purple' | 'teal' | 'orange';
  as?: keyof JSX.IntrinsicElements;
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ children, className = '', gradient = 'blue', as: Tag = 'span', ...props }, ref) => {
    const gradientClasses = {
      blue: 'from-blue-600 to-blue-400',
      purple: 'from-purple-600 to-purple-400',
      teal: 'from-teal-600 to-teal-400',
      orange: 'from-orange-600 to-orange-400',
    };

    return (
      <Tag
        ref={ref}
        className={`bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`}
        style={{ lineHeight: '1.5' }}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

GradientText.displayName = 'GradientText';

export { GradientText };
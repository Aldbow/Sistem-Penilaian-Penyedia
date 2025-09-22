import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'blue' | 'purple' | 'teal' | 'orange';
  as?: keyof JSX.IntrinsicElements;
}

const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className = '', 
  gradient = 'blue', 
  as,
  ...props 
}) => {
  const gradientClasses = {
    blue: 'from-blue-600 to-blue-400',
    purple: 'from-purple-600 to-purple-400',
    teal: 'from-teal-600 to-teal-400',
    orange: 'from-orange-600 to-orange-400',
  };

  const combinedClassName = `bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`;
  const style = { lineHeight: '1.5' };

  // Handle different element types explicitly to avoid TypeScript conflicts
  switch (as) {
    case 'h1':
      return <h1 className={combinedClassName} style={style} {...props}>{children}</h1>;
    case 'h2':
      return <h2 className={combinedClassName} style={style} {...props}>{children}</h2>;
    case 'h3':
      return <h3 className={combinedClassName} style={style} {...props}>{children}</h3>;
    case 'h4':
      return <h4 className={combinedClassName} style={style} {...props}>{children}</h4>;
    case 'h5':
      return <h5 className={combinedClassName} style={style} {...props}>{children}</h5>;
    case 'h6':
      return <h6 className={combinedClassName} style={style} {...props}>{children}</h6>;
    case 'p':
      return <p className={combinedClassName} style={style} {...props}>{children}</p>;
    default:
      return <span className={combinedClassName} style={style} {...props}>{children}</span>;
  }
};

export { GradientText };
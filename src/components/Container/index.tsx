import React from 'react';
// Types
import type { ContainerProps } from '../../types/components';
// Styles
import '../../sass/components/container.scss';

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  // Override custom container styles that limit the maximum size of columns.
  const currentClassName = className
    ? className
    : 'container-responsive-detecter';

  return <div className={currentClassName}>{children}</div>;
};

export default Container;

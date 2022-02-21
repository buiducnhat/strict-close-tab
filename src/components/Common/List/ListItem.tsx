import React from 'react';

import styles from './list.module.css';

interface ListItemProps extends React.HTMLProps<HTMLDivElement> {
  active?: boolean;
}

export default function ListItem({ active, children, ...rest }: ListItemProps) {
  let className = 'w-100 p-2';
  className += ' ' + styles.listItem;
  className += active ? ' ' + styles.listItemActive : '';

  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

import React from 'react';
import { Card } from 'ui-neumorphism';

export default function ListGroup({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className="p-1" {...rest}>
      {children}
    </Card>
  );
}

import { Box } from '@mui/material';
import type React from 'react';

interface TabPanelProps {
  index: number;
  value: number;
  prefix: string;
  children?: React.ReactNode;
}

export function TabPanel({ index, value, prefix, children }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={index !== value}
      id={`${prefix}-tabpanel-${index}`}
      aria-labelledby={`${prefix}-tab-${index}`}
    >
      {children}
    </Box>
  );
}

import React from 'react';
import {
    Box,
    Container,
    useTheme
} from '@mui/material';
import { TaxContributions } from './TaxContributions';

export const Dashboard: React.FC = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 3 }}>
                <TaxContributions />
            </Box>
        </Container>
    );
};

import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Container,
    useTheme
} from '@mui/material';
import { TaxContributions } from './TaxContributions';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const Dashboard: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const theme = useTheme();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={tabIndex} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: '1rem',
                            textTransform: 'none',
                            minWidth: 120,
                        }
                    }}
                >
                    <Tab label="Fatture" />
                    <Tab label="Tasse e Contributi" />
                    {/* Add other tabs as needed */}
                </Tabs>
            </Box>

            <TabPanel value={tabIndex} index={0}>
                {/* Add your Invoices component here */}
                <Box p={3}>
                    Componente Fatture
                </Box>
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
                <TaxContributions />
            </TabPanel>
        </Container>
    );
};

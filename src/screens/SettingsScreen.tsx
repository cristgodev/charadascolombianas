import React from 'react';
import { Container, AppText, Button } from '../components';

export const SettingsScreen = ({ navigation }: any) => {
    return (
        <Container centered>
            <AppText variant="subheader">Settings</AppText>
            <Button title="Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} variant="outline" />
        </Container>
    );
};

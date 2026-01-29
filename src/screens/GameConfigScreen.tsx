import React from 'react';
import { Container, AppText, Button } from '../components';

export const GameConfigScreen = ({ navigation }: any) => {
    return (
        <Container centered>
            <AppText variant="subheader">Setup Game</AppText>
            <Button title="Next" onPress={() => navigation.navigate('CategorySelection')} style={{ marginTop: 20 }} />
        </Container>
    );
};

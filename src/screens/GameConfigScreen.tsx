import React from 'react';
import { ImageBackground } from 'react-native';
import { Container, AppText, Button } from '../components';

export const GameConfigScreen = ({ navigation }: any) => {
    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resizeMode="cover"
        >
            <Container centered style={{ backgroundColor: 'transparent' }}>
                <AppText variant="subheader">Setup Game</AppText>
                <Button title="Next" onPress={() => navigation.navigate('CategorySelection')} style={{ marginTop: 20 }} />
            </Container>
        </ImageBackground>
    );
};

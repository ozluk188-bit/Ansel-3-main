import { ActivityIndicator, View } from 'react-native';

// This is the entry point for the app. It will immediately redirect to the login or tabs screen.
// The logic is handled in the root _layout.tsx file.
// This component just satisfies the router so it doesn't show a 404.

const StartPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default StartPage;

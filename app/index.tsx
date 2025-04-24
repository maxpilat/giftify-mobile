import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuth, token } = useAuth();

  console.log(token);

  if (isAuth()) return <Redirect href="./(tabs)" />;

  return <Redirect href="./(auth)" />;
}

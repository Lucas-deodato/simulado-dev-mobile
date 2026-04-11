import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator, Platform , StatusBar as RNStatusBar } from 'react-native';
import { globalStyles } from './src/styles/global';
import News from './src/components/News';
import { fetchNewsService, NewsData } from './src/utils/handle-api';


const statusBarHeight = Platform.OS ==='android' ? RNStatusBar.currentHeight ?? 0 : 0;

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsService();
      setNewsList(data);
    } catch (err: any) {
      setError(err.message || "Erro ao obter notícias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Últimas notícias</Text>
        {!loading && !error && (
          <Text style={{ textAlign: 'center', marginVertical: 8 }}>
            {newsList.length} notícias encontradas
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando notícias...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {newsList.map((item) => (
            <News
              key={item.id.toString()}
              title={item.title}
              image={item.image}
              published={item.published}
              link={item.link}
              summary={item.summary}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor.backgroundColor,
  },
  header: {
    padding: 16,
    paddingTop: statusBarHeight,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    // Ensure header is spaced from exact top
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: globalStyles.bodyFontSize.fontSize,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
});

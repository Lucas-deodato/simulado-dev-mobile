import React, { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, Platform , StatusBar as RNStatusBar, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from './src/styles/global';
import News from './src/components/News';
import { fetchNewsService, NewsData } from './src/utils/handle-api';


const statusBarHeight = Platform.OS ==='android' ? RNStatusBar.currentHeight ?? 0 : 0;

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const filteredAndSortedNews = useMemo(() => {
    // Filtrar por searchQuery (título e resumo)
    let filtered = newsList.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const summaryMatch = item.summary?.toLowerCase().includes(searchLower) ?? false;
      return titleMatch || summaryMatch;
    });

    // Ordenar por published
    filtered.sort((a, b) => {
      const dateA = new Date(a.published).getTime();
      const dateB = new Date(b.published).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [newsList, searchQuery, sortOrder]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Últimas notícias</Text>
        
        {/* TextInput de busca */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notícias..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />

        {/* Botão de ordenação e contador */}
        <View style={styles.headerFooter}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOrder === 'desc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            <Text style={[
              styles.sortButtonText,
              sortOrder === 'desc' && styles.sortButtonTextActive,
            ]}>
              {sortOrder === 'desc' ? '↓ Mais recentes' : '↑ Mais antigas'}
            </Text>
          </TouchableOpacity>

          {!loading && !error && (
            <Text style={styles.counterText}>
              {filteredAndSortedNews.length} notícia{filteredAndSortedNews.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
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
        <FlatList
          data={filteredAndSortedNews}
          renderItem={({ item }) => (
            <News
              title={item.title}
              image={item.image}
              published={item.published}
              link={item.link}
              summary={item.summary}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma notícia disponível no momento.</Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
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
    paddingHorizontal: 16,
    paddingTop: statusBarHeight,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  sortButtonActive: {
    backgroundColor: '#0000ff',
    borderColor: '#0000ff',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  counterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginVertical: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { NewsData } from '../utils/handle-api';

interface NewsDetailProps {
  news: NewsData | null;
  onClose: () => void;
}

export default function NewsDetail({ news, onClose }: NewsDetailProps) {
  const [imageError, setImageError] = React.useState(false);

  if (!news) return null;

  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(news.link);
      if (supported) {
        await Linking.openURL(news.link);
      } else {
        console.warn(`Não foi possível abrir a URL: ${news.link}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão Fechar no topo */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Imagem com fallback */}
        {(!news.image || imageError) ? (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackText}>Sem imagem</Text>
          </View>
        ) : (
          <Image
            style={styles.image}
            source={{ uri: news.image }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Título */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Data de publicação */}
        <Text style={styles.date}>{news.published}</Text>

        {/* Resumo completo */}
        <Text style={styles.summary}>{news.summary}</Text>

        {/* Botão Ler notícia completa */}
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleOpenLink}
          activeOpacity={0.7}
        >
          <Text style={styles.readMoreButtonText}>Ler notícia completa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageFallback: {
    width: '100%',
    height: 220,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageFallbackText: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  readMoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

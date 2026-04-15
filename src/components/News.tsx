import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NewsData } from '../utils/handle-api';

interface NewsProps {
  news: NewsData;
  onPress: (news: NewsData) => void;
}

export default function News({ news, onPress }: NewsProps) {
  const [ imageError, setImageError ] = React.useState(false)

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(news)} activeOpacity={0.7}>
      {(!news.image || imageError) ? (
        (<View style={styles.imageFallback}> <Text>Sem imagem</Text> </View>)
      ) : <Image style={styles.image} source={{ uri: news.image }} resizeMode="cover" onError={() => setImageError(true)} />}
      
      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text>

        {news.summary && (
          <Text numberOfLines={2} style={styles.summary}> 
            {news.summary} 
          </Text>
        )}
        
        <Text style={styles.date}>{news.published}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    fontSize:14,
    color:'#444',
    marginBottom:8,
  },
  imageFallback: {
    width:'100%',
    height:180,
    backgroundColor:'#ccc',
    justifyContent:'center',
    alignItems:'center',
  },
});

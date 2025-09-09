from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import yt_dlp
import os

@api_view(['POST'])
def download_video(request):
    url = request.data.get('url')
    quality = request.data.get('quality', 'best')
    
    if not url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        os.makedirs('downloads', exist_ok=True)
        
        ydl_opts = {
            'outtmpl': 'downloads/%(title)s.%(ext)s',
            'format': quality,
            'merge_output_format': 'mp4', 
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4', 
                
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'video')
            format_id = info.get('format_id', 'unknown')
            ext = info.get('ext', 'unknown')
            
        return Response({
            'success': True,
            'message': f'Video "{title}" descargado en {quality} (MP4)',
            'title': title,
            'quality': format_id,
            'format': 'mp4'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def check_url(request):
    """Verificar si una URL es soportada y obtener información básica del video"""
    url = request.data.get('url')
    
    if not url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        
        ydl_opts = {
            'quiet': True,  
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Solo extraer información del video
            info = ydl.extract_info(url, download=False)
            
            return Response({
                'supported': True,
                'title': info.get('title', 'Título no disponible'),
                'uploader': info.get('uploader', 'Desconocido'),
                'duration': info.get('duration'),
                'extractor': info.get('extractor_key', 'Desconocido'),
                'thumbnail': info.get('thumbnail'),
                'view_count': info.get('view_count'),
                'upload_date': info.get('upload_date')
            })
            
    except Exception as e:
        return Response({
            'supported': False,
            'error': str(e)
        })

@api_view(['GET'])
def supported_sites(request):
    """Obtener lista de sitios web soportados por yt-dlp"""
    try:
        
        popular_sites = [
            'YouTube', 'Vimeo', 'TikTok', 'Twitch', 'Facebook', 'Instagram',
            'Twitter/X', 'Dailymotion', 'Reddit', 'LinkedIn', 'Pinterest',
            'Spotify', 'SoundCloud', 'Bandcamp', 'Archive.org', 'BBC',
            'CNN', 'ESPN', 'NBC', 'CBS', 'Fox News', 'MTV', 'Comedy Central',
            'Crunchyroll', 'Funimation', 'Pornhub', 'Xvideos', 'YouPorn'
        ]
        
        return Response({
            'supported_sites': popular_sites,
            'total_supported': 'Más de 1000 sitios web',
            'note': 'Esta es una muestra de los sitios más populares. yt-dlp soporta muchos más.'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
